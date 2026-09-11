using AcademyAPI.DTOs;
using AcademyAPI.Interfaces;
using AcademyAPI.Models;
using AcademyAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AcademyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnrollmentController : ControllerBase
    {
        private readonly IEnrollmentService _enrollmentService;
        private readonly ITeacherService _teacherService;
        private readonly IStudentService _studentService;


       public EnrollmentController(IEnrollmentService enrollmentService, ITeacherService teacherService, IStudentService studentService)
        {
            _enrollmentService = enrollmentService;
            _teacherService = teacherService;
            _studentService = studentService;

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

        
        private async Task<int?> GetRequestingStudentIdAsync()
        {
            if (!User.IsInRole("Student"))
                return null;
 
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
 
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return null;
 
            return await _studentService.GetStudentIdByUserIdAsync(userId);
        }



        [HttpGet]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> GetAllEnrollments([FromQuery] PaginationParams paginationParams)
        {
            var teacherId = await GetRequestingTeacherIdAsync();
            var result = await _enrollmentService.GetAllEnrollmentsAsync(paginationParams, teacherId);
            return Ok(result);
        }

        [HttpGet("{enrollmentId}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> GetEnrollmentById(int enrollmentId)
        {
            var teacherId = await GetRequestingTeacherIdAsync();
            var result = await _enrollmentService.GetEnrollmentByIdAsync(enrollmentId, teacherId);

            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        [HttpGet("student/{studentId}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> GetEnrollmentsByStudentId(int studentId)
        {
            var teacherId = await GetRequestingTeacherIdAsync();
            var result = await _enrollmentService.GetEnrollmentsByStudentIdAsync(studentId, teacherId);
            return Ok(result);
        }

        [HttpGet("my-grades")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetMyGrades()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized(new { Success = false, Message = "Invalid token." });
            }

            var result = await _enrollmentService.GetEnrollmentsByUserIdAsync(userId);

            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateEnrollment([FromBody] CreateEnrollmentRequest request)
        {
            var result = await _enrollmentService.CreateEnrollmentAsync(request);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("{enrollmentId}/grade")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> UpdateGrade(int enrollmentId, [FromBody] UpdateGradeRequest request)
        {
            var teacherId = await GetRequestingTeacherIdAsync();
            var result = await _enrollmentService.UpdateGradeAsync(enrollmentId, request, teacherId);

            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        [HttpDelete("{enrollmentId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEnrollment(int enrollmentId)
        {
            var result = await _enrollmentService.DeleteEnrollmentAsync(enrollmentId);

            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }



        [HttpGet("grade-distribution")]
        [Authorize(Roles = "Admin,Teacher,Student")]
        public async Task<IActionResult> GetGradeDistribution()
        {
            var teacherId = await GetRequestingTeacherIdAsync();
            var studentId = await GetRequestingStudentIdAsync();
            var result = await _enrollmentService.GetGradeDistributionAsync(teacherId, studentId);
            return Ok(result);
        }



        [HttpGet("grade-trend")]
        [Authorize(Roles = "Admin,Teacher,Student")]
        public async Task<IActionResult> GetGradeTrend()
        {
            var teacherId = await GetRequestingTeacherIdAsync();
            var studentId = await GetRequestingStudentIdAsync();
            var result = await _enrollmentService.GetGradeTrendAsync(teacherId, studentId);
            return Ok(result);
        }


    }
}