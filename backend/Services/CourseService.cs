using AcademyAPI.DTOs;
using AcademyAPI.Interfaces;
using AcademyAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AcademyAPI.Services
{
    public class CourseService : ICourseService
    {
        private readonly AcademyDbContext _context;

        public CourseService(AcademyDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse<PagedResponse<CourseResponse>>> GetAllCoursesAsync(PaginationParams paginationParams, int? teacherId = null)
        {
            var response = new ServiceResponse<PagedResponse<CourseResponse>>();

            var query = _context.Courses
                .Include(c => c.Teacher)
                    .ThenInclude(t => t.User)
                .AsQueryable();

            if (teacherId.HasValue)
            {
                query = query.Where(c => c.TeacherId == teacherId.Value);
            }

            if (!string.IsNullOrWhiteSpace(paginationParams.SearchTerm))
            {
                var term = paginationParams.SearchTerm.Trim().ToLower();
                query = query.Where(c =>
                    c.CourseName.ToLower().Contains(term) ||
                    (c.Description != null && c.Description.ToLower().Contains(term)));
            }

            query = query.OrderBy(c => c.CourseId);

            var totalCount = await query.CountAsync();

            var courses = await query
                .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                .Take(paginationParams.PageSize)
                .Select(c => new CourseResponse
                {
                    CourseId = c.CourseId,
                    CourseName = c.CourseName,
                    Description = c.Description,
                    Credits = c.Credits,
                    TeacherId = c.TeacherId,
                    TeacherName = c.Teacher.User.FullName
                })
                .ToListAsync();

            response.Success = true;
            response.Message = "Courses retrieved successfully.";
            response.Data = new PagedResponse<CourseResponse>
            {
                Items = courses,
                PageNumber = paginationParams.PageNumber,
                PageSize = paginationParams.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)paginationParams.PageSize)
            };

            return response;
        }

        public async Task<ServiceResponse<CourseResponse>> GetCourseByIdAsync(int courseId, int? teacherId = null)
        {
            var response = new ServiceResponse<CourseResponse>();

            var course = await _context.Courses
                .Include(c => c.Teacher)
                    .ThenInclude(t => t.User)
                .FirstOrDefaultAsync(c => c.CourseId == courseId);

            if (course == null || (teacherId.HasValue && course.TeacherId != teacherId.Value))
            {
                response.Success = false;
                response.Message = "Course not found.";
                return response;
            }

            response.Success = true;
            response.Message = "Course retrieved successfully.";
            response.Data = new CourseResponse
            {
                CourseId = course.CourseId,
                CourseName = course.CourseName,
                Description = course.Description,
                Credits = course.Credits,
                TeacherId = course.TeacherId,
                TeacherName = course.Teacher.User.FullName
            };

            return response;
        }

        public async Task<ServiceResponse<CourseResponse>> CreateCourseAsync(CreateCourseRequest request)
        {
            var response = new ServiceResponse<CourseResponse>();

            var teacherExists = await _context.Teachers.AnyAsync(t => t.TeacherId == request.TeacherId);

            if (!teacherExists)
            {
                response.Success = false;
                response.Message = "Teacher not found.";
                return response;
            }

            var course = new Course
            {
                CourseName = request.CourseName,
                Description = request.Description,
                Credits = request.Credits,
                TeacherId = request.TeacherId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            var teacher = await _context.Teachers
                .Include(t => t.User)
                .FirstAsync(t => t.TeacherId == course.TeacherId);

            response.Success = true;
            response.Message = "Course created successfully.";
            response.Data = new CourseResponse
            {
                CourseId = course.CourseId,
                CourseName = course.CourseName,
                Description = course.Description,
                Credits = course.Credits,
                TeacherId = course.TeacherId,
                TeacherName = teacher.User.FullName
            };

            return response;
        }

        public async Task<ServiceResponse<CourseResponse>> UpdateCourseAsync(int courseId, UpdateCourseRequest request)
        {
            var response = new ServiceResponse<CourseResponse>();

            var course = await _context.Courses
                .Include(c => c.Teacher)
                    .ThenInclude(t => t.User)
                .FirstOrDefaultAsync(c => c.CourseId == courseId);

            if (course == null)
            {
                response.Success = false;
                response.Message = "Course not found.";
                return response;
            }

            var teacherExists = await _context.Teachers.AnyAsync(t => t.TeacherId == request.TeacherId);

            if (!teacherExists)
            {
                response.Success = false;
                response.Message = "Teacher not found.";
                return response;
            }

            course.CourseName = request.CourseName;
            course.Description = request.Description;
            course.Credits = request.Credits;
            course.TeacherId = request.TeacherId;

            await _context.SaveChangesAsync();

            var updatedTeacher = await _context.Teachers
                .Include(t => t.User)
                .FirstAsync(t => t.TeacherId == course.TeacherId);

            response.Success = true;
            response.Message = "Course updated successfully.";
            response.Data = new CourseResponse
            {
                CourseId = course.CourseId,
                CourseName = course.CourseName,
                Description = course.Description,
                Credits = course.Credits,
                TeacherId = course.TeacherId,
                TeacherName = updatedTeacher.User.FullName
            };

            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteCourseAsync(int courseId)
        {
            var response = new ServiceResponse<bool>();

            var course = await _context.Courses.FirstOrDefaultAsync(c => c.CourseId == courseId);

            if (course == null)
            {
                response.Success = false;
                response.Message = "Course not found.";
                return response;
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Course deleted successfully.";
            response.Data = true;

            return response;
        }


        public async Task<ServiceResponse<List<CourseResponse>>> GetAllCoursesUnpagedAsync()
        {
            var response = new ServiceResponse<List<CourseResponse>>();

            var courses = await _context.Courses
                .Include(c => c.Teacher)
                    .ThenInclude(t => t.User)
                .OrderBy(c => c.CourseName)
                .Select(c => new CourseResponse
                {
                    CourseId = c.CourseId,
                    CourseName = c.CourseName,
                    Description = c.Description,
                    Credits = c.Credits,
                    TeacherId = c.TeacherId,
                    TeacherName = c.Teacher.User.FullName
                })
                .ToListAsync();

            response.Success = true;
            response.Message = "Courses retrieved successfully.";
            response.Data = courses;

            return response;


        }


    }
}