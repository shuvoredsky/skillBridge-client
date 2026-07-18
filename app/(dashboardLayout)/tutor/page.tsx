"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Empty, Spin, Alert } from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { tutorService } from  "../../../services/tutor.service";;
import { useRouter } from "next/navigation";
import type { TutorProfile, Session } from "@/types/tutor";

export default function TutorDashboard() {
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [profileRes, sessionsRes] = await Promise.all([
        tutorService.getMyProfile(),
        tutorService.getMySessions(),
      ]);

      if (profileRes.data) setProfile(profileRes.data as any);
      if (sessionsRes.data) setSessions(sessionsRes.data as any);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin fullscreen size="large" tip="Loading your dashboard..." />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className="dark:bg-slate-900 dark:border-slate-800">
        <Empty
          description={<span className="dark:text-gray-400">You haven't created your tutor profile yet</span>}
          style={{ padding: "40px 0" }}
        >
          <button
            onClick={() => router.push("/tutor/profile")}
            className="bg-brand-green hover:bg-brand-green-hover text-white font-medium px-6 py-2.5 rounded-lg border-0 transition-all cursor-pointer text-base"
          >
            Create Profile Now
          </button>
        </Empty>
      </Card>
    );
  }

  const confirmedSessions = sessions.filter((s) => s.status === "CONFIRMED");
  const completedSessions = sessions.filter((s) => s.status === "COMPLETED");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back!</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here's what's happening with your tutoring sessions
        </p>
      </div>

      {profile.totalReviews === 0 && (
        <Alert
          message="Get your first review!"
          description="Complete sessions and encourage students to leave reviews to build your reputation."
          type="info"
          showIcon
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <Statistic
              title={<span className="dark:text-gray-400">Total Sessions</span>}
              value={sessions.length}
              prefix={<CalendarOutlined className="text-brand-green" />}
              styles={{ content: { color: "#10b981" } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <Statistic
              title={<span className="dark:text-gray-400">Upcoming</span>}
              value={confirmedSessions.length}
              prefix={<ClockCircleOutlined className="text-amber-500" />}
              styles={{ content: { color: "#f59e0b" } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <Statistic
              title={<span className="dark:text-gray-400">Completed</span>}
              value={completedSessions.length}
              prefix={<CheckCircleOutlined className="text-brand-green" />}
              styles={{ content: { color: "#10b981" } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <Statistic
              title={<span className="dark:text-gray-400">Rating</span>}
              value={profile.rating.toFixed(1)}
              prefix={<StarOutlined className="text-amber-500" />}
              suffix={`/ 5.0`}
              styles={{ content: { color: "#f59e0b" } }}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {profile.totalReviews} reviews
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title={<span className="dark:text-white">Profile Summary</span>} extra={
            <a onClick={() => router.push("/tutor/profile")} className="text-brand-green hover:text-brand-green-hover font-semibold cursor-pointer">
              Edit
            </a>
          } className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col gap-4">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-2">Subjects</div>
                <div className="flex gap-2 flex-wrap">
                  {profile.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-brand-green dark:text-brand-green font-medium rounded-md text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">Hourly Rate</div>
                <div className="text-lg font-bold text-brand-green">
                  ${profile.hourlyRate}/hour
                </div>
              </div>

              {profile.experience && (
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">Experience</div>
                  <div className="text-gray-600 dark:text-gray-300">{profile.experience}</div>
                </div>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title={<span className="dark:text-white">Quick Actions</span>} className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/tutor/availability")}
                className="w-full flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-brand-green hover:text-brand-green dark:hover:text-brand-green transition-colors cursor-pointer text-sm font-medium"
              >
                <ClockCircleOutlined />
                <span>Manage Availability</span>
              </button>

              <button
                onClick={() => router.push("/tutor/sessions")}
                className="w-full flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-brand-green hover:text-brand-green dark:hover:text-brand-green transition-colors cursor-pointer text-sm font-medium"
              >
                <CalendarOutlined />
                <span>View All Sessions</span>
              </button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
