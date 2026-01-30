"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  admin,
  user,
}: {
  admin: React.ReactNode;
  user: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // এখানে আপনার ব্যাকএন্ড থেকে সেশন চেক করার API কল করবেন
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/get-session"); // উদাহরণ এন্ডপয়েন্ট
        const data = await res.json();
        
        if (data.user) {
          setRole(data.user.role);
        } else {
          router.push("/login");
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - সিম্পল টেলউইন্ড ডিজাইন */}
      <aside className="w-64 bg-indigo-900 text-white p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-8">SkillBridge</h2>
        <nav className="space-y-4">
          <p className="text-xs text-indigo-300 uppercase font-semibold">Main Menu</p>
          <a href="/dashboard" className="block p-2 hover:bg-indigo-800 rounded">Overview</a>
          {role === "ADMIN" ? (
            <a href="/admin/users" className="block p-2 hover:bg-indigo-800 rounded">Manage Users</a>
          ) : (
            <a href="/dashboard/bookings" className="block p-2 hover:bg-indigo-800 rounded">My Bookings</a>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-center bg-white p-4 rounded shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Welcome Back!</h1>
          <button className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600">Logout</button>
        </header>
        
        {/* Parallel Routes Logic */}
        {role === "ADMIN" ? admin : user}
      </main>
    </div>
  );
}