"use client";

import { Typography, Row, Col, Form, Input, Button, Card, message } from "antd";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function ContactPage() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Success:", values);
    message.success("Thank you! Your message has been sent successfully.");
    form.resetFields();
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Title className="!mb-2">Get in Touch</Title>
          <Paragraph className="text-gray-500 text-lg">
            Have questions about SkillBridge? We are here to help you.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {/* Contact Info */}
          <Col xs={24} lg={10}>
            <div className="space-y-6">
              <Card className="rounded-2xl border-none shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-3 rounded-xl">
                    <MailOutlined className="text-xl text-indigo-600" />
                  </div>
                  <div>
                    <Title level={5} className="!mb-1">Email Us</Title>
                    <Text className="text-gray-500">support@skillbridge.com</Text>
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-none shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-xl">
                    <PhoneOutlined className="text-xl text-emerald-600" />
                  </div>
                  <div>
                    <Title level={5} className="!mb-1">Call Us</Title>
                    <Text className="text-gray-500">+880 1234 567 890</Text>
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-none shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <EnvironmentOutlined className="text-xl text-orange-600" />
                  </div>
                  <div>
                    <Title level={5} className="!mb-1">Visit Us</Title>
                    <Text className="text-gray-500">Dhaka, Bangladesh</Text>
                  </div>
                </div>
              </Card>
            </div>
          </Col>

          {/* Contact Form */}
          <Col xs={24} lg={14}>
            <Card className="rounded-3xl border-none shadow-lg p-4">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                size="large"
                requiredMark={false}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Full Name"
                      name="name"
                      rules={[{ required: true, message: "Please enter your name" }]}
                    >
                      <Input placeholder="John Doe" className="rounded-lg" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email Address"
                      name="email"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Invalid email" }
                      ]}
                    >
                      <Input placeholder="john@example.com" className="rounded-lg" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Subject"
                  name="subject"
                  rules={[{ required: true, message: "Please enter a subject" }]}
                >
                  <Input placeholder="How can we help?" className="rounded-lg" />
                </Form.Item>

                <Form.Item
                  label="Message"
                  name="message"
                  rules={[{ required: true, message: "Please type your message" }]}
                >
                  <Input.TextArea rows={4} placeholder="Your message here..." className="rounded-lg" />
                </Form.Item>

                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SendOutlined />}
                  className="bg-indigo-600 h-12 px-8 font-bold rounded-lg w-full md:w-auto"
                >
                  Send Message
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}