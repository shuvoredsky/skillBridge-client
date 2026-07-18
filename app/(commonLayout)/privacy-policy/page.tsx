import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Privacy Policy - SkillBridge",
  description: "Learn how SkillBridge collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "July 18, 2026";

  // NOTE: This privacy policy is a template/placeholder legal text for demonstration purposes. A real lawyer should review this before actual production use.

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-16 transition-colors duration-200">
      <PageHeader
        title="Privacy Policy"
        description={`Last updated: ${lastUpdated}`}
        breadcrumbs={[{ label: "Privacy Policy" }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200 space-y-8">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when creating or updating your account, using our tutoring search filters, scheduling lesson bookings, or communicating with us. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account Credentials:</strong> Full name, email address, password, phone number, and account roles (Student or Tutor).</li>
              <li><strong>Profile Details:</strong> Biographical descriptions, hourly rates, skills, subjects taught, teaching experience, education certificates, and profile photos.</li>
              <li><strong>Session Info:</strong> Scheduled booking dates, duration, subjects requested, student lesson notes, and completed tutor review feedback.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. How We Use Your Information</h2>
            <p>
              We use the collected information to power and enhance the SkillBridge marketplace platform:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To register and verify user accounts.</li>
              <li>To display tutor profiles in public searches, including pricing and reviews.</li>
              <li>To enable students to schedule lesson bookings with tutors.</li>
              <li>To notify tutors of new sessions and manage calendar availabilities.</li>
              <li>To process student feedback and average reviews for quality assurance.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. Cookies & Tracking Technologies</h2>
            <p>
              We use cookies and equivalent local storage browser mechanisms to preserve active user sessions and retain state (such as your preferred light/dark layout theme settings). You can configure your browser to disable cookies, but doing so may limit your access to authenticated dashboard workflows.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. Data Security</h2>
            <p>
              We utilize database constraints and secure transport methods to safeguard your information from unauthorized disclosure. However, no internet transmission is 100% secure. While we strive to protect your data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">5. Third-Party Services</h2>
            <p>
              We do not sell your personal information. We may share data with secure third-party database adapters or email dispatch providers to operate the website services. These entities are obligated to restrict their usage to assisting our core functionality.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">6. Your Rights</h2>
            <p>
              You have the right to access the personal information we hold about you, request corrections to erroneous data, or ask for account deletion. To exercise these rights, please visit your account Profile dashboard or submit a support query via our Contact page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">7. Contact Information</h2>
            <p>
              For questions or clarifications regarding this Privacy Policy, please email us at: <strong>privacy@skillbridge.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
