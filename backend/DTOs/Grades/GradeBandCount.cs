namespace AcademyAPI.DTOs
{
    public class GradeBandCount
    {
        public string Label { get; set; } = string.Empty; // e.g. "90-100"
        public string Band { get; set; } = string.Empty;   // e.g. "A"
        public int Count { get; set; }
    }
}