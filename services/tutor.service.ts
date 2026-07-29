import { api } from "@/lib/api-client";

export interface TutorProfile {
  id: string;
  userId: string;
  bio?: string;
  subjects: string[];
  hourlyRate: number;
  experience?: string;
  education?: string;
  rating: number;
  totalReviews: number;
  profilePhoto?: string;
  profilePhotoUrl?: string;
  verificationStatus?: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  documents?: TutorDocument[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    student: {
      name: string;
      image?: string;
    };
  }>;
  ratingBreakdown?: Record<number, { count: number; percentage: number }>;
}

export interface TutorDocument {
  id: string;
  tutorId: string;
  type: "DEGREE" | "NID" | "CERTIFICATE";
  url: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfilePayload {
  bio?: string;
  subjects: string[];
  hourlyRate: number;
  experience?: string;
  education?: string;
}

export interface Availability {
  id: string;
  tutorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface CreateAvailabilityPayload {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface Session {
  id: string;
  studentId: string;
  tutorId: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  status: string;
  meetingLink?: string;
  meetingPlatform?: "GOOGLE_MEET" | "ZOOM" | "MS_TEAMS";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const tutorService = {
  getAllTutors: async (filters?: {
    search?: string;
    subject?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.subject) params.append("subject", filters.subject);
    if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.minRating) params.append("minRating", filters.minRating.toString());
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const query = params.toString();
    return api.get<PaginatedResponse<TutorProfile>>(`/api/v1/tutors${query ? `?${query}` : ""}`);
  },

  getTutorById: async (id: string) => {
    return api.get<TutorProfile>(`/api/v1/tutors/${id}`);
  },

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

  uploadDocument: async (tutorId: string, file: File, type: "degree" | "nid" | "certificate") => {
    const formData = new FormData();
    formData.append("document", file);
    return api.upload<{ message: string; data: any }>(
      `/api/tutors/${tutorId}/documents/${type}`,
      formData
    );
  }
};