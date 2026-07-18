"use client";

import { Row, Col, Form, Input, Button, Card, message } from "antd";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined } from "@ant-design/icons";
import PageHeader from "@/components/PageHeader";

export default function ContactPage() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Contact form submitted:", values);
    // TODO: wire this up to a real contact endpoint when available
    message.success("Thank you! Your message has been sent successfully.");
    form.resetFields();
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
      <PageHeader
        title="Contact Us"
        description="Have questions about SkillBridge? Get in touch with our team."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Row gutter={[32, 32]}>
          {/* Contact Info */}
          <Col xs={24} lg={10}>
            <div className="space-y-6">
              <Card className="rounded-2xl border-none shadow-sm dark:bg-slate-900 transition-colors duration-200">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-950/40 p-3 rounded-xl">
                    <MailOutlined className="text-xl text-brand-green" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Email Us</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">support@skillbridge.com</p>
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-none shadow-sm dark:bg-slate-900 transition-colors duration-200">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl">
                    <PhoneOutlined className="text-xl text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Call Us</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">+880 1234 567 890</p>
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-none shadow-sm dark:bg-slate-900 transition-colors duration-200">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl">
                    <EnvironmentOutlined className="text-xl text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Visit Us</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Dhaka, Bangladesh</p>
                  </div>
                </div>
              </Card>
            </div>
          </Col>

          {/* Contact Form */}
          <Col xs={24} lg={14}>
            <Card className="rounded-3xl border-none shadow-lg p-4 dark:bg-slate-900 transition-colors duration-200">
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
                      label={<span className="dark:text-gray-300">Full Name</span>}
                      name="name"
                      rules={[{ required: true, message: "Please enter your name" }]}
                    >
                      <Input placeholder="John Doe" className="rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="dark:text-gray-300">Email Address</span>}
                      name="email"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Please enter a valid email" }
                      ]}
                    >
                      <Input placeholder="john@example.com" className="rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label={<span className="dark:text-gray-300">Subject</span>}
                  name="subject"
                  rules={[{ required: true, message: "Please enter a subject" }]}
                >
                  <Input placeholder="How can we help?" className="rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                </Form.Item>

                <Form.Item
                  label={<span className="dark:text-gray-300">Message</span>}
                  name="message"
                  rules={[{ required: true, message: "Please type your message" }]}
                >
                  <Input.TextArea rows={4} placeholder="Your message here..." className="rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                </Form.Item>

                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SendOutlined />}
                  className="bg-brand-green hover:bg-brand-green-hover h-12 px-8 font-bold rounded-lg w-full md:w-auto border-0 text-white"
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