"use client";

import { useState, useEffect } from "react";
import { Card, Form, Input, InputNumber, Button, Select, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { tutorService } from "../../../../services/tutor.service";
import { adminService } from "../../../../services/admin.service";
import { useRouter } from "next/navigation";
import type { TutorProfile } from "@/types/tutor";
import { useAuth } from "@/context/AuthContext";
import ProfilePhotoUploader from "@/components/ProfilePhotoUploader";

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
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    loadProfile();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await adminService.getAllCategories();
      if (data && !error) {
        setAvailableSubjects(data.map((c: any) => c.name));
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await tutorService.getMyProfile();
      if (data) {
        setProfile(data as any);
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
        setProfile(data as any);
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
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-56 bg-gray-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-80 bg-gray-200 dark:bg-slate-800 rounded-md" />
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex justify-center pb-6 border-b border-gray-100 dark:border-slate-800">
            <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-slate-800" />
          </div>
          <div className="space-y-4">
            <div className="h-4 w-20 bg-gray-200 dark:bg-slate-800 rounded" />
            <div className="h-28 w-full bg-gray-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded" />
            <div className="h-11 w-full bg-gray-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-4 w-28 bg-gray-200 dark:bg-slate-800 rounded" />
            <div className="h-11 w-full bg-gray-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-12 w-full bg-gray-200 dark:bg-slate-800 rounded-xl mt-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {profile ? "Edit Your Profile" : "Create Your Tutor Profile"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          {profile
            ? "Update your information, teaching subjects, and hourly rates to attract more students"
            : "Complete your profile to start receiving booking requests from students"}
        </p>
      </div>

      <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden p-2 sm:p-4">
        {user && profile && (
          <div className="flex justify-center mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
            {/* Fix: Send tutor profile ID (profile.id) instead of user ID (user.id) to match server validation */}
            <ProfilePhotoUploader
              userId={profile.id}
              role="tutor"
              currentPhotoUrl={profile.profilePhoto || user.image}
              onUploadSuccess={async (newPhotoUrl) => {
                setProfile((prev) => (prev ? { ...prev, profilePhoto: newPhotoUrl } : null));
                await refreshUser();
              }}
            />
          </div>
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            label={<span className="font-semibold text-gray-700 dark:text-gray-300">Bio & Introduction</span>}
            name="bio"
            rules={[
              { required: true, message: "Please enter your bio" },
              { min: 10, message: "Bio should be at least 10 characters" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Tell students about yourself, your teaching style, and experience..."
              maxLength={5000}
              showCount
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700 dark:text-gray-300">Subjects You Teach</span>}
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
              className="rounded-xl"
            >
              {(availableSubjects.length > 0 ? availableSubjects : SUBJECT_OPTIONS).map((subject) => (
                <Option key={subject} value={subject}>
                  {subject}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700 dark:text-gray-300">Hourly Rate (USD)</span>}
            name="hourlyRate"
            rules={[
              { required: true, message: "Please enter your hourly rate" },
              { type: "number", min: 5, message: "Minimum rate is $5/hour" },
              { type: "number", max: 5000, message: "Maximum rate is $5000/hour" },
            ]}
          >
            <InputNumber
              prefix="$"
              suffix="/ hour"
              size="large"
              style={{ width: "100%" }}
              placeholder="25"
              min={5}
              max={5000}
              step={5}
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700 dark:text-gray-300">Teaching Experience</span>}
            name="experience"
            rules={[{ max: 200, message: "Maximum 200 characters" }]}
          >
            <Input
              placeholder="e.g., 5 years teaching high school mathematics"
              size="large"
              maxLength={200}
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700 dark:text-gray-300">Education Background</span>}
            name="education"
            rules={[{ max: 200, message: "Maximum 200 characters" }]}
          >
            <Input
              placeholder="e.g., MSc in Mathematics from Harvard University"
              size="large"
              maxLength={200}
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item className="mb-0 pt-3">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={saving}
              icon={<SaveOutlined />}
              className="bg-brand-green hover:bg-brand-green-hover border-0 text-white h-12 rounded-xl font-semibold shadow-sm hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
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