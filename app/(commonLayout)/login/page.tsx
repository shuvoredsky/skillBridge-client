"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, message, Spin } from "antd";
import { UserOutlined, LockOutlined, BookOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const [form] = Form.useForm();
  const router = useRouter();

  // ✅ যদি already logged in থাকে
  useEffect(() => {
    if (user) {
      const redirectPath = 
        user.role === "ADMIN" ? "/admin" :
        user.role === "TUTOR" ? "/tutor" : "/student";
      
      router.replace(redirectPath);
    }
  }, [user, router]);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success("Login successful!");
    } catch (error: any) {
      message.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loading state
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600 font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <BookOutlined className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SkillBridge</h1>
          <p className="text-gray-600">Learn from the best tutors worldwide</p>
        </div>

        <Card 
          className="shadow-2xl border-0 rounded-2xl overflow-hidden"
          styles={{
            body: { padding: '2.5rem' }
          }}
        >
          <div className="text-center mb-8">
            <Title level={2} className="!mb-2 !text-gray-900">
              Welcome Back
            </Title>
            <Text type="secondary" className="text-base">
              Sign in to continue your learning journey
            </Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Email address"
                className="rounded-lg h-12"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                className="rounded-lg h-12"
              />
            </Form.Item>

            <div className="flex items-center justify-between mb-6">
              <Link 
                href="/forgot-password" 
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Form.Item className="mb-6">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 text-base font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                loading={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center pt-6 border-t border-gray-200">
            <Text type="secondary" className="text-base">
              Don't have an account?{" "}
              <Link 
                href="/register" 
                className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
              >
                Create account
              </Link>
            </Text>
          </div>
        </Card>

        <div className="text-center mt-8">
          <Text type="secondary" className="text-sm">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-indigo-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-indigo-600 hover:underline">
              Privacy Policy
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
}