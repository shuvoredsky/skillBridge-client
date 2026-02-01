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

export default function HomePage() {
  const features = [
    {
      icon: <SearchOutlined className="text-4xl text-indigo-600" />,
      title: "Find Expert Tutors",
      description: "Browse through hundreds of qualified tutors in various subjects",
    },
    {
      icon: <ClockCircleOutlined className="text-4xl text-indigo-600" />,
      title: "Flexible Scheduling",
      description: "Book sessions at your convenience with easy rescheduling options",
    },
    {
      icon: <SafetyOutlined className="text-4xl text-indigo-600" />,
      title: "Secure Payments",
      description: "Safe and secure payment processing for all transactions",
    },
    {
      icon: <TeamOutlined className="text-4xl text-indigo-600" />,
      title: "1-on-1 Sessions",
      description: "Personalized learning experience with dedicated tutors",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Students" },
    { number: "500+", label: "Expert Tutors" },
    { number: "50+", label: "Subjects" },
    { number: "98%", label: "Success Rate" },
  ];

  return (
    <div>
      
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tutors">
                <Button
                  type="primary"
                  size="large"
                  icon={<SearchOutlined />}
                  className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 text-lg"
                >
                  Find a Tutor
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="large"
                  icon={<RocketOutlined />}
                  className="h-12 px-8 text-lg"
                >
                  Become a Tutor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose SkillBridge?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best platform for connecting students with expert tutors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students already learning with SkillBridge
          </p>
          <Link href="/register">
            <Button
              size="large"
              className="bg-white text-indigo-600 hover:bg-gray-100 h-12 px-8 text-lg font-semibold"
            >
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
