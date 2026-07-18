"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Select,
  Button,
  Tag,
  Card,
  message,
  Space,
  DatePicker,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { adminService, Booking } from "../../../../services/admin.service";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { Option } = Select;

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async (filters?: { status?: string }) => {
    setLoading(true);
    try {
      const { data, error } = await adminService.getAllBookings(filters);
      if (error) {
        message.error(error);
      } else if (data) {
        setBookings(data);
      }
    } catch (error) {
      message.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (value: string | undefined) => {
    setStatusFilter(value);
    fetchBookings({ status: value });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "blue";
      case "COMPLETED":
        return "green";
      case "CANCELLED":
        return "red";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<Booking> = [
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <span className="font-mono text-xs">{id.slice(0, 8)}...</span>,
    },
    {
      title: "Student",
      dataIndex: "student",
      key: "student",
      render: (student) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-gray-400" />
          <div>
            <div className="font-medium">{student.name}</div>
            <div className="text-xs text-gray-500">{student.email}</div>
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
          <UserOutlined className="text-gray-400" />
          <div>
            <div className="font-medium">{tutor.user.name}</div>
            <div className="text-xs text-gray-500">{tutor.user.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => (
        <div className="flex items-center gap-2">
          <BookOutlined className="text-brand-green" />
          <span className="font-medium dark:text-gray-200">{subject}</span>
        </div>
      ),
    },
    {
      title: "Date & Time",
      key: "datetime",
      render: (_, record) => (
        <div>
          <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-200">
            <CalendarOutlined className="text-gray-400" />
            <span>{dayjs(record.date).format("MMM DD, YYYY")}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
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
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Review",
      dataIndex: "review",
      key: "review",
      render: (review) =>
        review ? (
          <Tag color="gold">⭐ {review.rating}/5</Tag>
        ) : (
          <Tag color="default">No review</Tag>
        ),
    },
    {
      title: "Booked On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("MMM DD, YYYY"),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings Management</h1>
        <p className="text-gray-500 dark:text-gray-400">View and manage all bookings on the platform</p>
      </div>

      {/* Filters */}
      <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <Select
            placeholder="Filter by Status"
            allowClear
            size="large"
            style={{ minWidth: 200 }}
            onChange={handleStatusFilter}
            value={statusFilter}
          >
            <Option value="CONFIRMED">Confirmed</Option>
            <Option value="COMPLETED">Completed</Option>
            <Option value="CANCELLED">Cancelled</Option>
          </Select>

          <Button
            type="default"
            size="large"
            onClick={() => {
              setStatusFilter(undefined);
              fetchBookings();
            }}
          >
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {bookings.filter((b) => b.status === "CONFIRMED").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300 mt-1">Confirmed</div>
          </div>
        </Card>
        <Card className="bg-green-50 border-green-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-green">
              {bookings.filter((b) => b.status === "COMPLETED").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300 mt-1">Completed</div>
          </div>
        </Card>
        <Card className="bg-red-50 border-red-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-red">
              {bookings.filter((b) => b.status === "CANCELLED").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300 mt-1">Cancelled</div>
          </div>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-green">
              {bookings.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300 mt-1">Total Bookings</div>
          </div>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} bookings`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
}