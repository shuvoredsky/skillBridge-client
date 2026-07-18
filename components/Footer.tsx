import Link from "next/link";
import { BookOpen, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Bug 2 Fix: Apply dynamic light/dark class selectors for footer background and borders
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
                <BookOpen className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">SkillBridge</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Connect with expert tutors worldwide and unlock your potential.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tutors" className="text-gray-500 dark:text-gray-400 hover:text-brand-green transition-colors text-sm">
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 dark:text-gray-400 hover:text-brand-green transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-brand-green transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-500 dark:text-gray-400 hover:text-brand-green transition-colors text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-3">Support & Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-500 dark:text-gray-400 hover:text-brand-green transition-colors text-sm">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-500 dark:text-gray-400 hover:text-brand-green transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-500 dark:text-gray-400 hover:text-brand-green transition-colors text-sm">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-500 dark:text-gray-400 hover:text-brand-green transition-colors text-sm">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-3">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-brand-green flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-white transition-all"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-brand-green flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-white transition-all"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-brand-green flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-white transition-all"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-brand-green flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-white transition-all"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            © {currentYear} SkillBridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}