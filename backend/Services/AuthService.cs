using AcademyAPI.DTOs;
using AcademyAPI.DTOs.Student;
using AcademyAPI.Interfaces;
using AcademyAPI.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AcademyAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly AcademyDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            AcademyDbContext context,
            IConfiguration configuration,
            ILogger<AuthService> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        public ServiceResponse<string> Register(RegisterStudentRequest request)
        {
            if (_context.Users.Any(u => u.Email == request.Email))
            {
                _logger.LogWarning(
                    "Registration attempt with existing email: {Email}",
                    request.Email);

                return new ServiceResponse<string>
                {
                    Success = false,
                    Message = "Email already exists."
                };
            }

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Student"
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            var student = new Student
            {
                UserId = user.UserId,
                DateOfBirth = request.DateOfBirth,
                Phone = request.Phone,
                Address = request.Address
            };

            _context.Students.Add(student);
            _context.SaveChanges();

            _logger.LogInformation(
                "New student registered: UserId {UserId}, Email {Email}",
                user.UserId,
                user.Email);

            return new ServiceResponse<string>
            {
                Success = true,
                Message = "Student Registered Successfully.",
                Data = "Done"
            };
        }

        public ServiceResponse<LoginResponse> Login(LoginRequest request)
        {
            var user = _context.Users
                .FirstOrDefault(u => u.Email == request.Email);

            if (user == null)
            {
                _logger.LogWarning(
                    "Login attempt with unknown email: {Email}",
                    request.Email);

                return new ServiceResponse<LoginResponse>
                {
                    Success = false,
                    Message = "Invalid Email or Password"
                };
            }

            bool isPasswordCorrect =
                BCrypt.Net.BCrypt.Verify(
                    request.Password,
                    user.PasswordHash);

            if (!isPasswordCorrect)
            {
                _logger.LogWarning(
                    "Failed login attempt for UserId {UserId}",
                    user.UserId);

                return new ServiceResponse<LoginResponse>
                {
                    Success = false,
                    Message = "Invalid Email or Password"
                };
            }

            var token = GenerateJwtToken(user);

            _logger.LogInformation(
                "Successful login: UserId {UserId}, Role {Role}",
                user.UserId,
                user.Role);

            return new ServiceResponse<LoginResponse>
            {
                Success = true,
                Message = "Login Success",
                Data = new LoginResponse
                {
                    Token = token,
                    Expiration = DateTime.Now.AddMinutes(
                        Convert.ToDouble(
                            _configuration["Jwt:DurationInMinutes"])
                    ),
                    FullName = user.FullName,
                    Role = user.Role
                }
            };
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(
                    JwtRegisteredClaimNames.Sub,
                    user.UserId.ToString()),

                new Claim(
                    JwtRegisteredClaimNames.Email,
                    user.Email),

                new Claim(
                    ClaimTypes.Name,
                    user.FullName),

                new Claim(
                    ClaimTypes.Role,
                    user.Role)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _configuration["Jwt:Key"]!)
            );

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var expires = DateTime.Now.AddMinutes(
                Convert.ToDouble(
                    _configuration["Jwt:DurationInMinutes"])
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}