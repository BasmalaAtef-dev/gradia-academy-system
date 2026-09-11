using AcademyAPI.DTOs;
using AcademyAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AcademyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly ITeacherService _teacherService;

        public CourseController(ICourseService courseService, ITeacherService teacherService)
        {
            _courseService = courseService;
            _teacherService = teacherService;
        }

        private async Task<int?> GetRequestingTeacherIdAsync()
        {
            if (!User.IsInRole("Teacher"))
                return null;

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return null;

            return await _teacherService.GetTeacherIdByUserIdAsync(userId);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllCourses([FromQuery] PaginationParams paginationParams)
        {
            var teacherId = await GetRequestingTeacherIdAsync();
            var result = await _courseService.GetAllCoursesAsync(paginationParams, teacherId);
            return Ok(result);
        }

        
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllCoursesUnpaged()
        {
            var result = await _courseService.GetAllCoursesUnpagedAsync();
            return Ok(result);
        }


        [HttpGet("{courseId}")]
        [Authorize]
        public async Task<IActionResult> GetCourseById(int courseId)
        {
            var teacherId = await GetRequestingTeacherIdAsync();
            var result = await _courseService.GetCourseByIdAsync(courseId, teacherId);

            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseRequest request)
        {
            var result = await _courseService.CreateCourseAsync(request);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("{courseId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCourse(int courseId, [FromBody] UpdateCourseRequest request)
        {
            var result = await _courseService.UpdateCourseAsync(courseId, request);

            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        [HttpDelete("{courseId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCourse(int courseId)
        {
            var result = await _courseService.DeleteCourseAsync(courseId);

            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }
    }
}