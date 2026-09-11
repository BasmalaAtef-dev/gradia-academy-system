using System.ComponentModel.DataAnnotations;

namespace AcademyAPI.DTOs
{
    public class UpdateCourseRequest
    {
        [Required]
        [MaxLength(150)]
        public string CourseName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Range(1, 12, ErrorMessage = "Credits must be between 1 and 12.")]
        public int? Credits { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "A valid TeacherId is required.")]
        public int TeacherId { get; set; }
    }
}