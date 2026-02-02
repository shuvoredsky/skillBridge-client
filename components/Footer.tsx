import Link from "next/link";
import { BookOpen, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold text-white">SkillBridge</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connect with expert tutors worldwide and unlock your potential.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tutors" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">For Students</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-all"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-all"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-all"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-all"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-400 text-xs sm:text-sm">
            © {currentYear} SkillBridge. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs sm:text-sm">
            <Link href="/terms" className="text-gray-400 hover:text-indigo-400 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-indigo-400 transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-indigo-400 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}