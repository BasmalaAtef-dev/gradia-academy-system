using System;
using System.Collections.Generic;

namespace AcademyAPI.Models;

public partial class Teacher
{
    public int TeacherId { get; set; }

    public int UserId { get; set; }

    public string? Specialization { get; set; }

    public DateOnly? HireDate { get; set; }

    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();

    public virtual User User { get; set; } = null!;
}
