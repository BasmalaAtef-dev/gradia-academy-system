using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcademyAPI.Models;

[Table("Teachers")]
public partial class Teacher
{
    [Column("TeacherID")]
    public int TeacherId { get; set; }

    [Column("UserID")]
    public int UserId { get; set; }

    [Column("Specialization")]
    public string? Specialization { get; set; }

    [Column("HireDate")]
    public DateOnly? HireDate { get; set; }

    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();

    public virtual User User { get; set; } = null!;
}