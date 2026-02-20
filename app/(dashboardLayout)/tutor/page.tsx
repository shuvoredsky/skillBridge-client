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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <Spin fullscreen size="large" tip="Loading your dashboard..." />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <Empty
          description="You haven't created your tutor profile yet"
          style={{ padding: "40px 0" }}
        >
          <button
            onClick={() => router.push("/tutor/profile")}
            style={{
              padding: "10px 24px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 16,
            }}
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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Welcome Back!</h1>
        <p style={{ color: "#666", marginTop: 8 }}>
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
          <Card>
            <Statistic
              title="Total Sessions"
              value={sessions.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Upcoming"
              value={confirmedSessions.length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed"
              value={completedSessions.length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Rating"
              value={profile.rating.toFixed(1)}
              prefix={<StarOutlined />}
              suffix={`/ 5.0`}
              valueStyle={{ color: "#faad14" }}
            />
            <div style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
              {profile.totalReviews} reviews
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Profile Summary" extra={
            <a onClick={() => router.push("/tutor/profile")} style={{ cursor: "pointer" }}>
              Edit
            </a>
          }>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Subjects</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {profile.subjects.map((subject) => (
                    <span
                      key={subject}
                      style={{
                        padding: "4px 12px",
                        background: "#e6f7ff",
                        color: "#1890ff",
                        borderRadius: 4,
                        fontSize: 14,
                      }}
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Hourly Rate</div>
                <div style={{ fontSize: 18, color: "#16a34a", fontWeight: 600 }}>
                  ${profile.hourlyRate}/hour
                </div>
              </div>

              {profile.experience && (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Experience</div>
                  <div style={{ color: "#666" }}>{profile.experience}</div>
                </div>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Quick Actions">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={() => router.push("/tutor/availability")}
                style={{
                  padding: "12px 16px",
                  background: "#fff",
                  border: "1px solid #d9d9d9",
                  borderRadius: 6,
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 14,
                }}
              >
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                Manage Availability
              </button>

              <button
                onClick={() => router.push("/tutor/sessions")}
                style={{
                  padding: "12px 16px",
                  background: "#fff",
                  border: "1px solid #d9d9d9",
                  borderRadius: 6,
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 14,
                }}
              >
                <CalendarOutlined style={{ marginRight: 8 }} />
                View All Sessions
              </button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
