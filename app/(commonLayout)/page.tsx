import Link from "next/link";
import { Button } from "antd";
import {
  SearchOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  TeamOutlined,
  RocketOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { getImageUrl } from "@/lib/getImageUrl";

const getCleanBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://skillbridge-server-a.onrender.com";
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

const getFeaturedTutors = async () => {
  const cleanBaseUrl = getCleanBaseUrl();
  try {
    const res = await fetch(`${cleanBaseUrl}/api/v1/tutors`, {
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

export default async function HomePage() {
  const tutors = await getFeaturedTutors();
  const platformStats = await getPlatformStats();
  const featuredTutors = Array.isArray(tutors) ? tutors.slice(0, 3) : [];
  const cleanBaseUrl = getCleanBaseUrl();

  const features = [
    {
      icon: <SearchOutlined className="text-4xl text-brand-green" />,
      title: "Find Expert Tutors",
      description: "Browse through qualified tutors in various subjects",
    },
    {
      icon: <ClockCircleOutlined className="text-4xl text-brand-green" />,
      title: "Flexible Scheduling",
      description: "Book sessions at your convenience with easy rescheduling options",
    },
    {
      icon: <SafetyOutlined className="text-4xl text-brand-green" />,
      title: "Secure Payments",
      description: "Safe and secure payment processing for all transactions",
    },
    {
      icon: <TeamOutlined className="text-4xl text-brand-green" />,
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
      
      <section className="bg-gradient-to-br from-emerald-50/60 via-teal-50/50 to-emerald-50/20 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 py-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Learn From The Best
              <span className="block text-brand-green mt-2">Tutors Worldwide</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect with expert tutors for personalized 1-on-1 learning sessions.
              Master any subject at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tutors">
                <Button
                  type="primary"
                  size="large"
                  icon={<SearchOutlined />}
                  className="bg-brand-green hover:bg-brand-green-hover h-12 px-8 text-lg border-0"
                >
                  Find a Tutor
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="large"
                  icon={<RocketOutlined />}
                  className="h-12 px-8 text-lg dark:bg-slate-800 dark:text-white dark:border-slate-700"
                >
                  Become a Tutor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-brand-green mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose SkillBridge?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide the best platform for connecting students with expert tutors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-800 transition-shadow duration-200"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Tutors
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Learn from our highest-rated expert tutors
            </p>
          </div>

          {featuredTutors.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No featured tutors available at the moment.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredTutors.map((tutor: any) => {
                const avatarUrl = getImageUrl(tutor.profilePhoto || tutor.user.image);
                return (
                  <div
                    key={tutor.id}
                    className="bg-slate-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col text-center"
                  >
                    <div className="mb-4 flex justify-center">
                      <div className="relative rounded-full overflow-hidden w-20 h-20 bg-indigo-600 flex items-center justify-center text-white text-3xl font-semibold">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={tutor.user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          tutor.user.name.charAt(0)
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {tutor.user.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 mb-4 text-amber-500">
                      <span className="text-sm font-semibold">★ {tutor.rating.toFixed(1)}</span>
                      <span className="text-gray-400 dark:text-gray-500">({tutor.totalReviews})</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 min-h-[60px]">
                      {tutor.bio || "No description provided."}
                    </p>
                    <div className="mt-auto border-t border-gray-100 dark:border-slate-700 pt-4 flex justify-between items-center">
                      <span className="text-brand-green font-bold">
                        ${tutor.hourlyRate}/hr
                      </span>
                      <Link href={`/tutors/${tutor.id}`}>
                        <Button type="primary" className="bg-brand-green hover:bg-brand-green-hover border-0 text-white">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/tutors">
              <Button size="large" className="bg-brand-green hover:bg-brand-green-hover text-white font-semibold h-12 px-8 rounded-xl border-0">
                Browse All Tutors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-brand-green dark:bg-brand-green-hover transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students already learning with SkillBridge
          </p>
          <Link href="/register">
            <Button
              size="large"
              className="bg-white text-brand-green hover:bg-gray-50 h-12 px-8 text-lg font-semibold border-0"
            >
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
