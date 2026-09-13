using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcademyAPI.Models;

[Table("Students")]
public partial class Student
{
    [Column("StudentID")]
    public int StudentId { get; set; }

    [Column("UserID")]
    public int UserId { get; set; }

    [Column("DateOfBirth")]
    public DateOnly? DateOfBirth { get; set; }

    [Column("Phone")]
    public string? Phone { get; set; }

    [Column("Address")]
    public string? Address { get; set; }

    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    public virtual User User { get; set; } = null!;
}