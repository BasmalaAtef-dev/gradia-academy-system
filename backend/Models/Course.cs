using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcademyAPI.Models;

[Table("Courses")]
public partial class Course
{
    [Column("CourseID")]
    public int CourseId { get; set; }

    [Column("CourseName")]
    public string CourseName { get; set; } = null!;

    [Column("Description")]
    public string? Description { get; set; }

    [Column("Credits")]
    public int? Credits { get; set; }

    [Column("TeacherID")]
    public int TeacherId { get; set; }

    [Column("CreatedAt")]
    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    public virtual Teacher Teacher { get; set; } = null!;
}