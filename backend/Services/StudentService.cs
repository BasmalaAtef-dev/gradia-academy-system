using AcademyAPI.DTOs;
using AcademyAPI.Interfaces;
using AcademyAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AcademyAPI.Services
{
    public class StudentService : IStudentService
    {
        private readonly AcademyDbContext _context;

        public StudentService(AcademyDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse<PagedResponse<StudentResponse>>> GetAllStudentsAsync(PaginationParams paginationParams)
        {
            var response = new ServiceResponse<PagedResponse<StudentResponse>>();

            var query = _context.Students
                .Include(s => s.User)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(paginationParams.SearchTerm))
            {
                var term = paginationParams.SearchTerm.Trim().ToLower();
                query = query.Where(s =>
                    s.User.FullName.ToLower().Contains(term) ||
                    s.User.Email.ToLower().Contains(term));
            }

            query = query.OrderBy(s => s.StudentId);

            var totalCount = await query.CountAsync();

            var students = await query
                .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                .Take(paginationParams.PageSize)
                .Select(s => new StudentResponse
                {
                    StudentId = s.StudentId,
                    UserId = s.UserId,
                    FullName = s.User.FullName,
                    Email = s.User.Email,
                    DateOfBirth = s.DateOfBirth,
                    Phone = s.Phone,
                    Address = s.Address,
                    CreatedAt = s.User.CreatedAt
                })
                .ToListAsync();

            response.Success = true;
            response.Message = "Students retrieved successfully.";
            response.Data = new PagedResponse<StudentResponse>
            {
                Items = students,
                PageNumber = paginationParams.PageNumber,
                PageSize = paginationParams.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)paginationParams.PageSize)
            };

            return response;
        }

        public async Task<ServiceResponse<StudentResponse>> GetStudentByIdAsync(int studentId)
        {
            var response = new ServiceResponse<StudentResponse>();

            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.StudentId == studentId);

            if (student == null)
            {
                response.Success = false;
                response.Message = "Student not found.";
                return response;
            }

            response.Success = true;
            response.Message = "Student retrieved successfully.";
            response.Data = new StudentResponse
            {
                StudentId = student.StudentId,
                UserId = student.UserId,
                FullName = student.User.FullName,
                Email = student.User.Email,
                DateOfBirth = student.DateOfBirth,
                Phone = student.Phone,
                Address = student.Address,
                CreatedAt = student.User.CreatedAt
            };

            return response;
        }

        public async Task<ServiceResponse<StudentResponse>> CreateStudentAsync(CreateStudentRequest request)
        {
            var response = new ServiceResponse<StudentResponse>();

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
                Role = "Student",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var student = new Student
            {
                UserId = user.UserId,
                DateOfBirth = request.DateOfBirth,
                Phone = request.Phone,
                Address = request.Address
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Student created successfully.";
            response.Data = new StudentResponse
            {
                StudentId = student.StudentId,
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                DateOfBirth = student.DateOfBirth,
                Phone = student.Phone,
                Address = student.Address,
                CreatedAt = user.CreatedAt
            };

            return response;
        }

        public async Task<ServiceResponse<StudentResponse>> UpdateStudentAsync(int studentId, UpdateStudentRequest request)
        {
            var response = new ServiceResponse<StudentResponse>();

            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.StudentId == studentId);

            if (student == null)
            {
                response.Success = false;
                response.Message = "Student not found.";
                return response;
            }

            student.User.FullName = request.FullName;
            student.DateOfBirth = request.DateOfBirth;
            student.Phone = request.Phone;
            student.Address = request.Address;

            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Student updated successfully.";
            response.Data = new StudentResponse
            {
                StudentId = student.StudentId,
                UserId = student.UserId,
                FullName = student.User.FullName,
                Email = student.User.Email,
                DateOfBirth = student.DateOfBirth,
                Phone = student.Phone,
                Address = student.Address,
                CreatedAt = student.User.CreatedAt
            };

            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteStudentAsync(int studentId)
        {
            var response = new ServiceResponse<bool>();

            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.StudentId == studentId);

            if (student == null)
            {
                response.Success = false;
                response.Message = "Student not found.";
                return response;
            }

            _context.Students.Remove(student);
            _context.Users.Remove(student.User);

            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Student deleted successfully.";
            response.Data = true;

            return response;
        }


        public async Task<int?> GetStudentIdByUserIdAsync(int userId)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);
            return student?.StudentId;
        }

        public async Task<ServiceResponse<List<StudentResponse>>> GetAllStudentsUnpagedAsync()
        {
            var response = new ServiceResponse<List<StudentResponse>>();

            var students = await _context.Students
                .Include(s => s.User)
                .OrderBy(s => s.User.FullName)
                .Select(s => new StudentResponse
                {
                    StudentId = s.StudentId,
                    UserId = s.UserId,
                    FullName = s.User.FullName,
                    Email = s.User.Email,
                    DateOfBirth = s.DateOfBirth,
                    Phone = s.Phone,
                    Address = s.Address,
                    CreatedAt = s.User.CreatedAt
                })
                .ToListAsync();

            response.Success = true;
            response.Message = "Students retrieved successfully.";
            response.Data = students;

            return response;
        }


        public async Task<ServiceResponse<PagedResponse<StudentResponse>>> GetAllStudentsAsync(PaginationParams paginationParams, int? teacherId)
        {
            var response = new ServiceResponse<PagedResponse<StudentResponse>>();

            var query = _context.Students
                .Include(s => s.User)
                .AsQueryable();

            if (teacherId.HasValue)
            {
                query = query.Where(s => s.Enrollments.Any(e => e.Course.TeacherId == teacherId.Value));
            }

            if (!string.IsNullOrWhiteSpace(paginationParams.SearchTerm))
            {
                var term = paginationParams.SearchTerm.Trim().ToLower();
                query = query.Where(s =>
                    s.User.FullName.ToLower().Contains(term) ||
                    s.User.Email.ToLower().Contains(term));
            }

            query = query.OrderBy(s => s.StudentId);

            var totalCount = await query.CountAsync();

            var students = await query
                .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                .Take(paginationParams.PageSize)
                .Select(s => new StudentResponse
                {
                    StudentId = s.StudentId,
                    UserId = s.UserId,
                    FullName = s.User.FullName,
                    Email = s.User.Email,
                    DateOfBirth = s.DateOfBirth,
                    Phone = s.Phone,
                    Address = s.Address,
                    CreatedAt = s.User.CreatedAt
                })
                .ToListAsync();

            response.Success = true;
            response.Message = "Students retrieved successfully.";
            response.Data = new PagedResponse<StudentResponse>
            {
                Items = students,
                PageNumber = paginationParams.PageNumber,
                PageSize = paginationParams.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)paginationParams.PageSize)
            };

            return response;
        }


    }
}