namespace AcademyAPI.DTOs
{
    public class EnrollmentResponse
    {
        public int EnrollmentId { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public DateTime? EnrollmentDate { get; set; }
        public decimal? Grade { get; set; }
    }
}