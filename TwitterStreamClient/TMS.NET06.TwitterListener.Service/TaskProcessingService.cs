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


        public async Task Execute(IJobExecutionContext context)
        {
            await Console.Out.WriteLineAsync("Scheduler work!");

            var schedulerContext = context.Scheduler.Context;
            var intervalInMinutes = (int)schedulerContext.Get("intervalInMinutes");

            DateTime startDateCurrentProcess = DateTime.Now;
            DateTime nextValidDate;

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

                    if (nextValidDate == DateTime.MinValue || startDateCurrentProcess.AddMinutes(intervalInMinutes) < nextValidDate)
                    {
                        continue;
                    }

                    //await Console.Out.WriteLineAsync("Task in progress #" + listenerTask.TaskId.ToString());
                    
                    StartTask(listenerTask, nextValidDate);
                }
            }

        }

        public static async void StartTask(ListenerTask listenerTask, DateTime dueDate)
        {
            IScheduler scheduler = await StdSchedulerFactory.GetDefaultScheduler();
            await scheduler.Start();

            scheduler.Context.Put("listenerTask", listenerTask);

            IJobDetail job = JobBuilder.Create<ListenerTaskHandler>().Build();

            string triggerName = $"trigger_{listenerTask.TaskId}_{DateTime.Now.ToString("yyyyMMdd_hh:mm:ss")}";

            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity(triggerName, "TasksGroup")
                .StartAt(dueDate)
                .Build();

            await scheduler.ScheduleJob(job, trigger);
        }

        private DateTime GetNextValidDate(string expression)
        {
            var CronExpression = new CronExpression(expression) { TimeZone = TimeZoneInfo.Utc };
            var nextValidDateOffset = (DateTimeOffset)CronExpression.GetNextValidTimeAfter(DateTime.Now);

            return nextValidDateOffset.DateTime;
        }
    }
}
