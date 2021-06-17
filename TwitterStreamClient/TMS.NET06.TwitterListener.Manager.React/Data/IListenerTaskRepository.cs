using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TMS.NET06.TwitterListener.Data.Models;

namespace TMS.NET06.TwitterListener.Manager.React.Data
{
    public interface IListenerTaskRepository
    {
        Task<IEnumerable<ListenerTask>> GetListenersTaskAsync(int currentPage, int taskPerPage);
        Task<IEnumerable<ListenerTask>> GetFilteredListenersTasAsync(int currentPage, int taskPerPage, string searchText);
        Task<Dictionary<int, string>> GetTaskStatusesMatching();
    }
}
