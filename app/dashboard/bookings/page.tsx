"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Tabs,
  Empty,
  Spin,
  Popconfirm,
  message,
  Modal,
  Form,
  Rate,
  Input,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  DeleteOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { bookingService, BookingSession } from "../../../services/booking.service";
import { reviewService } from "../../../services/review.service"; 
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { TabPane } = Tabs;
const { TextArea } = Input;

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingSession | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false); // 👈 New state
  const [form] = Form.useForm();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await bookingService.getMyBookings();
      if (error) {
        message.error(error);
      } else if (data) {
        setBookings(data);
      }
    } catch (error) {
      message.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setCancelling(bookingId);
    try {
      const { error } = await bookingService.cancelBooking(bookingId);
      if (error) {
        message.error(error);
      } else {
        message.success("Booking cancelled successfully");
        loadBookings();
      }
    } catch (error) {
      message.error("Failed to cancel booking");
    } finally {
      setCancelling(null);
    }
  };

  const openReviewModal = (booking: BookingSession) => {
    setSelectedBooking(booking);
    setReviewModalVisible(true);
  };

  // 👇 FIXED: Actual API call implementation
  const handleSubmitReview = async (values: { rating: number; comment: string }) => {
    if (!selectedBooking) {
      message.error("No booking selected");
      return;
    }

    setSubmittingReview(true);
    try {
      const { data, error } = await reviewService.createReview({
        bookingId: selectedBooking.id,
        rating: values.rating,
        comment: values.comment,
      });

      if (error) {
        message.error(error);
      } else {
        message.success("Review submitted successfully!");
        setReviewModalVisible(false);
        form.resetFields();
        loadBookings(); // 👈 Reload to show updated review status
      }
    } catch (error) {
      message.error("Failed to submit review");
      console.error("Review submission error:", error);
    } finally {
      setSubmittingReview(false);
    }
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

  const columns: ColumnsType<BookingSession> = [
    {
      title: "Tutor",
      key: "tutor",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-gray-400" />
          <span className="font-medium">{record.tutor.user.name}</span>
        </div>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => <Tag color="blue">{subject}</Tag>,
    },
    {
      title: "Date & Time",
      key: "datetime",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <CalendarOutlined className="text-gray-400" />
            <span>{dayjs(record.date).format("MMM DD, YYYY")}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
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
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="space-x-2">
          {record.status === "CONFIRMED" && (
            <Popconfirm
              title="Cancel Booking"
              description="Are you sure you want to cancel this booking?"
              onConfirm={() => handleCancelBooking(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                loading={cancelling === record.id}
              >
                Cancel
              </Button>
            </Popconfirm>
          )}
          {record.status === "COMPLETED" && !record.review && (
            <Button
              type="primary"
              size="small"
              icon={<StarOutlined />}
              onClick={() => openReviewModal(record)}
              className="bg-indigo-600"
            >
              Review
            </Button>
          )}
          {record.review && (
            <Tag color="gold">⭐ Reviewed ({record.review.rating}/5)</Tag>
          )}
        </div>
      ),
    },
  ];

  const upcomingBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" && dayjs(b.date).isAfter(dayjs())
  );
  const pastBookings = bookings.filter(
    (b) => b.status === "COMPLETED" || dayjs(b.date).isBefore(dayjs())
  );
  const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED");

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
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600">Manage your tutoring sessions</p>
      </div>

      <Card className="shadow-lg">
        <Tabs defaultActiveKey="all">
          <TabPane tab={`All (${bookings.length})`} key="all">
            {bookings.length === 0 ? (
              <Empty description="No bookings yet" />
            ) : (
              <Table
                columns={columns}
                dataSource={bookings}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            )}
          </TabPane>
          <TabPane tab={`Upcoming (${upcomingBookings.length})`} key="upcoming">
            {upcomingBookings.length === 0 ? (
              <Empty description="No upcoming bookings" />
            ) : (
              <Table
                columns={columns}
                dataSource={upcomingBookings}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            )}
          </TabPane>
          <TabPane tab={`Past (${pastBookings.length})`} key="past">
            {pastBookings.length === 0 ? (
              <Empty description="No past bookings" />
            ) : (
              <Table
                columns={columns}
                dataSource={pastBookings}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            )}
          </TabPane>
          <TabPane tab={`Cancelled (${cancelledBookings.length})`} key="cancelled">
            {cancelledBookings.length === 0 ? (
              <Empty description="No cancelled bookings" />
            ) : (
              <Table
                columns={columns}
                dataSource={cancelledBookings}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            )}
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <StarOutlined className="text-yellow-500" />
            <span>Leave a Review</span>
          </div>
        }
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitReview} className="mt-4">
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: "Please provide a rating" }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Comment"
            rules={[
              { required: true, message: "Please write a review" },
              { min: 10, message: "Review must be at least 10 characters" },
            ]}
          >
            <TextArea rows={4} placeholder="Share your experience..." />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setReviewModalVisible(false);
                  form.resetFields();
                }}
                disabled={submittingReview}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="bg-indigo-600"
                loading={submittingReview} // 👈 Show loading state
              >
                Submit Review
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}