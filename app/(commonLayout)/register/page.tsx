"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Form, Input, Button, Typography, message, Radio } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, BookOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Text } = Typography;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const [form] = Form.useForm();
  

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
    role: "STUDENT" | "TUTOR" ;
  }) => {
    setLoading(true);
    try {
      await register(values.name, values.email, values.password, values.role);
      message.success(
        "Registration successful! Please check your email to verify."
      );
      setTimeout(() => {
      router.push("/login");
    }, 2000);
    } catch (error: any) {
      message.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      <div className="hidden lg:flex lg:w-1/2 bg-brand-green relative p-12 flex-col justify-between text-white overflow-hidden">
        <div className="z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <BookOutlined className="text-brand-green text-2xl" />
            </div>
            <span className="text-2xl font-bold tracking-tight">SkillBridge</span>
          </div>
          
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Start Your <br /> Learning Journey
          </h1>
          <p className="text-lg text-emerald-50 opacity-90 max-w-sm leading-relaxed">
            Create an account to connect with expert tutors and master new skills at your own pace.
          </p>
        </div>

        <div className="z-10">
          <div className="flex -space-x-3 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-green bg-emerald-100 overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-brand-green bg-emerald-400 flex items-center justify-center text-xs font-bold text-white">
              +2k
            </div>
          </div>
          <p className="text-sm font-medium text-emerald-100 opacity-90 italic">Join over 2,000+ active learners today!</p>
        </div>

        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl"></div>
      </div>

      
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="w-full max-w-[440px]">
          
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="bg-brand-green p-2 rounded-lg">
                <BookOutlined className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">SkillBridge</span>
            </div>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400">Sign up to get started with SkillBridge</p>
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
              label={<span className="text-gray-700 dark:text-gray-300 font-medium">Full Name</span>}
              name="name"
              rules={[
                { required: true, message: "Please enter your name" },
                { min: 2, message: "Name must be at least 2 characters" },
              ]}
              className="mb-4"
            >
              <Input
                prefix={<UserOutlined className="text-gray-400 mr-2" />}
                placeholder="John Doe"
                className="rounded-xl h-12 border-gray-200 hover:border-brand-green focus:border-brand-green dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 dark:text-gray-300 font-medium">I want to join as a</span>}
              name="role"
              rules={[{ required: true, message: "Please select your role" }]}
              className="mb-4"
            >
              <Radio.Group className="w-full" aria-label="Select account role">
                <div className="grid grid-cols-2 gap-4">
                  <Radio.Button
                    value="STUDENT"
                    aria-label="Register as Student"
                    className="text-center h-12 flex items-center justify-center rounded-xl font-medium dark:bg-slate-800 dark:text-gray-200 dark:border-slate-700"
                  >
                    Student
                  </Radio.Button>
                  <Radio.Button
                    value="TUTOR"
                    aria-label="Register as Tutor"
                    className="text-center h-12 flex items-center justify-center rounded-xl font-medium dark:bg-slate-800 dark:text-gray-200 dark:border-slate-700"
                  >
                    Tutor
                  </Radio.Button>
                </div>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 dark:text-gray-300 font-medium">Email Address</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
              className="mb-4"
            >
              <Input
                prefix={<MailOutlined className="text-gray-400 mr-2" />}
                placeholder="example@mail.com"
                className="rounded-xl h-12 border-gray-200 hover:border-brand-green focus:border-brand-green dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item
                label={<span className="text-gray-700 dark:text-gray-300 font-medium">Password</span>}
                name="password"
                rules={[
                  { required: true, message: "Please enter a password" },
                  { min: 8, message: "At least 8 characters" },
                ]}
                className="mb-4"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400 mr-2" />}
                  placeholder="Password"
                  className="rounded-xl h-12 border-gray-200 hover:border-brand-green focus:border-brand-green dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-gray-700 dark:text-gray-300 font-medium">Confirm</span>}
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
                className="mb-4"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400 mr-2" />}
                  placeholder="Confirm"
                  className="rounded-xl h-12 border-gray-200 hover:border-brand-green focus:border-brand-green dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </Form.Item>
            </div>

            <Form.Item className="pt-2 mb-4">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-13 text-base font-semibold rounded-xl bg-brand-green hover:bg-brand-green-hover border-0 shadow-md transition-all duration-200 text-white"
                loading={loading}
              >
                Create Account →
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6">
            <Text className="text-gray-500 dark:text-gray-400 text-[15px]">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-green font-bold hover:text-brand-green-hover ml-1">
                Sign in
              </Link>
            </Text>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-relaxed">
              Secured by SkillBridge Auth Systems
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}