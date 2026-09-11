using AcademyAPI.DTOs;

namespace AcademyAPI.Interfaces
{
    public interface ICourseService
    {
        Task<ServiceResponse<PagedResponse<CourseResponse>>> GetAllCoursesAsync(PaginationParams paginationParams, int? teacherId = null);
        Task<ServiceResponse<CourseResponse>> GetCourseByIdAsync(int courseId, int? teacherId = null);
        Task<ServiceResponse<CourseResponse>> CreateCourseAsync(CreateCourseRequest request);
        Task<ServiceResponse<CourseResponse>> UpdateCourseAsync(int courseId, UpdateCourseRequest request);
        Task<ServiceResponse<bool>> DeleteCourseAsync(int courseId);
        Task<ServiceResponse<List<CourseResponse>>> GetAllCoursesUnpagedAsync();
    }
}