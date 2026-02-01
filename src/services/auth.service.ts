import { api } from "@/lib/api-client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  emailVerified: boolean;
  image?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  session?: {
    token: string;
    expiresAt: string;
  };
}

export const authService = {
  
  register: async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    return api.post<AuthResponse>("/api/auth/sign-up/email", data);
  },


  login: async (data: { email: string; password: string }) => {
    return api.post<AuthResponse>("/api/auth/sign-in/email", data);
  },

  
  logout: async () => {
    return api.post("/api/auth/sign-out", {});
  },

  
  getMe: async () => {
    return api.get<User>("/api/v1/users/me");
  },

  
  getSession: async () => {
    return api.get<{ user: User }>("/api/auth/get-session");
  },
};