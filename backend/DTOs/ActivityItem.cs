namespace AcademyAPI.DTOs
{
    public class ActivityItem
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty; // "grade" | "enrollment" | "course" | "student" | "teacher"
        public string Actor { get; set; } = string.Empty;
        public string Detail { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}