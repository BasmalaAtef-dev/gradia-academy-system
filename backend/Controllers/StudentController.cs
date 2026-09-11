using AcademyAPI.DTOs;
using AcademyAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AcademyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> GetAllStudents([FromQuery] PaginationParams paginationParams)
        {
            var result = await _studentService.GetAllStudentsAsync(paginationParams);
            return Ok(result);
        }

        
         [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllStudentsUnpaged()
        {
            var result = await _studentService.GetAllStudentsUnpagedAsync();
            return Ok(result);
        }



        [HttpGet("{studentId}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> GetStudentById(int studentId)
        {
            var result = await _studentService.GetStudentByIdAsync(studentId);

            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateStudent([FromBody] CreateStudentRequest request)
        {
            var result = await _studentService.CreateStudentAsync(request);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPut("{studentId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStudent(int studentId, [FromBody] UpdateStudentRequest request)
        {
            var result = await _studentService.UpdateStudentAsync(studentId, request);

            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        [HttpDelete("{studentId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStudent(int studentId)
        {
            var result = await _studentService.DeleteStudentAsync(studentId);

            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }
    }
}