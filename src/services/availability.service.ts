import { apiClient } from "@/lib/api-client";

export const availabilityService = {
  async getMyAvailability() {
    return apiClient.get("/availability/me");
  },

  async createSlot(data: {
    day: string;
    startTime: string;
    endTime: string;
  }) {
    return apiClient.post("/availability", data);
  },

  async deleteSlot(id: string) {
    return apiClient.delete(`/availability/${id}`);
  },

  async getTutorAvailability(tutorId: string) {
    return apiClient.get(`/availability/tutor/${tutorId}`);
  },
};