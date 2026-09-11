import { apiClient } from "./apiClient";

export const profileService = {
  async getMyProfile() {
    return apiClient.get("/Profile/me");
  },
};