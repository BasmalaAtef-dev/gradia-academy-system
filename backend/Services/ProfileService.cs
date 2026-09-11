using AcademyAPI.DTOs;
using AcademyAPI.Interfaces;
using AcademyAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AcademyAPI.Services
{
    public class ProfileService : IProfileService
    {
        private readonly AcademyDbContext _context;

        public ProfileService(AcademyDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse<ProfileResponse>> GetMyProfileAsync(int userId)
        {
            var response = new ServiceResponse<ProfileResponse>();

            var user = await _context.Users
                .Include(u => u.Student)
                .Include(u => u.Teacher)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                response.Success = false;
                response.Message = "User not found.";
                return response;
            }

            var profile = new ProfileResponse
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };

            if (user.Student != null)
            {
                profile.StudentId = user.Student.StudentId;
                profile.DateOfBirth = user.Student.DateOfBirth;
                profile.Phone = user.Student.Phone;
                profile.Address = user.Student.Address;
            }

            if (user.Teacher != null)
            {
                profile.TeacherId = user.Teacher.TeacherId;
                profile.Specialization = user.Teacher.Specialization;
                profile.HireDate = user.Teacher.HireDate;
            }

            response.Success = true;
            response.Message = "Profile retrieved successfully.";
            response.Data = profile;

            return response;
        }
    }
}