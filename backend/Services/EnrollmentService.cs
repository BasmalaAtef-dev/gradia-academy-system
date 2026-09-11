using AcademyAPI.DTOs;
using AcademyAPI.Interfaces;
using AcademyAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AcademyAPI.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly AcademyDbContext _context;

        public EnrollmentService(AcademyDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse<PagedResponse<EnrollmentResponse>>> GetAllEnrollmentsAsync(PaginationParams paginationParams, int? teacherId = null)
        {
            var response = new ServiceResponse<PagedResponse<EnrollmentResponse>>();

            var query = _context.Enrollments
                .Include(e => e.Student)
                    .ThenInclude(s => s.User)
                .Include(e => e.Course)
                .OrderBy(e => e.EnrollmentId)
                .AsQueryable();

            if (teacherId.HasValue)
            {
                query = query.Where(e => e.Course.TeacherId == teacherId.Value);
            }

            var totalCount = await query.CountAsync();

            var enrollments = await query
                .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                .Take(paginationParams.PageSize)
                .Select(e => new EnrollmentResponse
                {
                    EnrollmentId = e.EnrollmentId,
                    StudentId = e.StudentId,
                    StudentName = e.Student.User.FullName,
                    CourseId = e.CourseId,
                    CourseName = e.Course.CourseName,
                    EnrollmentDate = e.EnrollmentDate,
                    Grade = e.Grade
                })
                .ToListAsync();

            response.Success = true;
            response.Message = "Enrollments retrieved successfully.";
            response.Data = new PagedResponse<EnrollmentResponse>
            {
                Items = enrollments,
                PageNumber = paginationParams.PageNumber,
                PageSize = paginationParams.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)paginationParams.PageSize)
            };

            return response;
        }

        public async Task<ServiceResponse<EnrollmentResponse>> GetEnrollmentByIdAsync(int enrollmentId, int? teacherId = null)
        {
            var response = new ServiceResponse<EnrollmentResponse>();

            var enrollment = await _context.Enrollments
                .Include(e => e.Student)
                    .ThenInclude(s => s.User)
                .Include(e => e.Course)
                .FirstOrDefaultAsync(e => e.EnrollmentId == enrollmentId);

            if (enrollment == null || (teacherId.HasValue && enrollment.Course.TeacherId != teacherId.Value))
            {
                response.Success = false;
                response.Message = "Enrollment not found.";
                return response;
            }

            response.Success = true;
            response.Message = "Enrollment retrieved successfully.";
            response.Data = new EnrollmentResponse
            {
                EnrollmentId = enrollment.EnrollmentId,
                StudentId = enrollment.StudentId,
                StudentName = enrollment.Student.User.FullName,
                CourseId = enrollment.CourseId,
                CourseName = enrollment.Course.CourseName,
                EnrollmentDate = enrollment.EnrollmentDate,
                Grade = enrollment.Grade
            };

            return response;
        }

        public async Task<ServiceResponse<List<EnrollmentResponse>>> GetEnrollmentsByStudentIdAsync(int studentId, int? teacherId = null)
        {
            var response = new ServiceResponse<List<EnrollmentResponse>>();

            var query = _context.Enrollments
                .Include(e => e.Student)
                    .ThenInclude(s => s.User)
                .Include(e => e.Course)
                .Where(e => e.StudentId == studentId);

            if (teacherId.HasValue)
            {
                query = query.Where(e => e.Course.TeacherId == teacherId.Value);
            }

            var enrollments = await query
                .Select(e => new EnrollmentResponse
                {
                    EnrollmentId = e.EnrollmentId,
                    StudentId = e.StudentId,
                    StudentName = e.Student.User.FullName,
                    CourseId = e.CourseId,
                    CourseName = e.Course.CourseName,
                    EnrollmentDate = e.EnrollmentDate,
                    Grade = e.Grade
                })
                .ToListAsync();

            response.Success = true;
            response.Message = "Enrollments retrieved successfully.";
            response.Data = enrollments;

            return response;
        }

        public async Task<ServiceResponse<List<EnrollmentResponse>>> GetEnrollmentsByUserIdAsync(int userId)
        {
            var response = new ServiceResponse<List<EnrollmentResponse>>();

            var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);

            if (student == null)
            {
                response.Success = false;
                response.Message = "Student profile not found for this user.";
                return response;
            }

            var enrollments = await _context.Enrollments
                .Include(e => e.Student)
                    .ThenInclude(s => s.User)
                .Include(e => e.Course)
                .Where(e => e.StudentId == student.StudentId)
                .Select(e => new EnrollmentResponse
                {
                    EnrollmentId = e.EnrollmentId,
                    StudentId = e.StudentId,
                    StudentName = e.Student.User.FullName,
                    CourseId = e.CourseId,
                    CourseName = e.Course.CourseName,
                    EnrollmentDate = e.EnrollmentDate,
                    Grade = e.Grade
                })
                .ToListAsync();

            response.Success = true;
            response.Message = "Enrollments retrieved successfully.";
            response.Data = enrollments;

            return response;
        }

        public async Task<ServiceResponse<EnrollmentResponse>> CreateEnrollmentAsync(CreateEnrollmentRequest request)
        {
            var response = new ServiceResponse<EnrollmentResponse>();

            var studentExists = await _context.Students.AnyAsync(s => s.StudentId == request.StudentId);

            if (!studentExists)
            {
                response.Success = false;
                response.Message = "Student not found.";
                return response;
            }

            var courseExists = await _context.Courses.AnyAsync(c => c.CourseId == request.CourseId);

            if (!courseExists)
            {
                response.Success = false;
                response.Message = "Course not found.";
                return response;
            }

            var alreadyEnrolled = await _context.Enrollments
                .AnyAsync(e => e.StudentId == request.StudentId && e.CourseId == request.CourseId);

            if (alreadyEnrolled)
            {
                response.Success = false;
                response.Message = "Student is already enrolled in this course.";
                return response;
            }

            var enrollment = new Enrollment
            {
                StudentId = request.StudentId,
                CourseId = request.CourseId,
                EnrollmentDate = DateTime.UtcNow
            };

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            var savedEnrollment = await _context.Enrollments
                .Include(e => e.Student)
                    .ThenInclude(s => s.User)
                .Include(e => e.Course)
                .FirstAsync(e => e.EnrollmentId == enrollment.EnrollmentId);

            response.Success = true;
            response.Message = "Enrollment created successfully.";
            response.Data = new EnrollmentResponse
            {
                EnrollmentId = savedEnrollment.EnrollmentId,
                StudentId = savedEnrollment.StudentId,
                StudentName = savedEnrollment.Student.User.FullName,
                CourseId = savedEnrollment.CourseId,
                CourseName = savedEnrollment.Course.CourseName,
                EnrollmentDate = savedEnrollment.EnrollmentDate,
                Grade = savedEnrollment.Grade
            };

            return response;
        }

        public async Task<ServiceResponse<EnrollmentResponse>> UpdateGradeAsync(int enrollmentId, UpdateGradeRequest request, int? teacherId = null)
        {
            var response = new ServiceResponse<EnrollmentResponse>();

            var enrollment = await _context.Enrollments
                .Include(e => e.Student)
                    .ThenInclude(s => s.User)
                .Include(e => e.Course)
                .FirstOrDefaultAsync(e => e.EnrollmentId == enrollmentId);

            if (enrollment == null || (teacherId.HasValue && enrollment.Course.TeacherId != teacherId.Value))
            {
                response.Success = false;
                response.Message = "Enrollment not found.";
                return response;
            }

            enrollment.Grade = request.Grade;
            enrollment.GradedAt = DateTime.UtcNow;


            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Grade updated successfully.";
            response.Data = new EnrollmentResponse
            {
                EnrollmentId = enrollment.EnrollmentId,
                StudentId = enrollment.StudentId,
                StudentName = enrollment.Student.User.FullName,
                CourseId = enrollment.CourseId,
                CourseName = enrollment.Course.CourseName,
                EnrollmentDate = enrollment.EnrollmentDate,
                Grade = enrollment.Grade
            };

            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteEnrollmentAsync(int enrollmentId)
        {
            var response = new ServiceResponse<bool>();

            var enrollment = await _context.Enrollments.FirstOrDefaultAsync(e => e.EnrollmentId == enrollmentId);

            if (enrollment == null)
            {
                response.Success = false;
                response.Message = "Enrollment not found.";
                return response;
            }

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Enrollment deleted successfully.";
            response.Data = true;

            return response;
        }




        private static readonly (string Band, decimal Min, decimal Max)[] GradeBands = new[]
{
    ("A", 90m, 100m),
    ("B", 80m, 89m),
    ("C", 70m, 79m),
    ("D", 60m, 69m),
    ("F", 0m, 59m),
};
        public async Task<ServiceResponse<List<GradeBandCount>>> GetGradeDistributionAsync(int? teacherId = null, int? studentId = null)
        {
            var response = new ServiceResponse<List<GradeBandCount>>();

            var query = _context.Enrollments.Where(e => e.Grade != null).AsQueryable();

            if (teacherId.HasValue)
                query = query.Where(e => e.Course.TeacherId == teacherId.Value);

            if (studentId.HasValue)
                query = query.Where(e => e.StudentId == studentId.Value);

            var grades = await query.Select(e => e.Grade!.Value).ToListAsync();

            response.Success = true;
            response.Message = "Grade distribution retrieved successfully.";
            response.Data = GradeBands.Select(b => new GradeBandCount
            {
                Label = b.Min == 0 ? $"0-{b.Max}" : $"{b.Min}-{b.Max}",
                Band = b.Band,
                Count = grades.Count(g => g >= b.Min && g <= b.Max)
            }).ToList();

            return response;
        }

        public async Task<ServiceResponse<List<GradeTrendPoint>>> GetGradeTrendAsync(int? teacherId = null, int? studentId = null)
        {
            var response = new ServiceResponse<List<GradeTrendPoint>>();

            var query = _context.Enrollments
                .Where(e => e.Grade != null && (e.GradedAt != null || e.EnrollmentDate != null))
                .AsQueryable();

            if (teacherId.HasValue)
                query = query.Where(e => e.Course.TeacherId == teacherId.Value);

            if (studentId.HasValue)
                query = query.Where(e => e.StudentId == studentId.Value);

            var enrollments = await query
                .Select(e => new { e.EnrollmentDate, e.GradedAt, e.Grade })
                .ToListAsync();

            response.Success = true;
            response.Message = "Grade trend retrieved successfully.";
            response.Data = enrollments
                .GroupBy(e =>
                {
                    var effectiveDate = e.GradedAt ?? e.EnrollmentDate!.Value;
                    return new { effectiveDate.Year, effectiveDate.Month };
                })
                .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                .Select(g => new GradeTrendPoint
                {
                    Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
                    Average = Math.Round((double)g.Average(e => e.Grade!.Value), 1)
                })
                .ToList();

            return response;
        }
    }
}