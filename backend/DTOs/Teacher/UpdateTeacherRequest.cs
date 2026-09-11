using System.ComponentModel.DataAnnotations;

namespace AcademyAPI.DTOs
{
    public class UpdateTeacherRequest
    {
        [Required]
        [MaxLength(150)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? Specialization { get; set; }

        public DateOnly? HireDate { get; set; }
    }
}