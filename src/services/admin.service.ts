import { api } from "@/lib/api-client";

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
  emailVerified: boolean;
  image?: string;
  phone?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
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
  }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.role) params.append("role", filters.role);
    if (filters?.status) params.append("status", filters.status);
    const query = params.toString();
    return api.get<User[]>(
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
  }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.studentId) params.append("studentId", filters.studentId);
    if (filters?.tutorId) params.append("tutorId", filters.tutorId);
    const query = params.toString();
    return api.get<Booking[]>(
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
};