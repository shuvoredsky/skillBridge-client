"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Spin } from "antd";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("STUDENT" | "TUTOR" | "ADMIN")[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // Not logged in
      if (!user) {
        router.push("/login");
        return;
      }

      // Wrong role
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their dashboard
        if (user.role === "ADMIN") {
          router.push("/admin");
        } else if (user.role === "TUTOR") {
          router.push("/tutor");
        } else {
          router.push("/");
        }
      }
    }
  }, [user, loading, router, allowedRoles]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin fullscreen size="large" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return null;
  }

  // Wrong role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}