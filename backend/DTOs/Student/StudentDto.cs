namespace AcademyAPI.DTOs.Student
{
    public class StudentDto
    {
        public int StudentId { get; set; }

        public int UserId { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public DateOnly? DateOfBirth { get; set; }

        public string? Phone { get; set; }

        public string? Address { get; set; }
    }
}