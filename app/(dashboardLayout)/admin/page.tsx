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
import { useTheme } from "@/context/ThemeContext";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const recentBookingsColumns = [
    {
      title: "Student",
      dataIndex: ["student", "name"],
      key: "student",
      render: (text: string) => <span className="dark:text-gray-200">{text}</span>
    },
    {
      title: "Tutor",
      dataIndex: ["tutor", "user", "name"],
      key: "tutor",
      render: (text: string) => <span className="dark:text-gray-200">{text}</span>
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (text: string) => <span className="dark:text-gray-200">{text}</span>
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
      render: (date: string) => <span className="dark:text-gray-300">{new Date(date).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 dark:text-white transition-colors duration-200 min-h-screen space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Welcome to SkillBridge Admin Panel</p>
      </div>

      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow border-0 rounded-xl dark:bg-slate-900 dark:border-slate-800">
            <Statistic
              title={<span className="text-gray-400 dark:text-gray-400 font-semibold uppercase text-xs tracking-wider">Total Users</span>}
              value={stats?.users.total || 0}
              prefix={<UserOutlined className="text-brand-green bg-green-50 dark:bg-emerald-950/40 p-2 rounded-lg" />}
              styles={{ content: { fontWeight: "800", fontSize: "24px", color: isDark ? "#ffffff" : "#111827" } }}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs rounded-md font-medium">{stats?.users.students} Students</span>
              <span className="px-2 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-xs rounded-md font-medium">{stats?.users.tutors} Tutors</span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow border-0 rounded-xl dark:bg-slate-900 dark:border-slate-800">
            <Statistic
              title={<span className="text-gray-400 dark:text-gray-400 font-semibold uppercase text-xs tracking-wider">Total Bookings</span>}
              value={stats?.bookings.total || 0}
              prefix={<BookOutlined className="text-blue-600 bg-blue-50 dark:bg-blue-950/40 p-2 rounded-lg" />}
              styles={{ content: { fontWeight: "800", fontSize: "24px", color: isDark ? "#ffffff" : "#111827" } }}
            />
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 italic">
              All recorded sessions
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow border-0 rounded-xl dark:bg-slate-900 dark:border-slate-800">
            <Statistic
              title={<span className="text-gray-400 dark:text-gray-400 font-semibold uppercase text-xs tracking-wider">Total Reviews</span>}
              value={stats?.reviews.total || 0}
              prefix={<StarOutlined className="text-yellow-500 bg-yellow-50 dark:bg-yellow-950/40 p-2 rounded-lg" />}
              styles={{ content: { fontWeight: "800", fontSize: "24px", color: isDark ? "#ffffff" : "#111827" } }}
            />
            <div className="mt-4 text-xs text-gray-400 dark:text-gray-400">Feedback from students</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow border-0 rounded-xl dark:bg-slate-900 dark:border-slate-800">
            <Statistic
              title={<span className="text-gray-400 dark:text-gray-400 font-semibold uppercase text-xs tracking-wider">Active Categories</span>}
              value={stats?.categories.total || 0}
              prefix={<CheckCircleOutlined className="text-purple-600 bg-purple-50 dark:bg-purple-950/40 p-2 rounded-lg" />}
              styles={{ content: { fontWeight: "800", fontSize: "24px", color: isDark ? "#ffffff" : "#111827" } }}
            />
            <div className="mt-4 text-xs text-gray-400 dark:text-gray-400">Available subjects</div>
          </Card>
        </Col>
      </Row>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <div className="w-1 h-6 bg-brand-green rounded-full"></div>
          Booking Status
        </h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 h-full">
              <Statistic
                title={<span className="dark:text-gray-300">Confirmed</span>}
                value={stats?.bookings.confirmed || 0}
                prefix={<ClockCircleOutlined className="text-blue-500" />}
                styles={{ content: { color: isDark ? "#60a5fa" : "#1e40af", fontWeight: "700" } }}
              />
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 h-full">
              <Statistic
                title={<span className="dark:text-gray-300">Completed</span>}
                value={stats?.bookings.completed || 0}
                prefix={<CheckCircleOutlined className="text-brand-green" />}
                styles={{ content: { color: isDark ? "#34d399" : "#166534", fontWeight: "700" } }}
              />
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 h-full">
              <Statistic
                title={<span className="dark:text-gray-300">Cancelled</span>}
                value={stats?.bookings.cancelled || 0}
                prefix={<CloseCircleOutlined className="text-brand-red" />}
                styles={{ content: { color: isDark ? "#f87171" : "#991b1b", fontWeight: "700" } }}
              />
            </div>
          </Col>
        </Row>
      </div>

      {stats?.recentBookings && stats.recentBookings.length > 0 && (
        <Card 
          title={<span className="text-gray-800 dark:text-white font-bold">Recent Bookings</span>} 
          className="shadow-sm border-0 rounded-2xl overflow-hidden dark:bg-slate-900 dark:border-slate-800"
          styles={{ body: { padding: 0 } }}
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