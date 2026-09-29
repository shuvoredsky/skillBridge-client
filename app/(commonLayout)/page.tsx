import Link from "next/link";
import { Button } from "antd";
import {
  SearchOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { getImageUrl } from "@/lib/getImageUrl";
import FeaturedTutorsSection from "@/components/home/FeaturedTutorsSection";

const getCleanBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://skillbridge-server-a.onrender.com";
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

const getFeaturedTutors = async () => {
  const cleanBaseUrl = getCleanBaseUrl();
  try {
    const res = await fetch(`${cleanBaseUrl}/api/v1/tutors?limit=8`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("Failed to fetch featured tutors on home page:", err);
    return [];
  }
};

// Bug 1: Fetch real platform statistics dynamically with cache revalidation
const getPlatformStats = async () => {
  const cleanBaseUrl = getCleanBaseUrl();
  try {
    const res = await fetch(`${cleanBaseUrl}/api/v1/stats/platform`, {
      next: { revalidate: 300 }, // Cache for 300 seconds (5 minutes)
    });
    if (!res.ok) throw new Error("Failed to load platform stats");
    return res.json();
  } catch (err) {
    console.error("Failed to fetch platform stats on home page:", err);
    // Fallback baseline placeholders if server connection fails
    return {
      students: 10000,
      tutors: 500,
      subjects: 50,
      successRate: 98,
    };
  }
};

const getSiteSettings = async () => {
  const cleanBaseUrl = getCleanBaseUrl();
  try {
    const res = await fetch(`${cleanBaseUrl}/api/v1/settings`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("Failed to fetch site settings on home page:", err);
    return null;
  }
};

export default async function HomePage() {
  const [tutors, platformStats, settings] = await Promise.all([
    getFeaturedTutors(),
    getPlatformStats(),
    getSiteSettings(),
  ]);

  const tutorList = Array.isArray(tutors?.data)
    ? tutors.data
    : Array.isArray(tutors)
      ? tutors
      : [];
  const featuredTutors = tutorList.slice(0, 8);
  const cleanBaseUrl = getCleanBaseUrl();

  const heroBannerUrl = getImageUrl(settings?.bannerUrl);

  const features = [
    {
      icon: <SearchOutlined className="text-4xl text-blue-600" />,
      title: "Find Expert Tutors",
      description: "Browse through qualified tutors in various subjects",
    },
    {
      icon: <ClockCircleOutlined className="text-4xl text-blue-600" />,
      title: "Flexible Scheduling",
      description: "Book sessions at your convenience with easy rescheduling options",
    },
    {
      icon: <SafetyOutlined className="text-4xl text-blue-600" />,
      title: "Secure Payments",
      description: "Safe and secure payment processing for all transactions",
    },
    {
      icon: <TeamOutlined className="text-4xl text-blue-600" />,
      title: "1-on-1 Sessions",
      description: "Personalized learning experience with dedicated tutors",
    },
  ];

  const stats = [
    { number: `${platformStats.students.toLocaleString()}+`, label: "Students" },
    { number: `${platformStats.tutors.toLocaleString()}+`, label: "Expert Tutors" },
    { number: `${platformStats.subjects.toLocaleString()}+`, label: "Subjects" },
    { number: `${platformStats.successRate}%`, label: "Success Rate" },
  ];

  return (
    <div>
      {/* Hero Section with Dynamic Banner */}
      <section className="relative overflow-hidden w-full h-[380px] sm:h-[460px] md:h-[520px] lg:h-[560px] transition-colors duration-200">
        {heroBannerUrl ? (
          <>
            <img
              src={heroBannerUrl}
              alt="Home Page Banner"
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle 20% dark overlay for visual depth */}
            <div className="absolute inset-0 bg-black/20" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-50/60 via-teal-50/50 to-emerald-50/20 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950" />
        )}
      </section>


      <section className="py-10 md:py-14 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-18 bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Why Choose SkillBridge?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide the best platform for connecting students with expert tutors
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <section className="py-14 md:py-18 bg-white dark:bg-slate-900 border-t border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Featured Tutors
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Learn from our highest-rated expert tutors
            </p>
          </div>

          <FeaturedTutorsSection featuredTutors={featuredTutors} />

          <div className="text-center mt-8">
            <Link href="/tutors">
              <Button
                size="large"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 px-8 rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Browse All Tutors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-18 bg-blue-900 dark:bg-blue-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-3">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of students already learning with SkillBridge
          </p>
          <Link href="/register">
            <Button
              size="large"
              className="bg-white text-blue-600 hover:bg-gray-50 h-12 px-8 text-lg font-bold border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
