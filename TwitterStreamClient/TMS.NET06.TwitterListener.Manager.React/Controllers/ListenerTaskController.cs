using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TMS.NET06.TwitterListener.Data.Models;
using TMS.NET06.TwitterListener.Manager.React.Data;

namespace TMS.NET06.TwitterListener.Manager.React.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ListenerTaskController : ControllerBase
    {
        private readonly ILogger<ListenerTaskController> _logger;
        private readonly IListenerTaskRepository _listenerTaskRepository;

        public ListenerTaskController(
            ILogger<ListenerTaskController> logger,
            IListenerTaskRepository listenerTaskRepository)
        {
            _logger = logger;
            _listenerTaskRepository = listenerTaskRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<ListenerTask>> GetAsync(string search)
        {
            return await _listenerTaskRepository.GetListenersTaskAsync();
        }

        //[HttpGet("{search}")]
        //public async Task<IEnumerable<ListenerTask>> GetFilteredListenerTasksAsync(string search)
        //{
        //    return await _listenerTaskRepository.GetFilteredListenersTasAsync(search);
        //}

        [HttpPost]
        [Route("[action]")]
        public async Task<Dictionary<int, string>> TaskStatusesMatchingAsync()
        {
            return await _listenerTaskRepository.GetTaskStatusesMatching();
        }
    }
}
