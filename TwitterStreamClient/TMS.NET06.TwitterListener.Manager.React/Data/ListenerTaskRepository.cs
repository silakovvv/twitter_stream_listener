using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TMS.NET06.TwitterListener.Data;
using TMS.NET06.TwitterListener.Data.Models;

namespace TMS.NET06.TwitterListener.Manager.React.Data
{
    public class ListenerTaskRepository : IListenerTaskRepository
    {
        private readonly IConfiguration _configuration;

        public ListenerTaskRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private ListenerManagerContext CreateContext()
        {
            return new ListenerManagerContext(_configuration.GetConnectionString("ListenerManagerConnection"));
        }

        public async Task<IEnumerable<ListenerTask>> GetListenersTaskAsync()
        {
            await using var context = CreateContext();
            return await context.ListenerTasks.ToListAsync();
        }

        public async Task<IEnumerable<ListenerTask>> GetFilteredListenersTasAsync(string searchText)
        {
            await using var context = CreateContext();
            return await context.ListenerTasks
                                //.OrderBy(w => w.Name)
                                //.Skip((page - 1) * itemsPerPage)
                                .Where(t => t.Name.Contains(searchText)) //|| t.ListenerOptions.FilterRules.Contains(searchText)
                                .ToListAsync();
        }

        public async Task<Dictionary<int, string>> GetTaskStatusesMatching()
        {
            var taskStatusesMatching = new Dictionary<int, string>();

            foreach (int valueStatus in Enum.GetValues(typeof(ListenerTaskStatus)))
            {
                taskStatusesMatching.Add(valueStatus, Enum.GetName(typeof(ListenerTaskStatus), valueStatus).ToLower());
            }

            return taskStatusesMatching;
        }
    }
}
