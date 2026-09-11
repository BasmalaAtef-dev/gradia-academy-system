using AcademyAPI.DTOs;

namespace AcademyAPI.Interfaces
{
    public interface IDashboardService
    {
        Task<ServiceResponse<DashboardResponse>> GetDashboardSummaryAsync();
        Task<ServiceResponse<List<ActivityItem>>> GetRecentActivityAsync(int userId, string role, int? teacherId, int? studentId);
    }
}