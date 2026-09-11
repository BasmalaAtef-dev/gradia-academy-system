namespace AcademyAPI.DTOs
{
    public class CourseResponse
    {
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? Credits { get; set; }
        public int TeacherId { get; set; }
        public string TeacherName { get; set; } = string.Empty;
    }
}