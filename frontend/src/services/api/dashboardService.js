import { apiClient } from "./apiClient";

export const dashboardService = {
  async getSummary() {
    return apiClient.get("/Dashboard/summary");
  },

  async getRecentActivity() {
    return apiClient.get("/Dashboard/activity");
  },
};