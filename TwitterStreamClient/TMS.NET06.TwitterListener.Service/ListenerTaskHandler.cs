using Quartz;
using Quartz.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TMS.NET06.TwitterListener.Data;
using TMS.NET06.TwitterListener.Data.Models;

namespace TMS.NET06.TwitterListener.Service
{
    class ListenerTaskHandler : IJob
    {
        public async Task Execute(IJobExecutionContext context)
        {
            var schedulerContext = context.Scheduler.Context;
            var TaskId = (int)schedulerContext.Get("TaskId");
            var dueDate = (DateTime)schedulerContext.Get("dueDate");

            await Console.Out.WriteLineAsync("Task in progress #" + TaskId.ToString());

            var twitterListener = new TMS.NET06.TwitterListener.API.TwitterListener();

            using (var listenerManagerContext = new ListenerManagerContext())
            {
                var listenerTask = listenerManagerContext.ListenerTasks.Single(t => t.TaskId == TaskId);

                listenerTask.Status = ListenerTaskStatus.Processing;
                listenerManagerContext.SaveChanges();

                var tweets = await twitterListener.ListenStreamInRealTimeAsync(
                                                    listenerTask.ListenerOptions.FilterRules,
                                                    DateTime.Now.AddMinutes(listenerTask.TaskOptions.Duration),
                                                    (int)listenerTask.ListenerOptions.Mode);

                if (tweets == null || tweets.Count == 0)
                {
                    listenerTask.Status = ListenerTaskStatus.Failed;
                    listenerManagerContext.SaveChanges();
                    return;
                }

                var listenerResult = new ListenerResult()
                {
                    TaskId = TaskId,
                    ResultInFormatJSON = twitterListener.GetTweetsInFormatJSON(tweets),
                    ProcessingDate = dueDate
                };

                listenerManagerContext.ListenerResults.Add(listenerResult);

                listenerTask.Status = ListenerTaskStatus.Succeeded;
                listenerManagerContext.SaveChanges();

                //listenerTask.ListenerOptions = new ListenerOptions() {
                //    FilterRules = new string[]
                //    {
                //        "@Boeing",
                //        "has:links"
                //    },
                //    Mode = TwitterFilteringMode.All
                //};
            }
        }
    }
}
