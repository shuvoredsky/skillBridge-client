import { api } from "@/lib/api-client";
import type {
  TutorProfile,
  Availability,
  Session,
  CreateProfilePayload,
  CreateAvailabilityPayload,
} from "@/types/tutor";

export const tutorService = {
  
  createProfile: async (data: CreateProfilePayload) => {
    return api.post<TutorProfile>("/api/v1/tutors/profile", data);
  },

  updateProfile: async (data: Partial<CreateProfilePayload>) => {
    return api.put<TutorProfile>("/api/v1/tutors/profile", data);
  },

  getMyProfile: async () => {
    return api.get<TutorProfile>("/api/v1/tutors/profile/me");
  },

  
  createAvailability: async (data: CreateAvailabilityPayload) => {
    return api.post<Availability>("/api/v1/availability", data);
  },

  updateAvailability: async (id: string, data: Partial<CreateAvailabilityPayload>) => {
    return api.put<Availability>(`/api/v1/availability/${id}`, data);
  },

  deleteAvailability: async (id: string) => {
    return api.delete(`/api/v1/availability/${id}`);
  },

  getMyAvailability: async (tutorId: string) => {
    return api.get<Availability[]>(`/api/v1/availability/${tutorId}`);
  },

  
  getMySessions: async () => {
    return api.get<Session[]>("/api/v1/bookings/my-sessions");
  },

  updateSessionStatus: async (sessionId: string, status: "COMPLETED") => {
    return api.patch(`/api/v1/bookings/${sessionId}/status`, { status });
  },
};