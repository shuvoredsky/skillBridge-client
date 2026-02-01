"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "antd";
import { MenuOutlined, CloseOutlined, BookOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Find Tutors", href: "/tutors" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BookOutlined className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              SkillBridge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Link href={user.role === "ADMIN" ? "/admin" : user.role === "TUTOR" ? "/tutor" : "/"}>
                <Button type="primary" className="bg-indigo-600 hover:bg-indigo-700">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button type="text" className="text-gray-700">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button type="primary" className="bg-indigo-600 hover:bg-indigo-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-indigo-600"
          >
            {isOpen ? (
              <CloseOutlined className="text-2xl" />
            ) : (
              <MenuOutlined className="text-2xl" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-indigo-600 font-medium px-4 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-200">
                {user ? (
                  <Link href={user.role === "ADMIN" ? "/admin" : user.role === "TUTOR" ? "/tutor" : "/"}>
                    <Button type="primary" className="w-full bg-indigo-600">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login">
                      <Button type="text" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button type="primary" className="w-full bg-indigo-600">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}