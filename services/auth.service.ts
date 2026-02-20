import { api } from "@/lib/api-client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  image?: string;
  phone?: string;
}

// auth.service.ts
export interface AuthResponse {
  redirect: boolean;
  token: string;        
  user: User;
}

export const authService = {
  
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: "STUDENT" | "TUTOR";
  }) => {
    return api.post<AuthResponse>("/api/auth/sign-up/email", data);
  },


login: async (data: { email: string; password: string }) => {
  const result = await api.post<AuthResponse>("/api/auth/sign-in/email", data);
  console.log("🔴 RAW LOGIN RESPONSE:", JSON.stringify(result, null, 2));
  return result;
},

  
  logout: async () => {
    return api.post("/api/auth/sign-out", {});
  },

  
getMe: async () => {
  const result = await api.get<User>("/api/v1/users/me"); // ✅ আগের endpoint এ ফিরে যাও
  console.log("🔴 RAW GETME RESPONSE:", JSON.stringify(result, null, 2));
  return result;
},

  
  getSession: async () => {
    return api.get<{ user: User }>("/api/auth/get-session");
  },



};