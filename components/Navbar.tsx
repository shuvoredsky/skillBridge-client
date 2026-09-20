"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Dropdown, Avatar, MenuProps, Modal } from "antd";
import {
  Menu,
  X,
  BookOpen,
  User,
  LogOut,
  LayoutDashboard,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { getImageUrl } from "@/lib/getImageUrl";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { logoUrl, siteName } = useSiteConfig();
  const resolvedLogo = getImageUrl(logoUrl);
  const router = useRouter();

  const handleBecomeTutor = () => {
    Modal.confirm({
      title: "Become a Tutor",
      icon: <AlertCircle className="text-amber-500 mr-2" size={22} />,
      content:
        "আপনি একজন Tutor হিসেবে register করতে চাইলে আপনার current session logout হয়ে যাবে, আপনি কি continue করতে চান?",
      okText: "Continue",
      cancelText: "Cancel",
      okButtonProps: {
        className:
          "bg-brand-green hover:bg-brand-green-hover border-0 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
      },
      onOk: async () => {
        await logout();
        router.push("/register");
      },
    });
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Find Tutors", href: "/tutors" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const studentItems: MenuProps["items"] = [
    {
      key: "1",
      label: <Link href="/dashboard">Dashboard</Link>,
      icon: <LayoutDashboard size={16} />,
    },
    {
      key: "2",
      label: <Link href="/dashboard/bookings">My Bookings</Link>,
      icon: <BookOpen size={16} />,
    },
    {
      key: "3",
      label: <Link href="/dashboard/profile">Profile</Link>,
      icon: <User size={16} />,
    },
    {
      type: "divider",
    },
    {
      key: "4",
      label: "Logout",
      icon: <LogOut size={16} />,
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-md sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded-xl px-1 py-0.5"
          >
            {resolvedLogo ? (
              <div className="relative h-10 w-auto flex items-center justify-center">
                <img
                  src={resolvedLogo}
                  alt={siteName || "SkillBridge"}
                  className="h-10 w-auto max-w-[150px] object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center shadow-sm">
                <BookOpen className="text-white" size={20} />
              </div>
            )}
            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {siteName || "SkillBridge"}
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-brand-green dark:hover:text-brand-green font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded-lg px-2 py-1"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === "STUDENT" && (
                  <Button
                    onClick={handleBecomeTutor}
                    type="link"
                    className="text-brand-green dark:text-brand-green font-semibold hover:text-brand-green-hover transition-all duration-200 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-green rounded-lg"
                  >
                    Become a Tutor
                  </Button>
                )}

                <Dropdown menu={{ items: studentItems }} placement="bottomRight" arrow>
                  <div className="flex items-center cursor-pointer space-x-2 bg-gray-50 dark:bg-slate-800 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-green">
                    <Avatar
                      icon={<User size={18} />}
                      src={user.image}
                      className="bg-brand-green flex items-center justify-center"
                    />
                    <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
                      {user.name}
                    </span>
                  </div>
                </Dropdown>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    type="text"
                    className="text-gray-600 dark:text-gray-300 font-medium hover:text-brand-green transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-green rounded-xl"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    type="primary"
                    className="bg-brand-green hover:bg-brand-green-hover dark:bg-brand-green dark:hover:bg-brand-green-hover rounded-xl h-10 px-6 border-0 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-green"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 dark:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-slate-800">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-200 hover:text-brand-green dark:hover:text-brand-green font-medium px-4 py-2 block transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-green rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="px-4 py-2 flex items-center justify-between border-t border-gray-100 dark:border-slate-800">
                <span className="text-gray-600 dark:text-gray-300 font-medium">Theme</span>
                <ThemeToggle />
              </div>
              <div className="px-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                {user ? (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Logged in as {user.role}
                    </div>
                    {user.role === "STUDENT" && (
                      <Button
                        onClick={() => {
                          setIsOpen(false);
                          handleBecomeTutor();
                        }}
                        type="link"
                        className="p-0 text-brand-green dark:text-brand-green font-semibold block text-left"
                      >
                        Become a Tutor
                      </Button>
                    )}
                    <Link
                      href="/dashboard"
                      className="block py-2 text-brand-green dark:text-brand-green font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      My Dashboard
                    </Link>
                    <Button
                      onClick={logout}
                      danger
                      className="w-full rounded-xl active:scale-[0.98] transition-all"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full rounded-xl active:scale-[0.98] transition-all">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button
                        type="primary"
                        className="w-full bg-brand-green hover:bg-brand-green-hover dark:bg-brand-green border-0 rounded-xl active:scale-[0.98] transition-all text-white font-semibold"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}