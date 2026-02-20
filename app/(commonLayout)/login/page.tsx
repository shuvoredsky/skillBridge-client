"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, message, Spin } from "antd";
import {  BookOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const {  Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const [form] = Form.useForm();
  const router = useRouter();

 useEffect(() => {
  if (user) {

    const redirectPath = 
      user.role === "ADMIN" ? "/admin" :
      user.role === "TUTOR" ? "/tutor" : 
      user.role === "STUDENT" ? "/dashboard" : "/";
      
    router.replace(redirectPath);
  }
}, [user, router]);

// Login form এ এভাবে করো
const onFinish = async (values: { email: string; password: string }) => {
  setLoading(true);
  try {
    await login(values.email, values.password);
    // login এর পরে user state এ set হয়ে যাবে
    // redirect login function নিজেই করবে
    message.success("Login successful!");
  } catch (error: any) {
    message.error(error.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spin fullscreen size="large" />
          <p className="mt-4 text-gray-600 font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 bg-[#008060] items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-2 rounded-lg">
              <BookOutlined className="text-[#008060] text-2xl" />
            </div>
            <span className="text-2xl font-bold tracking-tight">SkillBridge</span>
          </div>
          
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Connect with <br /> Expert Tutors
          </h1>
          <p className="text-xl text-emerald-50 mb-12 leading-relaxed opacity-90">
            Join thousands of students learning from the world's best educators. 
            Master any skill, at your own pace.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-12 border-t border-emerald-400/30">
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm text-emerald-100 opacity-80 uppercase tracking-wider">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-emerald-100 opacity-80 uppercase tracking-wider">Expert Tutors</div>
            </div>
            <div>
              <div className="text-3xl font-bold">4.9★</div>
              <div className="text-sm text-emerald-100 opacity-80 uppercase tracking-wider">Avg Rating</div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-[440px]">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="bg-[#008060] p-2 rounded-lg">
                <BookOutlined className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-gray-900">SkillBridge</span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500">Enter your credentials to access your account</p>
          </div>


          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            requiredMark={false}
          >
            <Form.Item
              label={<span className="text-gray-700 font-medium">Email Address</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
              className="mb-6"
            >
              <Input
                placeholder="your.email@example.com"
                className="rounded-xl h-12 border-gray-200 hover:border-[#008060] focus:border-[#008060]"
              />
            </Form.Item>

            <Form.Item
              label={
                <div className="w-full flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Password</span>
                  <Link href="/forgot-password text-[#008060] hover:text-[#006b50] text-sm font-medium">
                    Forgot password?
                  </Link>
                </div>
              }
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
              className="mb-8"
            >
              <Input.Password
                placeholder="Enter your password"
                className="rounded-xl h-12 border-gray-200 hover:border-[#008060] focus:border-[#008060]"
              />
            </Form.Item>

            <Form.Item className="mb-8">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-13 text-base font-semibold rounded-xl bg-[#008060] hover:bg-[#006b50] border-0 shadow-md transition-all duration-200"
              >
                Sign In →
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <Text className="text-gray-500 text-[15px]">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#008060] font-bold hover:text-[#006b50] ml-1">
                Create one now
              </Link>
            </Text>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 leading-relaxed">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-gray-600">Terms</Link> and{" "}
              <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}