import Link from "next/link";
import { BookOutlined, FacebookOutlined, TwitterOutlined, InstagramOutlined, LinkedinOutlined } from "@ant-design/icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOutlined className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold text-white">SkillBridge</span>
            </div>
            <p className="text-gray-400 text-sm">
              Connect with expert tutors worldwide and unlock your potential.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tutors" className="hover:text-indigo-400 transition-colors">
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-indigo-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Tutors */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Tutors</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/become-tutor" className="hover:text-indigo-400 transition-colors">
                  Become a Tutor
                </Link>
              </li>
              <li>
                <Link href="/tutor-guidelines" className="hover:text-indigo-400 transition-colors">
                  Guidelines
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-indigo-400 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-indigo-400 transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} SkillBridge. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
              <FacebookOutlined className="text-xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
              <TwitterOutlined className="text-xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
              <InstagramOutlined className="text-xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
              <LinkedinOutlined className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}