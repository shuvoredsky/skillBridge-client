import PageHeader from "@/components/PageHeader";
import { Shield, Lock, Eye, FileText, Database, UserCheck, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - SkillBridge",
  description: "Learn how SkillBridge collects, uses, and protects your information.",
};

const sections = [
  { id: "information-we-collect", number: "1", title: "Information We Collect", icon: Eye },
  { id: "how-we-use-information", number: "2", title: "How We Use Your Information", icon: FileText },
  { id: "cookies-and-tracking", number: "3", title: "Cookies & Tracking", icon: Database },
  { id: "data-security", number: "4", title: "Data Security", icon: Lock },
  { id: "third-party-services", number: "5", title: "Third-Party Services", icon: Shield },
  { id: "your-rights", number: "6", title: "Your Rights", icon: UserCheck },
  { id: "contact-information", number: "7", title: "Contact Information", icon: Mail },
];

export default function PrivacyPolicyPage() {
  const lastUpdated = "July 18, 2026";

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 transition-colors duration-200 scroll-smooth">
      <PageHeader
        title="Privacy Policy"
        description={`Last updated: ${lastUpdated}`}
        breadcrumbs={[{ label: "Privacy Policy" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Table of Contents Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold text-base">
                <Shield size={18} className="text-brand-green" />
                <span>Table of Contents</span>
              </div>
              <nav className="space-y-1">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-green dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all duration-200 group"
                    >
                      <span className="w-6 h-6 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-xs flex items-center justify-center font-bold group-hover:bg-brand-green group-hover:text-white transition-colors">
                        <Icon size={12} />
                      </span>
                      <span className="truncate">{sec.title}</span>
                    </a>
                  );
                })}
              </nav>

              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-800">
                <div className="bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl p-4 border border-emerald-100/60 dark:border-emerald-900/40">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1">
                    Have privacy concerns?
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                    Our compliance team is ready to answer any questions about your personal data.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green hover:text-brand-green-hover transition-colors"
                  >
                    <span>Contact Privacy Team</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Privacy Policy Text Content */}
          <main className="lg:col-span-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200 space-y-10">
            {/* Section 1 */}
            <section id="information-we-collect" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-slate-800">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-brand-green font-bold text-sm flex items-center justify-center">
                  1
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Information We Collect
                </h2>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                We collect information that you provide directly to us when creating or updating your account, using our tutoring search filters, scheduling lesson bookings, or communicating with us. This includes:
              </p>
              <ul className="space-y-2.5 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green mt-2 flex-shrink-0" />
                  <span>
                    <strong className="text-gray-900 dark:text-white">Account Credentials:</strong> Full name, email address, password, phone number, and account roles (Student or Tutor).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green mt-2 flex-shrink-0" />
                  <span>
                    <strong className="text-gray-900 dark:text-white">Profile Details:</strong> Biographical descriptions, hourly rates, skills, subjects taught, teaching experience, education certificates, and profile photos.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green mt-2 flex-shrink-0" />
                  <span>
                    <strong className="text-gray-900 dark:text-white">Session Info:</strong> Scheduled booking dates, duration, subjects requested, student lesson notes, and completed tutor review feedback.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="how-we-use-information" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-slate-800">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-brand-green font-bold text-sm flex items-center justify-center">
                  2
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  How We Use Your Information
                </h2>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                We use the collected information to power and enhance the SkillBridge marketplace platform:
              </p>
              <ul className="space-y-2.5 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green mt-2 flex-shrink-0" />
                  <span>To register, verify, and authenticate user accounts safely.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green mt-2 flex-shrink-0" />
                  <span>To display tutor profiles in public searches, including pricing, subjects, and ratings.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green mt-2 flex-shrink-0" />
                  <span>To enable students to schedule and pay for lesson bookings with tutors.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green mt-2 flex-shrink-0" />
                  <span>To notify tutors of new sessions and manage calendar availabilities in real-time.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green mt-2 flex-shrink-0" />
                  <span>To process student feedback and average reviews for transparent quality assurance.</span>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="cookies-and-tracking" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-slate-800">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-brand-green font-bold text-sm flex items-center justify-center">
                  3
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Cookies & Tracking Technologies
                </h2>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                We use cookies and equivalent local storage browser mechanisms to preserve active user sessions and retain state (such as your preferred light/dark layout theme settings). You can configure your browser to disable cookies, but doing so may limit your access to authenticated dashboard workflows.
              </p>
            </section>

            {/* Section 4 */}
            <section id="data-security" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-slate-800">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-brand-green font-bold text-sm flex items-center justify-center">
                  4
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Data Security
                </h2>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                We utilize database constraints, encryption standards, and secure transport methods to safeguard your information from unauthorized disclosure. However, no internet transmission is 100% secure. While we strive to protect your data, we cannot guarantee its absolute security.
              </p>
            </section>

            {/* Section 5 */}
            <section id="third-party-services" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-slate-800">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-brand-green font-bold text-sm flex items-center justify-center">
                  5
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Third-Party Services
                </h2>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                We do not sell your personal information. We may share data with secure third-party database adapters or email dispatch providers to operate the website services. These entities are obligated to restrict their usage to assisting our core platform functionality.
              </p>
            </section>

            {/* Section 6 */}
            <section id="your-rights" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-slate-800">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-brand-green font-bold text-sm flex items-center justify-center">
                  6
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Your Rights
                </h2>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                You have the right to access the personal information we hold about you, request corrections to erroneous data, or ask for account deletion. To exercise these rights, please visit your account Profile dashboard or submit a support query via our Contact page.
              </p>
            </section>

            {/* Section 7 */}
            <section id="contact-information" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-slate-800">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-brand-green font-bold text-sm flex items-center justify-center">
                  7
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Contact Information
                </h2>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                For questions, clarifications, or data requests regarding this Privacy Policy, please reach out directly to our privacy officer:
              </p>
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">Official Support Email</span>
                    <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">privacy@skillbridge.com</span>
                  </div>
                </div>
                <a
                  href="mailto:privacy@skillbridge.com"
                  className="px-4 py-2 bg-brand-green hover:bg-brand-green-hover text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Send Email
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

