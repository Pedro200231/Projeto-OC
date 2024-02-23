using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using BACKEND.AuthServices;
using Microsoft.Extensions.Configuration;
using BACKEND.Repositories;
using BACKEND.Models;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserRepository _userRepository;
        private readonly AuthService _authService;

        public UsersController(IConfiguration configuration)
        {
            _userRepository = new UserRepository(configuration);
            _authService = new AuthService(_userRepository);
        }

        [HttpGet("GetUsers")]
        public async Task<ActionResult> Get()
        {
            var users = await _userRepository.GetUsersAsync();
            return Ok(users);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
        {
            return await _authService.AuthenticateAsync(request);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterRequest request)
        {
            return await _authService.RegisterAsync(request);
        }
    }
}


