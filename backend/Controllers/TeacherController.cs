using AcademyAPI.DTOs;
using AcademyAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace AcademyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherController : ControllerBase
    {
        private readonly ITeacherService _teacherService;

        public TeacherController(ITeacherService teacherService)
        {
            _teacherService = teacherService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
       public async Task<IActionResult> GetAllTeachers([FromQuery] PaginationParams paginationParams)
        {
            var result = await _teacherService.GetAllTeachersAsync(paginationParams);
            return Ok(result);
        }

       [HttpGet("all")]
       [Authorize(Roles = "Admin,Teacher")]
       public async Task<IActionResult> GetAllTeachersUnpaged()
       {
           var result = await _teacherService.GetAllTeachersUnpagedAsync();
           return Ok(result);
       }

        [HttpGet("{teacherId}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> GetTeacherById(int teacherId)
        {
            var result = await _teacherService.GetTeacherByIdAsync(teacherId);

            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateTeacher([FromBody] CreateTeacherRequest request)
        {
            var result = await _teacherService.CreateTeacherAsync(request);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("{teacherId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTeacher(int teacherId, [FromBody] UpdateTeacherRequest request)
        {
            var result = await _teacherService.UpdateTeacherAsync(teacherId, request);

            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        [HttpDelete("{teacherId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTeacher(int teacherId)
        {
            var result = await _teacherService.DeleteTeacherAsync(teacherId);

            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }
    }
}