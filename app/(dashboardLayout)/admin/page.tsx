"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role !== "ADMIN") {
      router.push("/");
    }
  }, []);

  return <div>Admin Dashboard</div>;
}
