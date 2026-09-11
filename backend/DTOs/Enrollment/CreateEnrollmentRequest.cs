using System.ComponentModel.DataAnnotations;

namespace AcademyAPI.DTOs
{
    public class CreateEnrollmentRequest
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "A valid StudentId is required.")]
        public int StudentId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "A valid CourseId is required.")]
        public int CourseId { get; set; }
    }
}