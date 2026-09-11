using AcademyAPI.DTOs;

namespace AcademyAPI.Interfaces
{
    public interface ITeacherService
    {
        Task<ServiceResponse<PagedResponse<TeacherResponse>>> GetAllTeachersAsync(PaginationParams paginationParams);
        Task<ServiceResponse<List<TeacherResponse>>> GetAllTeachersUnpagedAsync();
        Task<ServiceResponse<TeacherResponse>> GetTeacherByIdAsync(int teacherId);
        Task<ServiceResponse<TeacherResponse>> CreateTeacherAsync(CreateTeacherRequest request);
        Task<ServiceResponse<TeacherResponse>> UpdateTeacherAsync(int teacherId, UpdateTeacherRequest request);
        Task<ServiceResponse<bool>> DeleteTeacherAsync(int teacherId);
        Task<int?> GetTeacherIdByUserIdAsync(int userId);
    }
}