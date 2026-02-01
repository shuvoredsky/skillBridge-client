"use client";

import { Typography, Row, Col, Card } from "antd";
import { TeamOutlined, BulbOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function AboutPage() {
  const values = [
    {
      icon: <BulbOutlined className="text-3xl text-indigo-600" />,
      title: "Our Mission",
      desc: "To democratize education by connecting curious learners with expert tutors worldwide, making personalized learning accessible to everyone.",
    },
    {
      icon: <TeamOutlined className="text-3xl text-indigo-600" />,
      title: "Our Community",
      desc: "A vibrant ecosystem of 10,000+ students and 500+ tutors sharing knowledge and growing together every single day.",
    },
    {
      icon: <SafetyCertificateOutlined className="text-3xl text-indigo-600" />,
      title: "Quality Assured",
      desc: "We verify every tutor's credentials and use student reviews to ensure the highest standards of teaching on SkillBridge.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-indigo-600 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Title className="!text-white !mb-4">Empowering Minds Through Expert Guidance</Title>
          <Paragraph className="text-indigo-100 text-lg">
            SkillBridge is a bridge between your current skills and your future goals. 
            We believe that the right tutor can change the trajectory of a student's life.
          </Paragraph>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={12}>
            <Title level={2}>What is SkillBridge?</Title>
            <Paragraph className="text-gray-600 text-base leading-relaxed">
              SkillBridge is a comprehensive full-stack platform designed to simplify the process of finding and booking expert tutors. 
              Whether you are a student looking to master a complex subject or a tutor wanting to share your expertise, 
              our platform provides the tools you need to succeed.
            </Paragraph>
            <Paragraph className="text-gray-600 text-base leading-relaxed">
              From instant booking to verified reviews, we've built a secure and intuitive environment where education knows no boundaries.
            </Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100">
              <img 
                src="https://img.freepik.com/free-vector/learning-concept-illustration_114360-6186.jpg" 
                alt="About SkillBridge" 
                className="w-full h-auto mix-blend-multiply"
              />
            </div>
          </Col>
        </Row>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Title level={2}>Our Core Values</Title>
          </div>
          <Row gutter={[24, 24]}>
            {values.map((item, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className="h-full border-none shadow-sm hover:shadow-md transition-all text-center rounded-2xl">
                  <div className="mb-4">{item.icon}</div>
                  <Title level={4}>{item.title}</Title>
                  <Text className="text-gray-500">{item.desc}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>
    </div>
  );
}