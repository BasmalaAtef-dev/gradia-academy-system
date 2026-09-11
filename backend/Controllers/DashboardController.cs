using AcademyAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AcademyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly ITeacherService _teacherService;
        private readonly IStudentService _studentService;

        public DashboardController(
            IDashboardService dashboardService,
            ITeacherService teacherService,
            IStudentService studentService)
        {
            _dashboardService = dashboardService;
            _teacherService = teacherService;
            _studentService = studentService;
        }

        [HttpGet("summary")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var result = await _dashboardService.GetDashboardSummaryAsync();
            return Ok(result);
        }

        [HttpGet("activity")]
        public async Task<IActionResult> GetRecentActivity()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { Success = false, Message = "Invalid token." });

            var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "";

            int? teacherId = role == "Teacher" ? await _teacherService.GetTeacherIdByUserIdAsync(userId) : null;
            int? studentId = role == "Student" ? await _studentService.GetStudentIdByUserIdAsync(userId) : null;

            var result = await _dashboardService.GetRecentActivityAsync(userId, role, teacherId, studentId);
            return Ok(result);
        }
    }
}