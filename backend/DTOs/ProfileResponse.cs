namespace AcademyAPI.DTOs
{
    public class ProfileResponse
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime? CreatedAt { get; set; }

        // Student-specific (null if the user is not a Student)
        public int? StudentId { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }

        // Teacher-specific (null if the user is not a Teacher)
        public int? TeacherId { get; set; }
        public string? Specialization { get; set; }
        public DateOnly? HireDate { get; set; }
    }
}