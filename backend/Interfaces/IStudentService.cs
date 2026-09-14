using AcademyAPI.DTOs;

namespace AcademyAPI.Interfaces
{
    public interface IStudentService
    {
        Task<ServiceResponse<PagedResponse<StudentResponse>>> GetAllStudentsAsync(PaginationParams paginationParams);
        Task<ServiceResponse<PagedResponse<StudentResponse>>> GetAllStudentsAsync(PaginationParams paginationParams, int? teacherId);
        Task<ServiceResponse<StudentResponse>> GetStudentByIdAsync(int studentId);
        Task<ServiceResponse<StudentResponse>> CreateStudentAsync(CreateStudentRequest request);
        Task<ServiceResponse<StudentResponse>> UpdateStudentAsync(int studentId, UpdateStudentRequest request);
        Task<ServiceResponse<bool>> DeleteStudentAsync(int studentId);
        Task<int?> GetStudentIdByUserIdAsync(int userId);
        Task<ServiceResponse<List<StudentResponse>>> GetAllStudentsUnpagedAsync();

    }
}