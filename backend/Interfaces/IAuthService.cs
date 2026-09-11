using AcademyAPI.DTOs;
using AcademyAPI.DTOs.Student;

namespace AcademyAPI.Interfaces
{
    public interface IAuthService
    {
        ServiceResponse<string> Register(RegisterStudentRequest request);

        ServiceResponse<LoginResponse> Login(LoginRequest request);
    }
}