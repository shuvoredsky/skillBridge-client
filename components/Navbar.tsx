"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Dropdown, Avatar, MenuProps } from "antd";
import { MenuOutlined, CloseOutlined, BookOutlined, UserOutlined, LogoutOutlined, DashboardOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); // logout ফাংশনটি context থেকে নিন

  // পাবলিক লিংক যেগুলো সবসময় থাকবে
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Find Tutors", href: "/tutors" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // স্টুডেন্টের জন্য ড্রপডাউন মেনু
  const studentItems: MenuProps['items'] = [
    {
      key: '1',
      label: <Link href="/dashboard">Dashboard</Link>,
      icon: <DashboardOutlined />,
    },
    {
      key: '2',
      label: <Link href="/dashboard/bookings">My Bookings</Link>,
      icon: <BookOutlined />,
    },
    {
      key: '3',
      label: <Link href="/dashboard/profile">Profile</Link>,
      icon: <UserOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: logout
    },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BookOutlined className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              SkillBridge
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                
                {user.role === "STUDENT" && (
                  <Link href="/become-tutor">
                    <Button type="link" className="text-indigo-600 font-semibold">Become a Tutor</Button>
                  </Link>
                )}
                
                <Dropdown menu={{ items: studentItems }} placement="bottomRight" arrow>
                  <div className="flex items-center cursor-pointer space-x-2 bg-gray-50 p-1 pr-3 rounded-full hover:bg-gray-100 transition-all">
                    <Avatar icon={<UserOutlined />} src={user.image} className="bg-indigo-600" />
                    <span className="font-medium text-gray-700">{user.name}</span>
                  </div>
                </Dropdown>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button type="text" className="text-gray-600 font-medium">Login</Button>
                </Link>
                <Link href="/register">
                  <Button type="primary" className="bg-indigo-600 rounded-lg h-10 px-6">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700">
            {isOpen ? <CloseOutlined className="text-2xl" /> : <MenuOutlined className="text-2xl" />}
          </button>
        </div>

        
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-indigo-600 font-medium px-4 py-2 block"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="px-4 pt-4 border-t border-gray-100">
                {user ? (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-500 mb-2">Logged in as {user.role}</div>
                    <Link href="/dashboard" className="block py-2 text-indigo-600 font-medium">My Dashboard</Link>
                    <Button onClick={logout} danger className="w-full">Logout</Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Login</Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button type="primary" className="w-full bg-indigo-600">Sign Up</Button>
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