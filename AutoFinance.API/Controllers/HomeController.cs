using Microsoft.AspNetCore.Mvc;

namespace AutoFinance.API.Controllers
{
    [ApiController]
    [Route("/")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("AutoFinance API is running");
        }
    }
}
