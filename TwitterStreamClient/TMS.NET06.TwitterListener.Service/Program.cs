using Quartz;
using Quartz.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TMS.NET06.TwitterListener.Data;
using TMS.NET06.TwitterListener.Data.Models;

namespace TMS.NET06.TwitterListener.Service
{
    class Program
    {
        public static async Task Main(string[] args)
        //public static void Main(string[] args)
        {
            await RunServiceCommandLine();

            /*using (var listenerManagerContext = new ListenerManagerContext())
            {
                var listenerTask = listenerManagerContext.ListenerTasks
                                                         .Where(to => to.TaskOptions.StartDate <= DateTime.Now && to.TaskOptions.EndDate >= DateTime.Now)
                                                         .Where(t => t.Status != ListenerTaskStatus.Processing)
                                                         .ToList();

                foreach (var task in listenerTask)
                {
                    Console.WriteLine(task.Name);
                }
            }*/
        }

        public static async Task RunServiceCommandLine()
        {
            StdSchedulerFactory factory = new StdSchedulerFactory();
            IScheduler scheduler = await factory.GetScheduler();

            IJobDetail job = JobBuilder.Create<TaskProcessingService>()
                                       .WithIdentity("Service", "MainGroup")
                                       .Build();

            ITrigger trigger;

            bool serviceWork = false;

            string command = "";
            int intervalInMinutes = 0;
            string intervalInMinutesAsString = "";

            while (true)
            {
                Console.WriteLine("Enter command ('help' to invoke helper):");
                command = Console.ReadLine();

                switch (command)
                {
                    case "help":
                        Console.WriteLine("\thelp\t-\tget a list of command");
                        Console.WriteLine("\tstart\t-\tstart service");
                        Console.WriteLine("\tstop\t-\tstop service");
                        Console.WriteLine("\tclose\t-\tclose programm\n");
                        break;
                    case "start":
                        Console.WriteLine("Enter the execution interval in minutes:");
                        intervalInMinutesAsString = Console.ReadLine();

                        if (Int32.TryParse(intervalInMinutesAsString, out int minutes) && minutes > 0)
                        {
                            intervalInMinutes = minutes;
                        }
                        else
                        {
                            Console.WriteLine("Interval entered incorrectly.");
                            break;
                        }

                        scheduler = await factory.GetScheduler();
                        await scheduler.Start();
                        
                        scheduler.Context.Put("intervalInMinutes", intervalInMinutes);

                        trigger = TriggerBuilder.Create()
                                                .WithIdentity("ServiceTrigger", "MainGroup")
                                                .StartNow()
                                                .WithSimpleSchedule(x => x
                                                    //.WithIntervalInSeconds(10) //for the tests
                                                    .WithIntervalInMinutes(intervalInMinutes)
                                                    .RepeatForever())
                                                .Build();
                        
                        await scheduler.ScheduleJob(job, trigger);

                        serviceWork = true;

                        break;
                    case "stop":
                        await scheduler.Shutdown();
                        serviceWork = false;
                        break;
                    case "close":
                        if (serviceWork)
                        {
                            await scheduler.Shutdown();
                            serviceWork = false;
                        }
                        return;
                    default:
                        Console.WriteLine("Could not define command!");
                        break;
                }
            }
        }
    }
}
