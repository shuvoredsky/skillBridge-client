"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService, User } from "../src/services/auth.service";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log("🔍 Checking auth...");
    try {
      const { data, error } = await authService.getMe();
      console.log("✅ Auth response:", { data, error });
      
      if (data && !error) {
        console.log("✅ User found:", data);
        setUser(data);
      } else {
        console.log("❌ No user found");
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    console.log("🔐 Logging in...", { email });
    const { data, error } = await authService.login({ email, password });

    console.log("📨 Login response:", { data, error });

    if (error) {
      throw new Error(error);
    }

    if (data?.user) {
      console.log("✅ Login successful, setting user:", data.user);
      setUser(data.user);

      const redirectPath = 
        data.user.role === "ADMIN" ? "/admin" :
        data.user.role === "TUTOR" ? "/tutor" : "/";
      
      console.log("➡️ Redirecting to", redirectPath);
      router.replace(redirectPath);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const { data, error } = await authService.register({
      name,
      email,
      password,
    });

    if (error) {
      throw new Error(error);
    }

    return;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.replace("/login"); // ✅ replace use করুন
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