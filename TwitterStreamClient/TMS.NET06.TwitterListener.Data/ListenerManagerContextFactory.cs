using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TMS.NET06.TwitterListener.Data;

namespace TMS.NET06.TwitterListener.Data
{
    public class ListenerManagerContextFactory : IDesignTimeDbContextFactory<ListenerManagerContext>
    {
        public ListenerManagerContext CreateDbContext(string[] args)
        {
            var connectionString = args[0];
            return new ListenerManagerContext(connectionString);
        }
    }
}
