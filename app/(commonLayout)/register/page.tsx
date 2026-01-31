"use client";

import { Button, Card, Form, Input, Select, Typography } from "antd";
import { useRouter } from "next/navigation";

const { Title } = Typography;
const { Option } = Select;

export default function RegisterPage() {
  const router = useRouter();

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const res = await fetch("http://localhost:5000/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration successful. Please verify your email.");
      router.push("/login");
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card style={{ width: 420 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Create Account
        </Title>

        <Form layout="vertical" onFinish={onFinish} initialValues={{ role: "STUDENT" }}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Your full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input placeholder="Email address" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item label="Register as" name="role">
            <Select>
              <Option value="STUDENT">Student</Option>
              <Option value="TUTOR">Tutor</Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Sign Up
          </Button>
        </Form>
      </Card>
    </div>
  );
}
