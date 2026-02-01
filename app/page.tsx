"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin } from "antd";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!loading && !hasRedirected) {
      // ✅ শুধু Admin এবং Tutor redirect হবে
      if (user) {
        if (user.role === "ADMIN") {
          setHasRedirected(true);
          router.replace("/admin");
        } else if (user.role === "TUTOR") {
          setHasRedirected(true);
          router.replace("/tutor/dashboard");
        }
        // ✅ Student থাকলে home page এই থাকবে (redirect করবে না)
      }
    }
  }, [user, loading, router, hasRedirected]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ এখানে actual home page content render হবে
  // (নিচে full code দিচ্ছি)
  return <HomePageContent />;
}

// Home Page Content Component
function HomePageContent() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Learn From The Best
              <span className="block text-indigo-600 mt-2">Tutors Worldwide</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with expert tutors for personalized 1-on-1 learning sessions.
              Master any subject at your own pace.
            </p>
            {/* Add your hero buttons here */}
          </div>
        </div>
      </section>

      {/* Add other sections */}
    </div>
  );
}
