import { apiClient } from "@/lib/api-client";

export const bookingService = {
  async createBooking(data: {
    tutorId: string;
    subject: string;
    date: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
  }) {
    return apiClient.post("/bookings", data);
  },

  async getMyBookings() {
    return apiClient.get("/bookings/my");
  },

  async getTutorBookings() {
    return apiClient.get("/bookings/tutor");
  },

  async getBookingById(id: string) {
    return apiClient.get(`/bookings/${id}`);
  },

  async updateBookingStatus(id: string, status: string) {
    return apiClient.patch(`/bookings/${id}`, { status });
  },

  async cancelBooking(id: string) {
    return apiClient.patch(`/bookings/${id}`, { status: "CANCELLED" });
  },
};