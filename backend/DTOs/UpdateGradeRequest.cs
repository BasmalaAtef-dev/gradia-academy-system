using System.ComponentModel.DataAnnotations;

namespace AcademyAPI.DTOs
{
    public class UpdateGradeRequest
    {
        [Required]
        [Range(0, 100)]
        public decimal Grade { get; set; }
    }
}