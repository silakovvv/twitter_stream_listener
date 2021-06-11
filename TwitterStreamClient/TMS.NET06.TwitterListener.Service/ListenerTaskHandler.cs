using Quartz;
using Quartz.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TMS.NET06.TwitterListener.Data.Models;

namespace TMS.NET06.TwitterListener.Service
{
    class ListenerTaskHandler : IJob
    {
        public async Task Execute(IJobExecutionContext context)
        {
            var schedulerContext = context.Scheduler.Context;
            var listenerTask = (ListenerTask)schedulerContext.Get("listenerTask");

            await Console.Out.WriteLineAsync("Task in progress #" + listenerTask.TaskId.ToString());
        }
    }
}
