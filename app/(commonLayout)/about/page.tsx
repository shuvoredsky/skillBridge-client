import PageHeader from "@/components/PageHeader";
import { BulbOutlined, TeamOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

export const metadata = {
  title: "About Us - SkillBridge",
  description: "Learn about the mission, community, and values of SkillBridge.",
};

export default function AboutPage() {
  const values = [
    {
      icon: <BulbOutlined className="text-3xl text-brand-green" />,
      title: "Our Mission",
      desc: "To democratize education by connecting curious learners with expert tutors worldwide, making personalized learning accessible to everyone.",
    },
    {
      icon: <TeamOutlined className="text-3xl text-brand-green" />,
      title: "Our Community",
      desc: "A vibrant ecosystem of 10,000+ students and 500+ tutors sharing knowledge and growing together every single day.",
    },
    {
      icon: <SafetyCertificateOutlined className="text-3xl text-brand-green" />,
      title: "Quality Assured",
      desc: "We verify every tutor's credentials and use student reviews to ensure the highest standards of teaching on SkillBridge.",
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <PageHeader
        title="About SkillBridge"
        description="Empowering minds by connecting curious learners with expert tutors."
        breadcrumbs={[{ label: "About" }]}
      />

      {/* Intro Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              What is SkillBridge?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-4">
              SkillBridge is a comprehensive learning marketplace designed to simplify the process of finding and booking expert tutors.
              Whether you are a student looking to master a complex subject or a tutor wanting to share your expertise,
              our platform provides the tools you need to succeed.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-4">
              We focus on removing barriers to education. From flexible availability scheduling to transparent user profiles,
              we've built a secure and intuitive environment where education knows no boundaries.
            </p>
          </div>
          
          <div className="bg-emerald-50 dark:bg-slate-900 p-8 rounded-3xl border border-emerald-100/50 dark:border-slate-800 flex justify-center items-center">
            <img 
              src="https://img.freepik.com/free-vector/learning-concept-illustration_114360-6186.jpg" 
              alt="About SkillBridge illustration" 
              className="max-w-xs md:max-w-md w-full h-auto mix-blend-multiply dark:mix-blend-normal rounded-xl dark:opacity-85"
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-white dark:bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200 border-t border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">1</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Search</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Search for tutors by subject, price point, or rating reviews.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">2</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Check Profile</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">View teaching experience, bio, and reviews from past students.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">3</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Book Session</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Schedule tutoring sessions that fit your weekly calendar.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">4</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Learn</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Connect with your tutor, discuss study notes, and master skills.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((item, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-800 text-center transition-all duration-200"
            >
              <div className="mb-4 inline-block p-3 bg-emerald-50 dark:bg-slate-800 rounded-xl">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}