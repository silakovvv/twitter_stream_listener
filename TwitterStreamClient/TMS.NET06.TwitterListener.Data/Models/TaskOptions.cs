using System;

namespace TMS.NET06.TwitterListener.Data.Models
{
    public class TaskOptions
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Duration { get; set; }
        public string CronSchedule { get; set; }
    }
}