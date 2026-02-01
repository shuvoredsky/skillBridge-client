"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, BookOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      await register(values.name, values.email, values.password);
      message.success(
        "Registration successful! Please check your email to verify."
      );
    } catch (error: any) {
      message.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      
      <div className="hidden lg:flex lg:w-[45%] bg-[#008060] relative p-12 flex-col justify-between text-white">
        <div className="z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <BookOutlined className="text-[#008060] text-2xl" />
            </div>
            <span className="text-2xl font-bold tracking-tight">SkillBridge</span>
          </div>
          
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Start Your <br /> Learning Journey
          </h1>
          <p className="text-lg opacity-90 max-w-sm leading-relaxed">
            Create an account to connect with expert tutors and master new skills at your own pace.
          </p>
        </div>

        <div className="z-10">
          <div className="flex -space-x-3 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[#008060] bg-gray-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-[#008060] bg-emerald-400 flex items-center justify-center text-xs font-bold">
              +2k
            </div>
          </div>
          <p className="text-sm font-medium opacity-80 italic">Join over 2,000+ active learners today!</p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
      </div>

      {/* Right Side: Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16">
        <div className="w-full max-w-[440px]">
          {/* Mobile Logo Only */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <BookOutlined className="text-[#008060] text-2xl" />
              <span className="text-xl font-bold text-gray-900">SkillBridge</span>
            </div>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">Sign up to get started with SkillBridge</p>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            requiredMark={false}
            className="space-y-1"
          >
            <Form.Item
              label={<span className="text-gray-700 font-semibold">Full Name</span>}
              name="name"
              rules={[
                { required: true, message: "Please enter your name" },
                { min: 2, message: "Name must be at least 2 characters" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400 mr-2" />}
                placeholder="John Doe"
                className="rounded-xl h-12 border-gray-200"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-semibold">Email Address</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400 mr-2" />}
                placeholder="example@mail.com"
                className="rounded-xl h-12 border-gray-200"
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item
                label={<span className="text-gray-700 font-semibold">Password</span>}
                name="password"
                rules={[
                  { required: true, message: "Please enter a password" },
                  { min: 8, message: "At least 8 characters" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400 mr-2" />}
                  placeholder="Password"
                  className="rounded-xl h-12 border-gray-200"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-gray-700 font-semibold">Confirm</span>}
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Confirm password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mismatch"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400 mr-2" />}
                  placeholder="Confirm"
                  className="rounded-xl h-12 border-gray-200"
                />
              </Form.Item>
            </div>

            <Form.Item className="pt-2">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 text-base font-bold rounded-xl bg-[#008060] hover:bg-[#006b50] border-0 shadow-md transition-all duration-200"
                loading={loading}
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6">
            <Text className="text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-[#008060] font-bold hover:underline ml-1">
                Sign in
              </Link>
            </Text>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest leading-relaxed">
              Secured by SkillBridge Auth Systems
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}