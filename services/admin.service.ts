import { api } from "@/lib/api-client";
import { PaginatedResponse } from "./tutor.service";

export interface DashboardStats {
  users: {
    total: number;
    students: number;
    tutors: number;
  };
  bookings: {
    total: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  reviews: {
    total: number;
  };
  categories: {
    total: number;
  };
  topTutors?: any[];
  recentBookings?: any[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  image?: string;
  phone?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  profilePhoto?: string;
  tutorProfile?: {
    id: string;
    rating: number;
    totalReviews: number;
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
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
  updatedAt: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  tutor: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  review?: {
    id: string;
    rating: number;
    comment: string;
  };
}

export const adminService = {
  getDashboardStats: async () => {
    return api.get<DashboardStats>("/api/v1/admin/stats");
  },

  getAllUsers: async (filters?: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.role) params.append("role", filters.role);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    const query = params.toString();
    return api.get<PaginatedResponse<User>>(
      `/api/v1/admin/users${query ? `?${query}` : ""}`
    );
  },

  banUser: async (userId: string) => {
    return api.patch(`/api/v1/admin/users/${userId}/status`, {
      status: "BANNED",
    });
  },

  unbanUser: async (userId: string) => {
    return api.patch(`/api/v1/admin/users/${userId}/status`, {
      status: "ACTIVE",
    });
  },

  getAllBookings: async (filters?: {
    status?: string;
    studentId?: string;
    tutorId?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.studentId) params.append("studentId", filters.studentId);
    if (filters?.tutorId) params.append("tutorId", filters.tutorId);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    const query = params.toString();
    return api.get<PaginatedResponse<Booking>>(
      `/api/v1/admin/bookings${query ? `?${query}` : ""}`
    );
  },

  getAllCategories: async () => {
    return api.get<Category[]>("/api/v1/categories");
  },

  createCategory: async (data: { name: string; description?: string }) => {
    return api.post<Category>("/api/v1/categories", data);
  },

  updateCategory: async (
    id: string,
    data: { name: string; description?: string }
  ) => {
    return api.put<Category>(`/api/v1/categories/${id}`, data);
  },

  deleteCategory: async (id: string) => {
    return api.delete(`/api/v1/categories/${id}`);
  },

  getPendingTutors: async (filters?: { page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    const query = params.toString();
    return api.get<PaginatedResponse<PendingTutor>>(
      `/api/v1/admin/tutors/pending${query ? `?${query}` : ""}`
    );
  },

  approveTutor: async (tutorId: string) => {
    return api.patch(`/api/v1/admin/tutors/${tutorId}/approve`, {});
  },

  rejectTutor: async (tutorId: string, rejectionReason?: string) => {
    return api.patch(`/api/v1/admin/tutors/${tutorId}/reject`, { rejectionReason });
  },
};

export interface PendingTutor {
  id: string;
  userId: string;
  bio: string | null;
  subjects: string[];
  hourlyRate: number;
  experience: string | null;
  education: string | null;
  rating: number;
  totalReviews: number;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    phone: string | null;
    status: string;
  };
  documents: Array<{
    id: string;
    tutorId: string;
    type: "DEGREE" | "NID" | "CERTIFICATE";
    url: string;
    publicId: string;
    createdAt: string;
    updatedAt: string;
  }>;
}