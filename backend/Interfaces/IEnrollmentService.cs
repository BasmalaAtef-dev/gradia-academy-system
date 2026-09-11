using AcademyAPI.DTOs;

namespace AcademyAPI.Interfaces
{
    public interface IEnrollmentService
    {
        Task<ServiceResponse<PagedResponse<EnrollmentResponse>>> GetAllEnrollmentsAsync(PaginationParams paginationParams, int? teacherId = null);
        Task<ServiceResponse<EnrollmentResponse>> GetEnrollmentByIdAsync(int enrollmentId, int? teacherId = null);
        Task<ServiceResponse<List<EnrollmentResponse>>> GetEnrollmentsByStudentIdAsync(int studentId, int? teacherId = null);
        Task<ServiceResponse<EnrollmentResponse>> CreateEnrollmentAsync(CreateEnrollmentRequest request);
        Task<ServiceResponse<bool>> DeleteEnrollmentAsync(int enrollmentId);
        Task<ServiceResponse<EnrollmentResponse>> UpdateGradeAsync(int enrollmentId, UpdateGradeRequest request, int? teacherId = null);
        Task<ServiceResponse<List<EnrollmentResponse>>> GetEnrollmentsByUserIdAsync(int userId);
        Task<ServiceResponse<List<GradeBandCount>>> GetGradeDistributionAsync(int? teacherId = null, int? studentId = null);
        Task<ServiceResponse<List<GradeTrendPoint>>> GetGradeTrendAsync(int? teacherId = null, int? studentId = null);
    }
}