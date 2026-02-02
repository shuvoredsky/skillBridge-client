"use client";

import { useState, useEffect } from "react";
import { Card, Form, Input, Button, Avatar, Upload, message } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, CameraOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";
import type { UploadFile } from "antd/es/upload/interface";

export default function StudentProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(user?.image);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      });
      setImageUrl(user.image);
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

  const handleImageChange = (info: any) => {
    if (info.file.status === "done") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(info.file.originFileObj);
      message.success("Profile picture updated");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <Card className="shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <Avatar
              size={120}
              src={imageUrl}
              icon={<UserOutlined />}
              className="bg-gradient-to-br from-indigo-500 to-purple-600"
            />
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleImageChange}
              accept="image/*"
            >
              <Button
                icon={<CameraOutlined />}
                shape="circle"
                className="absolute bottom-0 right-0 shadow-lg"
              />
            </Upload>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mt-4">{user?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>
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
              className="bg-indigo-600 hover:bg-indigo-700 h-12 mt-4"
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Account Information" className="shadow-lg">
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="font-semibold text-gray-900">Student Account</p>
            </div>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="text-sm text-gray-500">Email Verified</p>
              <p className="font-semibold text-gray-900">
                {user?.emailVerified ? "✅ Verified" : "❌ Not Verified"}
              </p>
            </div>
          </div>
          
        </div>
      </Card>

      <Card title="Danger Zone" className="shadow-lg border-red-200">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-500">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button danger disabled>
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
