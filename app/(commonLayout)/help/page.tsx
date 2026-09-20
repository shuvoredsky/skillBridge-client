"use client";

import { Collapse, Card, Button } from "antd";
import { QuestionCircleOutlined, BookOutlined, UserOutlined } from "@ant-design/icons";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";

export default function HelpPage() {
  const studentFaqs = [
    {
      q: "How do I search for a tutor?",
      a: "Navigate to the 'Find Tutors' page in the top navbar. You can search by subject name, or filter by hourly rate (min/max price) and minimum ratings. Once you find a tutor, click their profile card to see more details."
    },
    {
      q: "How do I book a lesson session?",
      a: "To book a session, log in to your student account, go to a tutor's profile page, choose an available day and time slot from their Availability schedule, type your subject and study notes, and click the Book button. Your session will appear in your 'My Bookings' calendar."
    },
    {
      q: "Can I cancel a scheduled booking?",
      a: "Yes, you can manage your bookings directly in the Student Dashboard under the 'My Bookings' tab. Please consult with your tutor before canceling to ensure they are aware of the schedule change."
    },
    {
      q: "How are reviews for tutors verified?",
      a: "Only students who have completed a booking session with a tutor can write a review. This guarantees that all ratings and testimonials on SkillBridge are verified and authentic."
    }
  ];

  const tutorFaqs = [
    {
      q: "How do I become a tutor?",
      a: "If you have a student account, click the 'Become a Tutor' link in the top header. You will be prompted to create your tutor profile by providing a bio, hourly rate, teaching experience, and education details. Once completed, your profile goes live!"
    },
    {
      q: "How do I set my availability?",
      a: "Log in to your tutor account, go to the Tutor Dashboard, and click the 'Availability' tab. Here you can add, update, or remove weekly time slots. Students can only book sessions during these active slots."
    },
    {
      q: "How do I manage my bookings?",
      a: "Tutors can view all student bookings on their Tutor Dashboard homepage. This lists upcoming dates, student details, and study notes so you can prepare for your lessons ahead of time."
    },
    {
      q: "How do I change my profile photo?",
      a: "Go to your Tutor Profile page in the dashboard. Click on your profile avatar or the edit camera icon to select a new image. Supported types are JPEG, PNG, and WebP up to 5MB."
    }
  ];

  const studentItems = studentFaqs.map((faq, idx) => ({
    key: `s-${idx}`,
    label: <span className="font-semibold text-gray-900 dark:text-gray-100 text-base">{faq.q}</span>,
    children: <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{faq.a}</p>,
  }));

  const tutorItems = tutorFaqs.map((faq, idx) => ({
    key: `t-${idx}`,
    label: <span className="font-semibold text-gray-900 dark:text-gray-100 text-base">{faq.q}</span>,
    children: <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{faq.a}</p>,
  }));

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 transition-colors duration-200">
      <PageHeader
        title="Help & Support"
        description="Frequently asked questions, guides, and troubleshooting tips to help you navigate SkillBridge."
        breadcrumbs={[{ label: "Help" }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {/* For Students Accordion */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-brand-green">
              <BookOutlined className="text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">For Students</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Everything you need to know about booking and learning</p>
            </div>
          </div>
          
          <Collapse 
            accordion 
            expandIconPosition="end"
            items={studentItems}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden transition-all duration-200"
          />
        </section>

        {/* For Tutors Accordion */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-brand-green">
              <UserOutlined className="text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">For Tutors</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Managing schedules, profiles, and student sessions</p>
            </div>
          </div>
          
          <Collapse 
            accordion 
            expandIconPosition="end"
            items={tutorItems}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden transition-all duration-200"
          />
        </section>

        {/* Still Need Help? Callout */}
        <Card className="rounded-3xl border-none shadow-xl bg-gradient-to-r from-emerald-600 to-teal-700 dark:from-emerald-700 dark:to-teal-900 text-center p-8 sm:p-10 text-white transition-colors duration-200">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-5 text-white">
            <HelpCircle size={32} />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white">Still Need Help?</h3>
          <p className="text-emerald-100 max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Can&apos;t find the answer you are looking for? Our friendly support team is here to assist you with any questions or issues.
          </p>
          <div className="flex justify-center">
            <Link href="/contact">
              <Button
                size="large"
                className="bg-white hover:bg-gray-50 text-emerald-700 font-bold border-none rounded-xl h-12 px-8 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 inline-flex items-center gap-2"
              >
                <span>Contact Support</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
