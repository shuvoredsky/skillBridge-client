"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Select,
  Button,
  Tag,
  Card,
  message,
  Row,
  Col,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { adminService, Booking, DashboardStats } from "../../../../services/admin.service";
import type { ColumnsType } from "antd/es/table";
import StatCard from "@/components/shared/StatCard";
import EmptyState from "@/components/shared/EmptyState";
import dayjs from "dayjs";

const { Option } = Select;

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalBookings, setTotalBookings] = useState(0);

  useEffect(() => {
    fetchBookings(1);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await adminService.getDashboardStats();
      if (data && !error) {
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch statistics", err);
    }
  };

  const fetchBookings = async (
    currentPage = page,
    filters?: { status?: string }
  ) => {
    setLoading(true);
    try {
      const activeFilters = {
        status: filters?.status !== undefined ? filters.status : statusFilter,
        page: currentPage,
        limit: pageSize,
      };

      const { data, error } = await adminService.getAllBookings(activeFilters);
      if (error) {
        message.error(error);
      } else if (data) {
        setBookings(data.data);
        setTotalBookings(data.meta.total);
      }
    } catch (error) {
      message.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (value: string | undefined) => {
    setStatusFilter(value);
    setPage(1);
    fetchBookings(1, { status: value });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "green";
      case "COMPLETED":
        return "blue";
      case "CANCELLED":
        return "red";
      case "PENDING":
        return "gold";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<Booking> = [
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <span className="font-mono text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded">
          {id.slice(0, 8)}...
        </span>
      ),
    },
    {
      title: "Student",
      dataIndex: "student",
      key: "student",
      render: (student) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-brand-green">
            <UserOutlined />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white text-sm">
              {student.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{student.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Tutor",
      dataIndex: "tutor",
      key: "tutor",
      render: (tutor) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600">
            <UserOutlined />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white text-sm">
              {tutor.user.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{tutor.user.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => (
        <div className="flex items-center gap-1.5">
          <BookOutlined className="text-brand-green" />
          <span className="font-medium text-gray-800 dark:text-gray-200">{subject}</span>
        </div>
      ),
    },
    {
      title: "Date & Time",
      key: "datetime",
      render: (_, record) => (
        <div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800 dark:text-gray-200">
            <CalendarOutlined className="text-gray-400" />
            <span>{dayjs(record.date).format("MMM DD, YYYY")}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            <ClockCircleOutlined />
            <span>
              {record.startTime} - {record.endTime}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="font-semibold text-xs px-2.5 py-0.5 rounded-full">
          {status}
        </Tag>
      ),
    },
    {
      title: "Review",
      dataIndex: "review",
      key: "review",
      render: (review) =>
        review ? (
          <Tag color="gold" className="font-medium">⭐ {review.rating}/5</Tag>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-500 italic">No review</span>
        ),
    },
    {
      title: "Booked On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {dayjs(date).format("MMM DD, YYYY")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings Management</h1>
        <p className="text-gray-500 dark:text-gray-400">View and manage all bookings across the platform</p>
      </div>

      {/* Unified StatCards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Bookings"
            value={stats?.bookings.total ?? totalBookings}
            icon={<BookOutlined />}
            color="emerald"
            description="All recorded sessions"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Confirmed"
            value={stats?.bookings.confirmed ?? 0}
            icon={<CheckCircleOutlined />}
            color="emerald"
            description="Upcoming scheduled"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Completed"
            value={stats?.bookings.completed ?? 0}
            icon={<CalendarOutlined />}
            color="blue"
            description="Finished sessions"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Cancelled"
            value={stats?.bookings.cancelled ?? 0}
            icon={<CloseCircleOutlined />}
            color="red"
            description="Cancelled or missed"
          />
        </Col>
      </Row>

      {/* Filters */}
      <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FilterOutlined className="text-brand-green text-base" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter Bookings:</span>
            <Select
              placeholder="Filter by Status"
              allowClear
              size="large"
              style={{ minWidth: 200 }}
              onChange={handleStatusFilter}
              value={statusFilter}
              className="rounded-xl"
            >
              <Option value="CONFIRMED">Confirmed</Option>
              <Option value="COMPLETED">Completed</Option>
              <Option value="CANCELLED">Cancelled</Option>
            </Select>
          </div>

          <Button
            type="default"
            size="large"
            onClick={() => {
              setStatusFilter(undefined);
              setPage(1);
              fetchBookings(1, { status: undefined });
            }}
            className="rounded-xl font-medium hover:border-brand-green hover:text-brand-green transition-all duration-200 active:scale-[0.98]"
          >
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Bookings Table with EmptyState */}
      <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: totalBookings,
            onChange: (newPage) => {
              setPage(newPage);
              fetchBookings(newPage);
            },
            showTotal: (total) => `Total ${total} bookings`,
          }}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: (
              <EmptyState
                title="No Bookings Found"
                description={
                  statusFilter
                    ? `No bookings match the "${statusFilter}" status filter.`
                    : "There are no bookings recorded in the system yet."
                }
                className="border-0 bg-transparent py-8"
              />
            ),
          }}
        />
      </Card>
    </div>
  );
}