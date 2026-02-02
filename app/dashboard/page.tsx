"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Tag, Empty, Spin, Button, Statistic } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { bookingService, BookingSession } from "../../src/services/booking.service";
import dayjs from "dayjs";

export default function StudentDashboardPage() {
  const [bookings, setBookings] = useState<BookingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data } = await bookingService.getMyBookings();
      if (data) {
        setBookings(data);
      }
    } catch (error) {
      console.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" && dayjs(b.date).isAfter(dayjs())
  );

  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
  const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED");

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your learning journey
        </p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <Statistic
              title={<span className="text-blue-900">Total Sessions</span>}
              value={bookings.length}
              prefix={<BookOutlined className="text-blue-600" />}
              valueStyle={{ color: "#1e40af", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <Statistic
              title={<span className="text-indigo-900">Upcoming</span>}
              value={upcomingBookings.length}
              prefix={<CalendarOutlined className="text-indigo-600" />}
              valueStyle={{ color: "#4338ca", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <Statistic
              title={<span className="text-green-900">Completed</span>}
              value={completedBookings.length}
              prefix={<CheckCircleOutlined className="text-green-600" />}
              valueStyle={{ color: "#16a34a", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <Statistic
              title={<span className="text-red-900">Cancelled</span>}
              value={cancelledBookings.length}
              prefix={<CloseCircleOutlined className="text-red-600" />}
              valueStyle={{ color: "#dc2626", fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">Upcoming Sessions</span>
            <Button
              type="link"
              onClick={() => router.push("/dashboard/bookings")}
              icon={<ArrowRightOutlined />}
            >
              View All
            </Button>
          </div>
        }
        className="shadow-lg"
      >
        {upcomingBookings.length === 0 ? (
          <Empty
            description="No upcoming sessions"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              className="bg-indigo-600"
              onClick={() => router.push("/tutors")}
            >
              Find a Tutor
            </Button>
          </Empty>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.slice(0, 5).map((booking) => (
              <Card key={booking.id} className="bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <BookOutlined className="text-indigo-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {booking.subject} with {booking.tutor.user.name}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <CalendarOutlined />
                          {dayjs(booking.date).format("MMM DD, YYYY")}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockCircleOutlined />
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Tag color={getStatusColor(booking.status)}>{booking.status}</Tag>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Card title="Quick Actions" className="shadow-lg">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              size="large"
              block
              className="bg-indigo-600 h-auto py-4"
              onClick={() => router.push("/tutors")}
            >
              <div className="flex flex-col items-center gap-2">
                <BookOutlined className="text-2xl" />
                <span>Find a Tutor</span>
              </div>
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              size="large"
              block
              className="h-auto py-4"
              onClick={() => router.push("/dashboard/bookings")}
            >
              <div className="flex flex-col items-center gap-2">
                <CalendarOutlined className="text-2xl" />
                <span>View All Bookings</span>
              </div>
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              size="large"
              block
              className="h-auto py-4"
              onClick={() => router.push("/dashboard/profile")}
            >
              <div className="flex flex-col items-center gap-2">
                <CheckCircleOutlined className="text-2xl" />
                <span>Edit Profile</span>
              </div>
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
}