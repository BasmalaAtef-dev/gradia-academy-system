using AcademyAPI.DTOs;

namespace AcademyAPI.Interfaces
{
    public interface IProfileService
    {
        Task<ServiceResponse<ProfileResponse>> GetMyProfileAsync(int userId);
    }
}