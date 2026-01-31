"use client";

import { useEffect } from "react";
import { requireAuth } from "../../src/lib/authGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    requireAuth();
  }, []);

  return <>{children}</>;
}
