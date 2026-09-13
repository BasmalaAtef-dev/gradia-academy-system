using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcademyAPI.Models;

[Table("Enrollments")]
public partial class Enrollment
{
    [Column("EnrollmentID")]
    public int EnrollmentId { get; set; }

    [Column("StudentID")]
    public int StudentId { get; set; }

    [Column("CourseID")]
    public int CourseId { get; set; }

    [Column("EnrollmentDate")]
    public DateTime? EnrollmentDate { get; set; }

    [Column("Grade")]
    public decimal? Grade { get; set; }

    [Column("GradedAt")]
    public DateTime? GradedAt { get; set; }

    public virtual Course Course { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}