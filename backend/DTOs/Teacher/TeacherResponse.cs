namespace AcademyAPI.DTOs
{
    public class TeacherResponse
    {
        public int TeacherId { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Specialization { get; set; }
        public DateOnly? HireDate { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}