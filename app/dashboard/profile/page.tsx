"use client";

import { useState, useEffect } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";
import ProfilePhotoUploader from "@/components/ProfilePhotoUploader";

export default function StudentProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      });
    }
  }, [user, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      console.log("Profile update:", values);
      message.success("Profile updated successfully!");
      await refreshUser();
    } catch (error) {
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account information</p>
      </div>

      <Card className="shadow-lg dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-col items-center mb-8">
          {user && (
            <ProfilePhotoUploader
              userId={user.id}
              role="student"
              currentPhotoUrl={user.image}
            />
          )}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">{user?.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: "Please enter your name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Your name" />
          </Form.Item>

          <Form.Item name="email" label="Email Address">
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              disabled
              className="bg-gray-50"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number (Optional)"
            rules={[
              {
                pattern: /^[0-9]{10,15}$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="text-gray-400" />}
              placeholder="Your phone number"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="bg-brand-green hover:bg-brand-green-hover border-0 h-12 mt-4"
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title={<span className="dark:text-white">Account Information</span>} className="shadow-lg dark:bg-slate-900 dark:border-slate-800">
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b dark:border-slate-800">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Account Type</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Student Account</p>
            </div>
          </div>
          {/* ❌ REMOVED: Email Verified section */}
        </div>
      </Card>

      <Card title={<span className="text-brand-red font-bold">Danger Zone</span>} className="shadow-lg border-red-200 dark:bg-slate-900 dark:border-red-950/40">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Delete Account</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button danger disabled className="dark:bg-red-950/20 dark:text-red-400">
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}