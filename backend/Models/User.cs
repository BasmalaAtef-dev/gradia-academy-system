using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AcademyAPI.Models;

[Table("Users")]
public partial class User
{
    [Column("UserID")]
    public int UserId { get; set; }

    [Column("FullName")]
    public string FullName { get; set; } = null!;

    [Column("Email")]
    public string Email { get; set; } = null!;

    [Column("PasswordHash")]
    public string PasswordHash { get; set; } = null!;

    [Column("Role")]
    public string Role { get; set; } = null!;

    [Column("CreatedAt")]
    public DateTime? CreatedAt { get; set; }

    public virtual Student? Student { get; set; }

    public virtual Teacher? Teacher { get; set; }
}