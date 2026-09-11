namespace AcademyAPI.DTOs
{
    public class DashboardResponse
    {
        public int TotalStudents { get; set; }
        public int TotalTeachers { get; set; }
        public int TotalCourses { get; set; }
        public int TotalEnrollments { get; set; }
        public decimal? AverageGrade { get; set; }
    }
}