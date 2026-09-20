"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  Space,
  message,
  Alert,
} from "antd";
import {
  UserOutlined,
  DollarOutlined,
  BookOutlined,
  ClockCircleOutlined,
  StarOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
  HeartOutlined,
  HeartFilled,
  InfoCircleOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import { tutorService, TutorProfile, Availability } from "../../../../services/tutor.service";
import { bookingService } from "../../../../services/booking.service";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { getImageUrl } from "@/lib/getImageUrl";
import { recentlyViewedService } from "@/services/recently-viewed.service";
import TutorDetailsSkeleton from "@/components/shared/TutorDetailsSkeleton";
import dayjs, { Dayjs } from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

export default function TutorDetailsPage() {
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { isSaved, toggleWishlist } = useWishlist();

  // Live form watchers for booking price calculation
  const watchDate = Form.useWatch("date", form) as Dayjs | undefined;
  const watchStartTime = Form.useWatch("startTime", form) as Dayjs | undefined;
  const watchEndTime = Form.useWatch("endTime", form) as Dayjs | undefined;

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
        if (user && user.role === "STUDENT") {
          recentlyViewedService.recordView(data.id).catch((err) => {
            console.error("Failed to record tutor view:", err);
          });
        }

        // Fetch tutor's configured availability slots
        try {
          const availRes = await tutorService.getMyAvailability(data.id);
          if (availRes.data && Array.isArray(availRes.data)) {
            setAvailability(availRes.data);
          }
        } catch (availErr) {
          console.error("Failed to load availability slots:", availErr);
        }
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

    setSelectedSlotId(null);
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

      const { error } = await bookingService.createBooking(bookingData);

      if (error) {
        message.error(error);
      } else {
        message.success("Session booked successfully!");
        setBookingModalVisible(false);
        form.resetFields();
        setSelectedSlotId(null);
        router.push("/dashboard/bookings");
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      message.error(error.message || "Failed to book session");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to format ISO or HH:mm time strings to readable 12-hour format
  const formatSlotTime = (timeVal: string) => {
    if (!timeVal) return "";
    if (timeVal.includes("T")) {
      return dayjs(timeVal).format("h:mm A");
    }
    return dayjs(`2000-01-01 ${timeVal}`).format("h:mm A");
  };

  const getSlotRawTime = (timeVal: string) => {
    if (!timeVal) return "00:00";
    if (timeVal.includes("T")) {
      return dayjs(timeVal).format("HH:mm");
    }
    return timeVal.substring(0, 5);
  };

  // Slots matching the selected date's day of week
  const selectedDayOfWeek = watchDate ? watchDate.format("dddd").toUpperCase() : null;
  const dayMatchingSlots = selectedDayOfWeek
    ? availability.filter(
        (slot) => slot.dayOfWeek && slot.dayOfWeek.toUpperCase() === selectedDayOfWeek
      )
    : [];

  const handleSelectSlot = (slot: Availability) => {
    setSelectedSlotId(slot.id);
    const startStr = getSlotRawTime(slot.startTime);
    const endStr = getSlotRawTime(slot.endTime);

    form.setFieldsValue({
      startTime: dayjs(startStr, "HH:mm"),
      endTime: dayjs(endStr, "HH:mm"),
    });
  };

  // Live duration and price calculation
  let durationText = "";
  let calculationFormula = "";
  let totalCostFormatted = "0.00";
  let isInvalidDuration = false;
  let validationErrorMessage = "";

  if (watchStartTime && watchEndTime) {
    const startMinutes = watchStartTime.hour() * 60 + watchStartTime.minute();
    const endMinutes = watchEndTime.hour() * 60 + watchEndTime.minute();
    const diffMinutes = endMinutes - startMinutes;

    if (diffMinutes <= 0) {
      isInvalidDuration = true;
      validationErrorMessage = "End time must be after start time (minimum 30 minutes).";
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      const totalHours = diffMinutes / 60;

      const durationParts = [];
      if (hours > 0) durationParts.push(`${hours} Hour${hours > 1 ? "s" : ""}`);
      if (mins > 0) durationParts.push(`${mins} Minute${mins > 1 ? "s" : ""}`);
      durationText = durationParts.join(" ") || "0 Minutes";

      calculationFormula = `${totalHours.toFixed(1)} Hours × $${tutor?.hourlyRate || 0}/hr`;
      totalCostFormatted = ((tutor?.hourlyRate || 0) * totalHours).toFixed(2);
    }
  }

  const isFormBookingReady =
    Boolean(watchDate) &&
    Boolean(watchStartTime) &&
    Boolean(watchEndTime) &&
    !isInvalidDuration;

  if (loading) {
    return <TutorDetailsSkeleton />;
  }

  if (!tutor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Empty description="Tutor not found" />
      </div>
    );
  }

  const ratingAriaLabel = `${tutor.rating.toFixed(1)} out of 5 stars based on ${tutor.totalReviews} reviews`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Task 2: Robust Link Navigation for Back Button */}
        <Link href="/tutors" className="inline-block mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            className="dark:bg-slate-800 dark:text-white dark:border-slate-700 hover:border-brand-green"
          >
            Back to Tutors
          </Button>
        </Link>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card className="shadow-lg sticky top-4 dark:bg-slate-900 dark:border-slate-800 rounded-2xl">
              <div className="text-center mb-6">
                <Avatar
                  size={120}
                  src={getImageUrl(tutor.profilePhoto || tutor.user.image)}
                  icon={<UserOutlined />}
                  className="bg-gradient-to-br from-brand-green to-emerald-600 mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {tutor.user.name}
                </h2>
                <div
                  className="flex items-center justify-center gap-2 mb-4"
                  aria-label={ratingAriaLabel}
                >
                  <Rate
                    disabled
                    value={tutor.rating}
                    allowHalf
                    aria-label={ratingAriaLabel}
                  />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    ({tutor.totalReviews} reviews)
                  </span>
                </div>
              </div>

              <Divider />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2 font-medium">
                    <DollarOutlined className="text-brand-green text-lg" />
                    Hourly Rate
                  </span>
                  <span className="text-2xl font-extrabold text-brand-green">
                    ${tutor.hourlyRate}
                  </span>
                </div>

                {tutor.experience && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <ClockCircleOutlined className="text-brand-green" />
                    <span className="font-medium">{tutor.experience} Experience</span>
                  </div>
                )}

                {tutor.education && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <BookOutlined className="text-brand-green" />
                    <span className="font-medium">{tutor.education}</span>
                  </div>
                )}
              </div>

              <Divider />

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject: any) => (
                    <Tag
                      key={subject}
                      color="success"
                      className="text-sm font-medium px-2.5 py-0.5 rounded-full"
                    >
                      {subject}
                    </Tag>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="primary"
                  size="large"
                  className="flex-1 bg-brand-green hover:bg-brand-green-hover border-0 text-white h-12 rounded-xl font-semibold shadow-sm"
                  icon={<CalendarOutlined />}
                  onClick={handleBookSession}
                >
                  Book a Session
                </Button>
                <Button
                  size="large"
                  aria-label={isSaved(tutor.id) ? "Remove from wishlist" : "Add to wishlist"}
                  className="h-12 w-12 flex items-center justify-center rounded-xl border-gray-200 dark:border-slate-700 dark:bg-slate-800 text-lg transition-transform duration-200 hover:scale-105"
                  icon={
                    isSaved(tutor.id) ? (
                      <HeartFilled className="text-brand-red text-xl" />
                    ) : (
                      <HeartOutlined className="text-gray-400 dark:text-gray-300 hover:text-brand-red text-xl" />
                    )
                  }
                  onClick={() => {
                    if (!user) {
                      message.warning("Please login to save tutors");
                      router.push("/login");
                      return;
                    }
                    if (user.role !== "STUDENT") {
                      message.warning("Only students can save tutors to wishlist");
                      return;
                    }
                    toggleWishlist(tutor.id);
                  }}
                />
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card className="shadow-lg mb-6 dark:bg-slate-900 dark:border-slate-800 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About Me</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                {tutor.bio || "No bio available"}
              </p>
            </Card>

            <Card className="shadow-lg dark:bg-slate-900 dark:border-slate-800 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Student Reviews</h3>
                <div
                  className="flex items-center gap-2"
                  aria-label={ratingAriaLabel}
                >
                  <StarOutlined className="text-yellow-500 text-xl" />
                  <span className="text-2xl font-bold dark:text-white">
                    {tutor.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    ({tutor.totalReviews} reviews)
                  </span>
                </div>
              </div>

              {tutor.totalReviews > 0 && tutor.ratingBreakdown && (
                <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-2xl mb-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center border border-gray-100 dark:border-slate-700/50">
                  <div className="text-center md:border-r border-gray-200 dark:border-slate-700 md:pr-6">
                    <div className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
                      {tutor.rating.toFixed(1)}
                    </div>
                    <Rate
                      disabled
                      value={tutor.rating}
                      allowHalf
                      className="mb-2"
                      aria-label={ratingAriaLabel}
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Tutor Rating ({tutor.totalReviews} reviews)
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const item = tutor.ratingBreakdown?.[stars] || { count: 0, percentage: 0 };
                      return (
                        <div key={stars} className="flex items-center gap-3 text-sm">
                          <span className="w-12 text-gray-600 dark:text-gray-400 font-medium">
                            {stars} star
                          </span>
                          <div className="flex-1 bg-gray-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-brand-green h-full rounded-full transition-all duration-500"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="w-10 text-right text-gray-500 dark:text-gray-400 font-semibold">
                            {item.percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Task 2: Clean Divided List / Row Layout (No Nested Cards) */}
              {tutor.reviews && tutor.reviews.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                  {tutor.reviews.map((review: any) => (
                    <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <Avatar
                          src={review.student.image}
                          icon={<UserOutlined />}
                          size={46}
                          className="bg-brand-green shrink-0 shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                                {review.student.name}
                              </h4>
                              <Rate
                                disabled
                                value={review.rating}
                                className="text-xs text-yellow-500"
                                aria-label={`${review.rating} out of 5 stars`}
                              />
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                              {dayjs(review.createdAt).format("MMM DD, YYYY")}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mt-2">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty description="No reviews yet" />
              )}
            </Card>
          </Col>
        </Row>
      </div>

      {/* Task 1: Booking Modal with Dynamic Slot Selection & Live Price Calculator */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            <CalendarOutlined className="text-brand-green" />
            <span>Book a Session with {tutor.user.name}</span>
          </div>
        }
        open={bookingModalVisible}
        onCancel={() => {
          setBookingModalVisible(false);
          form.resetFields();
          setSelectedSlotId(null);
        }}
        footer={null}
        width={620}
        className="dark:bg-slate-900"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleBookingSubmit}
          className="mt-6 space-y-4"
        >
          <Form.Item
            name="subject"
            label={<span className="font-medium text-gray-700 dark:text-gray-300">Subject</span>}
            rules={[{ required: true, message: "Please select a subject" }]}
          >
            <Select placeholder="Select subject" size="large" className="rounded-xl">
              {tutor.subjects.map((subject: any) => (
                <Option key={subject} value={subject}>
                  {subject}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label={<span className="font-medium text-gray-700 dark:text-gray-300">Session Date</span>}
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker
              size="large"
              className="w-full rounded-xl"
              disabledDate={(current) => current && current < dayjs().startOf("day")}
              format="YYYY-MM-DD"
              onChange={() => {
                setSelectedSlotId(null);
                form.setFieldsValue({ startTime: undefined, endTime: undefined });
              }}
            />
          </Form.Item>

          {/* Dynamic Available Time Slots Section */}
          {watchDate && (
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ClockCircleOutlined className="text-brand-green" />
                  Available Slots for {watchDate.format("dddd")}
                </span>
                {dayMatchingSlots.length > 0 && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {dayMatchingSlots.length} slot{dayMatchingSlots.length > 1 ? "s" : ""} found
                  </span>
                )}
              </div>

              {dayMatchingSlots.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {dayMatchingSlots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    const formattedSlot = `${formatSlotTime(slot.startTime)} - ${formatSlotTime(
                      slot.endTime
                    )}`;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => handleSelectSlot(slot)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 border ${
                          isSelected
                            ? "bg-brand-green text-white border-brand-green shadow-sm ring-2 ring-emerald-300 dark:ring-emerald-800"
                            : "bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-slate-700 hover:border-brand-green hover:text-brand-green"
                        }`}
                      >
                        {isSelected && <CheckCircleFilled />}
                        <span>{formattedSlot}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 pt-1">
                  <InfoCircleOutlined className="text-blue-500" />
                  <span>
                    No pre-configured slots for {watchDate.format("dddd")}. You can select any custom
                    time range below.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Time Picker Controls */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label={
                  <span className="font-medium text-gray-700 dark:text-gray-300">Start Time</span>
                }
                rules={[{ required: true, message: "Please select start time" }]}
              >
                <TimePicker
                  size="large"
                  className="w-full rounded-xl"
                  format="hh:mm A"
                  use12Hours
                  minuteStep={15}
                  onChange={() => setSelectedSlotId(null)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label={<span className="font-medium text-gray-700 dark:text-gray-300">End Time</span>}
                rules={[{ required: true, message: "Please select end time" }]}
              >
                <TimePicker
                  size="large"
                  className="w-full rounded-xl"
                  format="hh:mm A"
                  use12Hours
                  minuteStep={15}
                  onChange={() => setSelectedSlotId(null)}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Duration validation error banner */}
          {isInvalidDuration && (
            <Alert
              message={validationErrorMessage}
              type="error"
              showIcon
              className="rounded-xl"
            />
          )}

          {/* Live Price Calculator Breakdown */}
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 dark:from-slate-800 dark:to-emerald-950/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 font-medium">
              <span>Hourly Rate:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${tutor.hourlyRate}/hr
              </span>
            </div>

            {watchStartTime && watchEndTime && !isInvalidDuration ? (
              <>
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 font-medium">
                  <span>Selected Duration:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {durationText}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Calculation:</span>
                  <span className="font-mono text-xs">{calculationFormula}</span>
                </div>
                <div className="h-px bg-emerald-200/60 dark:bg-emerald-800/40 my-1" />
                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                    Total Session Fee:
                  </span>
                  <span className="text-2xl font-extrabold text-brand-green">
                    ${totalCostFormatted}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-xs text-gray-400 dark:text-gray-500 italic pt-1">
                Select start and end time to calculate total session duration and fee.
              </div>
            )}
          </div>

          <Form.Item
            name="notes"
            label={
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Additional Notes (Optional)
              </span>
            }
          >
            <TextArea
              rows={3}
              placeholder="Any specific topics or questions you'd like to cover?"
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space className="w-full justify-end pt-2">
              <Button
                onClick={() => {
                  setBookingModalVisible(false);
                  form.resetFields();
                  setSelectedSlotId(null);
                }}
                size="large"
                className="rounded-xl font-medium"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={!isFormBookingReady}
                size="large"
                className="bg-brand-green hover:bg-brand-green-hover border-0 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
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