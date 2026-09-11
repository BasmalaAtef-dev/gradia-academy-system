using AcademyAPI.DTOs;
using AcademyAPI.Interfaces;
using AcademyAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AcademyAPI.Services
{
    public class TeacherService : ITeacherService
    {
        private readonly AcademyDbContext _context;

        public TeacherService(AcademyDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse<PagedResponse<TeacherResponse>>> GetAllTeachersAsync(PaginationParams paginationParams)
        {
            var response = new ServiceResponse<PagedResponse<TeacherResponse>>();

            var query = _context.Teachers
                .Include(t => t.User)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(paginationParams.SearchTerm))
            {
                var term = paginationParams.SearchTerm.Trim();
                query = query.Where(t =>
                    t.User.FullName.Contains(term) ||
                    (t.Specialization != null && t.Specialization.Contains(term)));
            }

            var totalCount = await query.CountAsync();

            var teachers = await query
                .OrderBy(t => t.TeacherId)
                .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                .Take(paginationParams.PageSize)
                .Select(t => new TeacherResponse
                {
                    TeacherId = t.TeacherId,
                    UserId = t.UserId,
                    FullName = t.User.FullName,
                    Email = t.User.Email,
                    Specialization = t.Specialization,
                    HireDate = t.HireDate,
                    CreatedAt = t.User.CreatedAt
                })
                .ToListAsync();

            response.Success = true;
            response.Message = "Teachers retrieved successfully.";
            response.Data = new PagedResponse<TeacherResponse>
            {
                Items = teachers,
                PageNumber = paginationParams.PageNumber,
                PageSize = paginationParams.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)paginationParams.PageSize)
            };

            return response;
        }


        public async Task<ServiceResponse<List<TeacherResponse>>> GetAllTeachersUnpagedAsync()
        {
            var response = new ServiceResponse<List<TeacherResponse>>();

            var teachers = await _context.Teachers
                .Include(t => t.User)
                .OrderBy(t => t.User.FullName)
                .Select(t => new TeacherResponse
                {
                    TeacherId = t.TeacherId,
                    UserId = t.UserId,
                    FullName = t.User.FullName,
                    Email = t.User.Email,
                    Specialization = t.Specialization,
                    HireDate = t.HireDate,
                    CreatedAt = t.User.CreatedAt
                })
                .ToListAsync();

            response.Success = true;
            response.Message = "Teachers retrieved successfully.";
            response.Data = teachers;

            return response;
        }


        public async Task<ServiceResponse<TeacherResponse>> GetTeacherByIdAsync(int teacherId)
        {
            var response = new ServiceResponse<TeacherResponse>();

            var teacher = await _context.Teachers
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.TeacherId == teacherId);

            if (teacher == null)
            {
                response.Success = false;
                response.Message = "Teacher not found.";
                return response;
            }

            response.Success = true;
            response.Message = "Teacher retrieved successfully.";
            response.Data = new TeacherResponse
            {
                TeacherId = teacher.TeacherId,
                UserId = teacher.UserId,
                FullName = teacher.User.FullName,
                Email = teacher.User.Email,
                Specialization = teacher.Specialization,
                HireDate = teacher.HireDate,
                CreatedAt = teacher.User.CreatedAt
            };

            return response;
        }

        public async Task<ServiceResponse<TeacherResponse>> CreateTeacherAsync(CreateTeacherRequest request)
        {
            var response = new ServiceResponse<TeacherResponse>();

            var emailExists = await _context.Users.AnyAsync(u => u.Email == request.Email);

            if (emailExists)
            {
                response.Success = false;
                response.Message = "A user with this email already exists.";
                return response;
            }

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Teacher",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var teacher = new Teacher
            {
                UserId = user.UserId,
                Specialization = request.Specialization,
                HireDate = request.HireDate
            };

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Teacher created successfully.";
            response.Data = new TeacherResponse
            {
                TeacherId = teacher.TeacherId,
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                Specialization = teacher.Specialization,
                HireDate = teacher.HireDate,
                CreatedAt = user.CreatedAt
            };

            return response;
        }

        public async Task<ServiceResponse<TeacherResponse>> UpdateTeacherAsync(int teacherId, UpdateTeacherRequest request)
        {
            var response = new ServiceResponse<TeacherResponse>();

            var teacher = await _context.Teachers
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.TeacherId == teacherId);

            if (teacher == null)
            {
                response.Success = false;
                response.Message = "Teacher not found.";
                return response;
            }

            teacher.User.FullName = request.FullName;
            teacher.Specialization = request.Specialization;
            teacher.HireDate = request.HireDate;

            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Teacher updated successfully.";
            response.Data = new TeacherResponse
            {
                TeacherId = teacher.TeacherId,
                UserId = teacher.UserId,
                FullName = teacher.User.FullName,
                Email = teacher.User.Email,
                Specialization = teacher.Specialization,
                HireDate = teacher.HireDate,
                CreatedAt = teacher.User.CreatedAt
            };

            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteTeacherAsync(int teacherId)
        {
            var response = new ServiceResponse<bool>();

            var teacher = await _context.Teachers
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.TeacherId == teacherId);

            if (teacher == null)
            {
                response.Success = false;
                response.Message = "Teacher not found.";
                return response;
            }

            _context.Teachers.Remove(teacher);
            _context.Users.Remove(teacher.User);

            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Teacher deleted successfully.";
            response.Data = true;

            return response;
        }

        public async Task<int?> GetTeacherIdByUserIdAsync(int userId)
        {
            var teacher = await _context.Teachers.FirstOrDefaultAsync(t => t.UserId == userId);
            return teacher?.TeacherId;
        }
    }
}