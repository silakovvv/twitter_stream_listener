using System;

namespace TMS.NET06.TwitterListener.Data.Models
{
    public class ListenerOptions
    {
        public string[] FilterRules { get; set; }
        public TwitterFilteringMode Mode { get; set; }
    }
}