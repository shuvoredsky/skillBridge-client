"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Spin } from "antd";
import {
  UserOutlined,
  BookOutlined,
  StarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { adminService } from "../../../src/services/admin.service";

interface DashboardStats {
  users: {
    total: number;
    students: number;
    tutors: number;
  };
  bookings: {
    total: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  reviews: {
    total: number;
  };
  categories: {
    total: number;
  };
  recentBookings?: any[];
}

export default function AdminDashboardPage() {  // ✅ এইটা আছে কিনা চেক করো
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await adminService.getDashboardStats();
      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  const recentBookingsColumns = [
    {
      title: "Student",
      dataIndex: ["student", "name"],
      key: "student",
    },
    {
      title: "Tutor",
      dataIndex: ["tutor", "user", "name"],
      key: "tutor",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors = {
          CONFIRMED: "blue",
          COMPLETED: "green",
          CANCELLED: "red",
        };
        return <Tag color={colors[status as keyof typeof colors]}>{status}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome to SkillBridge Admin Panel</p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats?.users.total || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
            <div className="mt-2 text-sm text-gray-500">
              {stats?.users.students} Students • {stats?.users.tutors} Tutors
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Bookings"
              value={stats?.bookings.total || 0}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
            <div className="mt-2 text-sm text-gray-500">
              {stats?.bookings.confirmed} Confirmed •{" "}
              {stats?.bookings.completed} Completed
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Reviews"
              value={stats?.reviews.total || 0}
              prefix={<StarOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Categories"
              value={stats?.categories.total || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Booking Status */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Confirmed Bookings"
              value={stats?.bookings.confirmed || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Completed Bookings"
              value={stats?.bookings.completed || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Cancelled Bookings"
              value={stats?.bookings.cancelled || 0}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Bookings Table */}
      {stats?.recentBookings && stats.recentBookings.length > 0 && (
        <Card title="Recent Bookings">
          <Table
            dataSource={stats.recentBookings}
            columns={recentBookingsColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      )}
    </div>
  );
}