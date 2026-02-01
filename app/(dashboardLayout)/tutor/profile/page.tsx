"use client";

import { useState, useEffect } from "react";
import { Card, Form, Input, InputNumber, Button, Select, message, Spin } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { tutorService } from "../../../../src/services/tutor.service";
import { useRouter } from "next/navigation";
import type { TutorProfile } from "@/types/tutor";

const { TextArea } = Input;
const { Option } = Select;

const SUBJECT_OPTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Computer Science",
  "History",
  "Geography",
  "Economics",
  "Accounting",
];

export default function TutorProfilePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await tutorService.getMyProfile();
      if (data) {
        setProfile(data);
        form.setFieldsValue({
          bio: data.bio,
          subjects: data.subjects,
          hourlyRate: data.hourlyRate,
          experience: data.experience,
          education: data.education,
        });
      } else if (error) {
        // Profile doesn't exist yet - that's okay
        console.log("No profile found, user can create one");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setSaving(true);
    try {
      const { data, error } = profile
        ? await tutorService.updateProfile(values)
        : await tutorService.createProfile(values);

      if (error) {
        message.error(error);
      } else if (data) {
        message.success(
          profile ? "Profile updated successfully!" : "Profile created successfully!"
        );
        setProfile(data);
        router.push("/tutor");
      }
    } catch (err) {
      message.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
          {profile ? "Edit Your Profile" : "Create Your Tutor Profile"}
        </h1>
        <p style={{ color: "#666", marginTop: 8 }}>
          {profile
            ? "Update your information to attract more students"
            : "Complete your profile to start teaching"}
        </p>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label="Bio"
            name="bio"
            rules={[
              { required: true, message: "Please enter your bio" },
              { min: 50, message: "Bio should be at least 50 characters" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Tell students about yourself, your teaching style, and experience..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="Subjects You Teach"
            name="subjects"
            rules={[
              { required: true, message: "Please select at least one subject" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select subjects"
              size="large"
              maxTagCount="responsive"
            >
              {SUBJECT_OPTIONS.map((subject) => (
                <Option key={subject} value={subject}>
                  {subject}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Hourly Rate (USD)"
            name="hourlyRate"
            rules={[
              { required: true, message: "Please enter your hourly rate" },
              { type: "number", min: 5, message: "Minimum rate is $5/hour" },
              { type: "number", max: 500, message: "Maximum rate is $500/hour" },
            ]}
          >
            <InputNumber
              prefix="$"
              suffix="/ hour"
              size="large"
              style={{ width: "100%" }}
              placeholder="25"
              min={5}
              max={500}
              step={5}
            />
          </Form.Item>

          <Form.Item
            label="Teaching Experience"
            name="experience"
            rules={[{ max: 200, message: "Maximum 200 characters" }]}
          >
            <Input
              placeholder="e.g., 5 years teaching high school mathematics"
              size="large"
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            label="Education Background"
            name="education"
            rules={[{ max: 200, message: "Maximum 200 characters" }]}
          >
            <Input
              placeholder="e.g., MSc in Mathematics from Harvard University"
              size="large"
              maxLength={200}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={saving}
              icon={<SaveOutlined />}
              block
            >
              {profile ? "Update Profile" : "Create Profile"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}