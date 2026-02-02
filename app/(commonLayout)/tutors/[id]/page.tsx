"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Avatar,
  Rate,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Divider,
  Empty,
  Spin,
  Space,
  message,
} from "antd";
import {
  UserOutlined,
  DollarOutlined,
  BookOutlined,
  ClockCircleOutlined,
  StarOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import { tutorService, TutorProfile } from "../../../../src/services/tutor.service";
import { bookingService } from "../../../../src/services/booking.service";
import { useAuth } from "@/context/AuthContext";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

export default function TutorDetailsPage() {
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (params.id) {
      loadTutorDetails();
    }
  }, [params.id]);

  const loadTutorDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await tutorService.getTutorById(params.id as string);

      if (error) {
        message.error(error);
        router.push("/tutors");
      } else if (data) {
        setTutor(data);
      }
    } catch (error) {
      message.error("Failed to load tutor details");
      router.push("/tutors");
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = () => {
    if (!user) {
      message.warning("Please login to book a session");
      router.push("/login");
      return;
    }

    if (user.role !== "STUDENT") {
      message.warning("Only students can book sessions");
      return;
    }

    setBookingModalVisible(true);
  };

  const handleBookingSubmit = async (values: any) => {
    if (!tutor) return;

    setSubmitting(true);
    try {
      const bookingData = {
        tutorId: tutor.id,
        date: values.date.format("YYYY-MM-DD"),
        startTime: values.startTime.format("HH:mm"),
        endTime: values.endTime.format("HH:mm"),
        subject: values.subject,
        notes: values.notes || "",
      };

      console.log("Booking data:", bookingData);

      const { data, error } = await bookingService.createBooking(bookingData);

      if (error) {
        message.error(error);
      } else {
        message.success("Session booked successfully!");
        setBookingModalVisible(false);
        form.resetFields();
        router.push("/dashboard/bookings");
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      message.error(error.message || "Failed to book session");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin fullscreen size="large" />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Empty description="Tutor not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()} className="mb-6">
          Back to Tutors
        </Button>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card className="shadow-lg sticky top-4">
              <div className="text-center mb-6">
                <Avatar
                  size={120}
                  src={tutor.user.image}
                  icon={<UserOutlined />}
                  className="bg-gradient-to-br from-indigo-500 to-purple-600 mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{tutor.user.name}</h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Rate disabled value={tutor.rating} allowHalf />
                  <span className="text-gray-600">({tutor.totalReviews} reviews)</span>
                </div>
              </div>

              <Divider />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <DollarOutlined className="text-green-600" />
                    Hourly Rate
                  </span>
                  <span className="text-2xl font-bold text-green-600">${tutor.hourlyRate}</span>
                </div>

                {tutor.experience && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <ClockCircleOutlined className="text-indigo-600" />
                    <span>{tutor.experience}</span>
                  </div>
                )}

                {tutor.education && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOutlined className="text-indigo-600" />
                    <span>{tutor.education}</span>
                  </div>
                )}
              </div>

              <Divider />

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject: any) => (
                    <Tag key={subject} color="blue" className="text-sm">
                      {subject}
                    </Tag>
                  ))}
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                block
                className="mt-6 bg-indigo-600 hover:bg-indigo-700 h-12"
                icon={<CalendarOutlined />}
                onClick={handleBookSession}
              >
                Book a Session
              </Button>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card className="shadow-lg mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About Me</h3>
              <p className="text-gray-700 leading-relaxed">{tutor.bio || "No bio available"}</p>
            </Card>

            <Card className="shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Student Reviews</h3>
                <div className="flex items-center gap-2">
                  <StarOutlined className="text-yellow-500 text-xl" />
                  <span className="text-2xl font-bold">{tutor.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({tutor.totalReviews} reviews)</span>
                </div>
              </div>

              {tutor.reviews && tutor.reviews.length > 0 ? (
                <div className="space-y-4">
                  {tutor.reviews.map((review: any) => (
                    <Card key={review.id} className="bg-gray-50">
                      <div className="flex items-start gap-4">
                        <Avatar
                          src={review.student.image}
                          icon={<UserOutlined />}
                          size={48}
                          className="bg-indigo-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.student.name}</h4>
                              <Rate disabled value={review.rating} />
                            </div>
                            <span className="text-sm text-gray-500">
                              {dayjs(review.createdAt).format("MMM DD, YYYY")}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Empty description="No reviews yet" />
              )}
            </Card>
          </Col>
        </Row>
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-indigo-600" />
            <span>Book a Session with {tutor.user.name}</span>
          </div>
        }
        open={bookingModalVisible}
        onCancel={() => {
          setBookingModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleBookingSubmit} className="mt-6">
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: "Please select a subject" }]}
          >
            <Select placeholder="Select subject" size="large">
              {tutor.subjects.map((subject: any) => (
                <Option key={subject} value={subject}>
                  {subject}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Session Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker
              size="large"
              className="w-full"
              disabledDate={(current) => current && current < dayjs().startOf("day")}
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label="Start Time"
                rules={[{ required: true, message: "Please select start time" }]}
              >
                <TimePicker size="large" className="w-full" format="HH:mm" minuteStep={30} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label="End Time"
                rules={[{ required: true, message: "Please select end time" }]}
              >
                <TimePicker size="large" className="w-full" format="HH:mm" minuteStep={30} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label="Additional Notes (Optional)">
            <TextArea
              rows={4}
              placeholder="Any specific topics or questions you'd like to cover?"
              size="large"
            />
          </Form.Item>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Hourly Rate:</span>
              <span className="text-2xl font-bold text-green-600">${tutor.hourlyRate}/hr</span>
            </div>
          </div>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button
                onClick={() => {
                  setBookingModalVisible(false);
                  form.resetFields();
                }}
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                size="large"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Confirm Booking
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}