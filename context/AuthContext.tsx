"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService, User } from "../services/auth.service";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: "STUDENT" | "TUTOR") => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
    checkAuth();
  }, []);



const checkAuth = async () => {
  const token = typeof window !== "undefined" 
    ? localStorage.getItem("authToken") 
    : null;
    
  if (!token) {
    setLoading(false);
    return;
  }

  try {
    const { data, error } = await authService.getMe();
    if (data && !error) {
      setUser(data as User); // ✅ সরাসরি data, data.user না
    } else {
      setUser(null);
      localStorage.removeItem("authToken");
    }
  } catch (error) {
    setUser(null);
    localStorage.removeItem("authToken");
  } finally {
    setLoading(false);
  }
};



// AuthContext.tsx
const login = async (email: string, password: string) => {
  const { data, error } = await authService.login({ email, password });
  if (error) throw new Error(error);
  
  if (data?.user) {
    // ✅ আগে token store করো
    if (data.token) {
      localStorage.setItem("authToken", data.token);
    }
    // ✅ তারপর user set করো (token এখন available)
    setUser(data.user);
  }
};



useEffect(() => {
  if (user) {
    const redirectPath = 
      user.role === "ADMIN" ? "/admin" :
      user.role === "TUTOR" ? "/tutor" : 
      user.role === "STUDENT" ? "/dashboard" : "/";
    router.replace(redirectPath);
  }
}, [user, router]);

  const register = async (name: string, email: string, password: string, role: "STUDENT" | "TUTOR") => {
    const { data, error } = await authService.register({
      name,
      email,
      password,
      role
    });

    if (error) {
      throw new Error(error);
    }

    return;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
    router.replace("/login"); 
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}