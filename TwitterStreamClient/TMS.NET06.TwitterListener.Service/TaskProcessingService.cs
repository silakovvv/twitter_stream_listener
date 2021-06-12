using Quartz;
using Quartz.Impl;
using System;
using System.Threading.Tasks;
using System.Linq;
using TMS.NET06.TwitterListener.Data;
using TMS.NET06.TwitterListener.Data.Models;
using static Quartz.MisfireInstruction;


namespace TMS.NET06.TwitterListener.Service
{
    public class TaskProcessingService : IJob
    {
        private DateTime _startDateCurrentProcess;

        public async Task Execute(IJobExecutionContext context)
        {
            await Console.Out.WriteLineAsync("Scheduler work!");

            var schedulerContext = context.Scheduler.Context;
            var intervalInMinutes = (int)schedulerContext.Get("intervalInMinutes");

            _startDateCurrentProcess = DateTime.Now;
            DateTime? nextValidDate;

            using (var listenerManagerContext = new ListenerManagerContext())
            {
                var listenerTasks = listenerManagerContext.ListenerTasks
                                                         .Where(to => to.TaskOptions.StartDate <= DateTime.Now && to.TaskOptions.EndDate >= DateTime.Now)
                                                         .Where(t => t.Status != ListenerTaskStatus.Processing)
                                                         .ToList();              
                
                if (listenerTasks.Count == 0) return;

                foreach (var listenerTask in listenerTasks)
                {
                    nextValidDate = GetNextValidDate(listenerTask.TaskOptions.CronSchedule);

                    if (!nextValidDate.HasValue || _startDateCurrentProcess > nextValidDate 
                        || _startDateCurrentProcess.AddMinutes(intervalInMinutes) < nextValidDate)
                    {
                        continue;
                    }
                    
                    StartTask(listenerTask, nextValidDate.Value);
                }
            }

        }

        public static async void StartTask(ListenerTask listenerTask, DateTime dueDate)
        {
            IScheduler scheduler = await StdSchedulerFactory.GetDefaultScheduler();
            await scheduler.Start();

            scheduler.Context.Put("TaskId", listenerTask.TaskId);
            scheduler.Context.Put("dueDate", dueDate);

            IJobDetail job = JobBuilder.Create<ListenerTaskHandler>().Build();

            string triggerName = $"trigger_{listenerTask.TaskId}_{DateTime.Now.ToString("yyyyMMdd_hh:mm:ss")}";

            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity(triggerName, "TasksGroup")
                .StartAt(dueDate)
                .EndAt(DateTime.Now.AddMinutes(listenerTask.TaskOptions.Duration + 5))
                .Build();

            await scheduler.ScheduleJob(job, trigger);
        }

        private DateTime? GetNextValidDate(string expression)
        {
            var CronExpression = new CronExpression(expression); // { TimeZone = TimeZoneInfo.Utc };

            var nextValidDate = CronExpression.GetNextValidTimeAfter(_startDateCurrentProcess.ToUniversalTime());

            if (nextValidDate.HasValue)
            {
                return nextValidDate.Value.DateTime.ToLocalTime();
            }

            return null;
        }
    }
}
