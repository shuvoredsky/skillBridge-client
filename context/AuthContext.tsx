"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService, User } from "../src/services/auth.service";
import { useRouter } from "next/navigation";

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


  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data, error } = await authService.getMe();
      if (data && !error) {
        setUser(data);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await authService.login({ email, password });

    if (error) {
      throw new Error(error);
    }

    if (data?.user) {
      setUser(data.user);


      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else if (data.user.role === "TUTOR") {
        router.push("/tutor");
      } else {
        router.push("/student");
      }
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

    
    alert("Registration successful! Please check your email to verify.");
    router.push("/login");
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.push("/login");
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