"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Tag, Empty, Spin, Button } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { bookingService, BookingSession } from "../../services/booking.service";
import StatCard from "@/components/shared/StatCard";
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
        <Spin fullscreen size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back!</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here's what's happening with your learning journey
        </p>
      </div>

      {/* Task 3: Unified Reusable StatCards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Sessions"
            value={bookings.length}
            icon={<BookOutlined />}
            color="blue"
            description="All scheduled lessons"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Upcoming"
            value={upcomingBookings.length}
            icon={<CalendarOutlined />}
            color="emerald"
            description="Confirmed upcoming sessions"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Completed"
            value={completedBookings.length}
            icon={<CheckCircleOutlined />}
            color="emerald"
            description="Successfully completed"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Cancelled"
            value={cancelledBookings.length}
            icon={<CloseCircleOutlined />}
            color="red"
            description="Cancelled or missed"
          />
        </Col>
      </Row>

      <Card
        title={
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold dark:text-white">Upcoming Sessions</span>
            <Button
              type="link"
              onClick={() => router.push("/dashboard/bookings")}
              icon={<ArrowRightOutlined />}
            >
              View All
            </Button>
          </div>
        }
        className="shadow-lg dark:bg-slate-900 dark:border-slate-800 rounded-2xl"
      >
        {upcomingBookings.length === 0 ? (
          <Empty
            description={<span className="dark:text-gray-400">No upcoming sessions</span>}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              className="bg-brand-green hover:bg-brand-green-hover border-0 rounded-xl"
              onClick={() => router.push("/tutors")}
            >
              Find a Tutor
            </Button>
          </Empty>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.slice(0, 5).map((booking) => (
              <Card
                key={booking.id}
                className="bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border-0 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg flex items-center justify-center">
                      <BookOutlined className="text-brand-green text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {booking.subject} with {booking.tutor.user.name}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          <CalendarOutlined />
                          {dayjs(booking.date).format("MMM DD, YYYY")}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
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

      <Card
        title={<span className="dark:text-white">Quick Actions</span>}
        className="shadow-lg dark:bg-slate-900 dark:border-slate-800 rounded-2xl"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              size="large"
              block
              className="bg-brand-green hover:bg-brand-green-hover border-0 h-auto py-4 text-white rounded-xl"
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
              className="h-auto py-4 dark:bg-slate-800 dark:text-white dark:border-slate-700 hover:border-brand-green rounded-xl"
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
              className="h-auto py-4 dark:bg-slate-800 dark:text-white dark:border-slate-700 hover:border-brand-green rounded-xl"
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