import { apiClient } from "./apiClient";

function buildQuery({ pageNumber = 1, pageSize = 10, searchTerm = "" } = {}) {
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
  });
  if (searchTerm) params.set("searchTerm", searchTerm);
  return params.toString();
}

export const studentService = {
  async getAll(params) {
    const query = buildQuery(params);
    return apiClient.get(`/Student?${query}`);
  },

  async getById(studentId) {
    return apiClient.get(`/Student/${studentId}`);
  },

  async create(payload) {
    return apiClient.post("/Student", {
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      dateOfBirth: payload.dateOfBirth || null,
      phone: payload.phone || null,
      address: payload.address || null,
    });
  },

  async update(studentId, payload) {
    return apiClient.put(`/Student/${studentId}`, {
      fullName: payload.fullName,
      dateOfBirth: payload.dateOfBirth || null,
      phone: payload.phone || null,
      address: payload.address || null,
    });
  },

  async remove(studentId) {
    return apiClient.del(`/Student/${studentId}`);
  },

  async getAllUnpaged() {
    return apiClient.get("/Student/all");
  },


};