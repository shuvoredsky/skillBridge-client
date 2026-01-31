"use client";

import { Button, Card, Form, Input, Typography } from "antd";
import { useRouter } from "next/navigation";
import { authService } from "../../../src/services/auth.service";

const { Title } = Typography;

export default function LoginPage() {
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    const res = await AuthService.signIn(values);

    if (res?.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      if (res.user.role === "ADMIN") {
        router.push("/admin");
      } else if (res.user.role === "TUTOR") {
        router.push("/user");
      } else {
        router.push("/");
      }
    } else {
      alert(res?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Login
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
