using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TMS.NET06.TwitterListener.Data.Models
{
    public class ListenerResult
    {
        public int ResultId { get; set; }
        public DateTime ProcessingDate { get; set;  }
        public ListenerTask Task { get; set; }
        public int TaskId { get; set; }
        public string ResultInFormatJSON { get; set; }
    }
}
