using System;
using System.Collections.Generic;

namespace AcademyAPI.Models;

public partial class Course
{
    public int CourseId { get; set; }

    public string CourseName { get; set; } = null!;

    public string? Description { get; set; }

    public int? Credits { get; set; }

    public int TeacherId { get; set; }

    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    public virtual Teacher Teacher { get; set; } = null!;
   public DateTime? CreatedAt { get; set; }
}
