import { api } from "@/lib/api-client";

export interface BookingSession {
  id: string;
  studentId: string;
  tutorId: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  notes?: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  tutor: {
    id: string;
    user: {
      name: string;
      email: string;
      image?: string;
    };
  };
  review?: {
    id: string;
    rating: number;
    comment: string;
  };
}

export interface CreateBookingData {
  tutorId: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  notes?: string;
}

export const bookingService = {
  createBooking: async (data: CreateBookingData) => {

    return api.post<BookingSession>("/api/v1/bookings", data);
  },

  getMyBookings: async () => {
    return api.get<BookingSession[]>("/api/v1/bookings/my-bookings");
  },

  cancelBooking: async (bookingId: string) => {
    return api.delete(`/api/v1/bookings/${bookingId}`);
  },

  getTutorSessions: async () => {
    return api.get<BookingSession[]>("/api/v1/bookings/my-sessions");
  },

  updateBookingStatus: async (bookingId: string, status: "COMPLETED" | "CANCELLED") => {
    return api.patch(`/api/v1/bookings/${bookingId}/status`, { status });
  }
};