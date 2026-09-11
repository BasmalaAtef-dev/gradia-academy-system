using AcademyAPI.DTOs;
using AcademyAPI.Interfaces;
using AcademyAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AcademyAPI.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AcademyDbContext _context;

        public DashboardService(AcademyDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse<DashboardResponse>> GetDashboardSummaryAsync()
        {
            var response = new ServiceResponse<DashboardResponse>();

            var totalStudents = await _context.Students.CountAsync();
            var totalTeachers = await _context.Teachers.CountAsync();
            var totalCourses = await _context.Courses.CountAsync();
            var totalEnrollments = await _context.Enrollments.CountAsync();

            var averageGrade = await _context.Enrollments
                .Where(e => e.Grade != null)
                .Select(e => e.Grade)
                .DefaultIfEmpty()
                .AverageAsync(g => g ?? 0);

            response.Success = true;
            response.Message = "Dashboard summary retrieved successfully.";
            response.Data = new DashboardResponse
            {
                TotalStudents = totalStudents,
                TotalTeachers = totalTeachers,
                TotalCourses = totalCourses,
                TotalEnrollments = totalEnrollments,
                AverageGrade = averageGrade
            };

            return response;
        }

        public async Task<ServiceResponse<List<ActivityItem>>> GetRecentActivityAsync(int userId, string role, int? teacherId, int? studentId)
        {
            var response = new ServiceResponse<List<ActivityItem>>();
            var items = new List<ActivityItem>();

            if (role == "Student")
            {
                if (studentId.HasValue)
                {
                    var grades = await _context.Enrollments
                        .Include(e => e.Course)
                        .Where(e => e.StudentId == studentId.Value && e.Grade != null)
                        .OrderByDescending(e => e.GradedAt ?? e.EnrollmentDate)
                        .Take(10)
                        .Select(e => new ActivityItem
                        {
                            Id = e.EnrollmentId,
                            Type = "grade",
                            Actor = e.Course.CourseName,
                            Detail = $"Grade posted: {e.Grade}%",
                            Timestamp = e.GradedAt ?? e.EnrollmentDate ?? DateTime.UtcNow
                        })
                        .ToListAsync();

                    items.AddRange(grades);
                }
            }
            else if (role == "Teacher")
            {
                if (teacherId.HasValue)
                {
                    var enrollments = await _context.Enrollments
                        .Include(e => e.Student).ThenInclude(s => s.User)
                        .Include(e => e.Course)
                        .Where(e => e.Course.TeacherId == teacherId.Value)
                        .OrderByDescending(e => e.EnrollmentDate)
                        .Take(10)
                        .Select(e => new ActivityItem
                        {
                            Id = e.EnrollmentId,
                            Type = "enrollment",
                            Actor = e.Student.User.FullName,
                            Detail = $"Enrolled in {e.Course.CourseName}",
                            Timestamp = e.EnrollmentDate ?? DateTime.UtcNow
                        })
                        .ToListAsync();

                    var courses = await _context.Courses
                        .Where(c => c.TeacherId == teacherId.Value)
                        .OrderByDescending(c => c.CourseId)
                        .Take(5)
                        .Select(c => new ActivityItem
                        {
                            Id = c.CourseId,
                            Type = "course",
                            Actor = c.CourseName,
                            Detail = "Assigned to you",
                            Timestamp = c.CreatedAt ?? DateTime.UtcNow
                        })
                        .ToListAsync();

                    items.AddRange(enrollments);
                    items.AddRange(courses);
                }
            }
            else if (role == "Admin")
            {
                var teachers = await _context.Teachers
                    .Include(t => t.User)
                    .OrderByDescending(t => t.User.CreatedAt)
                    .Take(5)
                    .Select(t => new ActivityItem
                    {
                        Id = t.TeacherId,
                        Type = "teacher",
                        Actor = t.User.FullName,
                        Detail = "Onboarded as teacher",
                        Timestamp = t.User.CreatedAt ?? DateTime.UtcNow
                    })
                    .ToListAsync();

                var courses = await _context.Courses
                    .Include(c => c.Teacher).ThenInclude(t => t.User)
                    .OrderByDescending(c => c.CourseId)
                    .Take(5)
                    .Select(c => new ActivityItem
                    {
                        Id = c.CourseId,
                        Type = "course",
                        Actor = c.Teacher.User.FullName,
                        Detail = $"Added course: {c.CourseName}",
                        Timestamp = c.CreatedAt ?? DateTime.UtcNow
                    })
                    .ToListAsync();

                items.AddRange(teachers);
                items.AddRange(courses);
            }

            response.Success = true;
            response.Message = "Recent activity retrieved successfully.";
            response.Data = items
                .OrderByDescending(i => i.Timestamp)
                .Take(10)
                .ToList();

            return response;
        }


    }
}