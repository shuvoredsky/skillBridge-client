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
import { adminService } from "../../../services/admin.service";

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

export default function AdminDashboardPage() {  
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Spin fullscreen size="large" />
          <p className="mt-4 text-gray-500">Loading dashboard data...</p>
        </div>
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
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-lg">Welcome to SkillBridge Admin Panel</p>
      </div>

      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow border-0 rounded-xl">
            <Statistic
              title={<span className="text-gray-400 font-semibold uppercase text-xs tracking-wider">Total Users</span>}
              value={stats?.users.total || 0}
              prefix={<UserOutlined className="text-green-600 bg-green-50 p-2 rounded-lg" />}
              valueStyle={{ color: "#111827", fontWeight: "800", fontSize: "24px" }}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium">{stats?.users.students} Students</span>
              <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-md font-medium">{stats?.users.tutors} Tutors</span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow border-0 rounded-xl">
            <Statistic
              title={<span className="text-gray-400 font-semibold uppercase text-xs tracking-wider">Total Bookings</span>}
              value={stats?.bookings.total || 0}
              prefix={<BookOutlined className="text-blue-600 bg-blue-50 p-2 rounded-lg" />}
              valueStyle={{ color: "#111827", fontWeight: "800", fontSize: "24px" }}
            />
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500 italic">
              All recorded sessions
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow border-0 rounded-xl">
            <Statistic
              title={<span className="text-gray-400 font-semibold uppercase text-xs tracking-wider">Total Reviews</span>}
              value={stats?.reviews.total || 0}
              prefix={<StarOutlined className="text-yellow-500 bg-yellow-50 p-2 rounded-lg" />}
              valueStyle={{ color: "#111827", fontWeight: "800", fontSize: "24px" }}
            />
            <div className="mt-4 text-xs text-gray-400">Feedback from students</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow border-0 rounded-xl">
            <Statistic
              title={<span className="text-gray-400 font-semibold uppercase text-xs tracking-wider">Active Categories</span>}
              value={stats?.categories.total || 0}
              prefix={<CheckCircleOutlined className="text-purple-600 bg-purple-50 p-2 rounded-lg" />}
              valueStyle={{ color: "#111827", fontWeight: "800", fontSize: "24px" }}
            />
            <div className="mt-4 text-xs text-gray-400">Available subjects</div>
          </Card>
        </Col>
      </Row>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          Booking Status
        </h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 h-full">
              <Statistic
                title="Confirmed"
                value={stats?.bookings.confirmed || 0}
                prefix={<ClockCircleOutlined className="text-blue-500" />}
                valueStyle={{ color: "#1e40af", fontWeight: "700" }}
              />
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="p-4 rounded-xl bg-green-50 border border-green-100 h-full">
              <Statistic
                title="Completed"
                value={stats?.bookings.completed || 0}
                prefix={<CheckCircleOutlined className="text-green-500" />}
                valueStyle={{ color: "#166534", fontWeight: "700" }}
              />
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 h-full">
              <Statistic
                title="Cancelled"
                value={stats?.bookings.cancelled || 0}
                prefix={<CloseCircleOutlined className="text-red-500" />}
                valueStyle={{ color: "#991b1b", fontWeight: "700" }}
              />
            </div>
          </Col>
        </Row>
      </div>

      {stats?.recentBookings && stats.recentBookings.length > 0 && (
        <Card 
          title={<span className="text-gray-800 font-bold">Recent Bookings</span>} 
          className="shadow-sm border-0 rounded-2xl overflow-hidden"
          bodyStyle={{ padding: 0 }}
        >
          <Table
            dataSource={stats.recentBookings}
            columns={recentBookingsColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
          />
        </Card>
      )}
    </div>
  );
}