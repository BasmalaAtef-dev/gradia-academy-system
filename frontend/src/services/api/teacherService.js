import { apiClient } from "./apiClient";

function buildQuery({ pageNumber = 1, pageSize = 10, searchTerm = "" } = {}) {
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
  });
  if (searchTerm) params.set("searchTerm", searchTerm);
  return params.toString();
}

export const teacherService = {
  async getAll(params) {
    const query = buildQuery(params);
    return apiClient.get(`/Teacher?${query}`);
  },

    async getAllUnpaged() {
        return apiClient.get("/Teacher/all");
  },

  async getById(teacherId) {
    return apiClient.get(`/Teacher/${teacherId}`);
  },

  async create(payload) {
    return apiClient.post("/Teacher", {
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      specialization: payload.specialization || null,
      hireDate: payload.hireDate || null,
    });
  },

  async update(teacherId, payload) {
    return apiClient.put(`/Teacher/${teacherId}`, {
      fullName: payload.fullName,
      specialization: payload.specialization || null,
      hireDate: payload.hireDate || null,
    });
  },

  async remove(teacherId) {
    return apiClient.del(`/Teacher/${teacherId}`);
  },
};