using AcademyAPI.DTOs;
using AcademyAPI.DTOs.Student;
using AcademyAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AcademyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterStudentRequest request)
        {
            var result = _authService.Register(request);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            var result = _authService.Login(request);

            if (!result.Success)
                return Unauthorized(result);

            return Ok(result);
        }
    }
}