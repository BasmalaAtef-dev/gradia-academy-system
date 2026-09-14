import { apiClient } from "./apiClient";

function buildQuery({ pageNumber = 1, pageSize = 10, searchTerm = "" } = {}) {
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
  });
  if (searchTerm) params.set("searchTerm", searchTerm);
  return params.toString();
}

export const courseService = {
  async getAll({ pageNumber, pageSize, searchTerm } = {}) {
    const query = buildQuery({ pageNumber, pageSize, searchTerm });
    return apiClient.get(`/Course?${query}`);
  },

  async getById(courseId) {
    return apiClient.get(`/Course/${courseId}`);
  },

  async create(payload) {
    return apiClient.post("/Course", {
      courseName: payload.courseName,
      description: payload.description || null,
      credits: payload.credits ?? null,
      teacherId: payload.teacherId,
    });
  },

  async update(courseId, payload) {
    return apiClient.put(`/Course/${courseId}`, {
      courseName: payload.courseName,
      description: payload.description || null,
      credits: payload.credits ?? null,
      teacherId: payload.teacherId,
    });
  },

  async remove(courseId) {
    return apiClient.del(`/Course/${courseId}`);
  },

  async getAllUnpaged() {
    return apiClient.get("/Course/all");
  },

};