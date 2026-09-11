using System.ComponentModel.DataAnnotations;

namespace AcademyAPI.DTOs.Student
{
    public class RegisterStudentRequest
    {
        [Required]
        public string FullName { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;

        public DateOnly? DateOfBirth { get; set; }

        public string? Phone { get; set; }

        public string? Address { get; set; }
    }
}