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

        public async Task<IEnumerable<ListenerTask>> GetListenersTaskAsync(int currentPage, int taskPerPage)
        {
            await using var context = CreateContext();
            return await context.ListenerTasks.OrderBy(t => t.TaskId)
                                              .Skip((currentPage - 1) * taskPerPage)
                                              .Take(taskPerPage)
                                              .ToListAsync();
        }

        public async Task<IEnumerable<ListenerTask>> GetFilteredListenersTaskAsync(int currentPage, int taskPerPage, string searchText)
        {
            await using var context = CreateContext();
            return await context.ListenerTasks
                                .Where(t => t.Name.Contains(searchText)) //|| t.ListenerOptions.FilterRules.Contains(searchText)
                                .OrderBy(t => t.TaskId)
                                .Skip((currentPage - 1) * taskPerPage)
                                .Take(taskPerPage)
                                .ToListAsync();
        }

        public async Task<int> GetCountTasksAsync(string searchText)
        {
            int count = 0;

            await using var context = CreateContext();

            if (searchText != null && searchText != "undefined")
            {
                count = context.ListenerTasks.Count(t => t.Name.Contains(searchText));
            }
            else
            {
                count = context.ListenerTasks.Count();
            }

            return count;
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
