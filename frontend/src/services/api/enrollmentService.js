import { apiClient } from "./apiClient";

function buildQuery({ pageNumber = 1, pageSize = 10, searchTerm = "" } = {}) {
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
  });
  if (searchTerm) params.set("searchTerm", searchTerm);
  return params.toString();
}

export const enrollmentService = {
  async getAll({ pageNumber, pageSize, searchTerm } = {}) {
    const query = buildQuery({ pageNumber, pageSize, searchTerm });
    return apiClient.get(`/Enrollment?${query}`);
  },

  async getByStudentId(studentId) {
    return apiClient.get(`/Enrollment/student/${studentId}`);
  },

  
  async getMyGrades() {
   return apiClient.get("/Enrollment/my-grades");
  },

  async getMyGrades() {
    return apiClient.get("/Enrollment/my-grades");
  },

  async create({ studentId, courseId }) {
    return apiClient.post("/Enrollment", { studentId, courseId });
  },

  async updateGrade(enrollmentId, grade) {
    return apiClient.put(`/Enrollment/${enrollmentId}/grade`, { grade });
  },

  async remove(enrollmentId) {
    return apiClient.del(`/Enrollment/${enrollmentId}`);
  },

  async getGradeTrend() {
    return apiClient.get("/Enrollment/grade-trend");
  },

  async getGradeDistribution() {
    return apiClient.get("/Enrollment/grade-distribution");
  },
};