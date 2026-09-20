"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Select,
  TimePicker,
  Table,
  message,
  Space,
  Tag,
  Popconfirm,
} from "antd";
import { PlusOutlined, DeleteOutlined, ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import { tutorService } from "../../../../services/tutor.service";
import type { Availability } from "@/types/tutor";
import EmptyState from "@/components/shared/EmptyState";

const { Option } = Select;

const WEEKDAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function AvailabilityPage() {
  const [form] = Form.useForm();
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tutorProfileId, setTutorProfileId] = useState<string>("");

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const profileRes = await tutorService.getMyProfile();
      if (profileRes.data) {
        setTutorProfileId(profileRes.data.id);
        const { data } = await tutorService.getMyAvailability(profileRes.data.id);
        if (data) setAvailability(data as any);
      }
    } catch (err) {
      console.error("Error loading availability:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async (values: any) => {
    try {
      const payload = {
        dayOfWeek: values.dayOfWeek,
        startTime: values.timeRange[0].format("HH:mm"),
        endTime: values.timeRange[1].format("HH:mm"),
      };

      const { data, error } = await tutorService.createAvailability(payload);
      if (error) {
        message.error(error);
      } else if (data) {
        message.success("Availability slot added!");
        setModalVisible(false);
        form.resetFields();
        loadAvailability();
      }
    } catch (err) {
      message.error("Failed to add slot");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await tutorService.deleteAvailability(id);
      if (error) {
        message.error(error);
      } else {
        message.success("Slot deleted successfully");
        loadAvailability();
      }
    } catch (err) {
      message.error("Failed to delete slot");
    }
  };

  const groupedByDay = WEEKDAYS.map((day) => ({
    day,
    slots: availability.filter((slot) => slot.dayOfWeek === day),
  }));

  const columns = [
    {
      title: "Day",
      dataIndex: "day",
      key: "day",
      width: 160,
      render: (day: string) => (
        <Tag color="green" className="font-semibold text-xs px-2.5 py-0.5 rounded-full border-emerald-200 dark:border-emerald-800">
          {day}
        </Tag>
      ),
    },
    {
      title: "Time Slots",
      key: "slots",
      render: (_: any, record: { day: string; slots: Availability[] }) => (
        <Space size={[10, 10]} wrap>
          {record.slots.length === 0 ? (
            <span className="text-xs text-gray-400 dark:text-gray-500 italic">
              No slots added for this day yet
            </span>
          ) : (
            record.slots.map((slot) => (
              <div
                key={slot.id}
                className="group flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-gray-800 dark:text-gray-200 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-sm transition-all duration-200 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-xs"
              >
                <ClockCircleOutlined className="text-brand-green text-xs" />
                <span className="font-medium text-xs">
                  {slot.startTime} - {slot.endTime}
                </span>
                <Popconfirm
                  title="Delete this slot?"
                  description="Are you sure you want to remove this availability slot?"
                  onConfirm={() => handleDelete(slot.id)}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true, className: "rounded-lg" }}
                  cancelButtonProps={{ className: "rounded-lg" }}
                >
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    className="h-6 w-6 p-0 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors"
                  />
                </Popconfirm>
              </div>
            ))
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Availability
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Set your weekly availability for students to book 1-on-1 tutoring sessions
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="bg-brand-green hover:bg-brand-green-hover border-0 text-white font-semibold rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          onClick={() => setModalVisible(true)}
        >
          Add Time Slot
        </Button>
      </div>

      <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
        {availability.length === 0 && !loading ? (
          <EmptyState
            title="No Availability Slots Set"
            description="You have not set your weekly schedule yet. Add time slots so students can view your available hours and book sessions."
            actionLabel="Add Your First Slot"
            onAction={() => setModalVisible(true)}
            className="border-0 bg-transparent py-12"
          />
        ) : (
          <Table
            columns={columns}
            dataSource={groupedByDay}
            rowKey="day"
            pagination={false}
            loading={loading}
          />
        )}
      </Card>

      <Modal
        title={
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            Add Availability Slot
          </div>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={480}
        centered
        className="rounded-2xl overflow-hidden"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddSlot}
          className="mt-5 space-y-4"
        >
          <Form.Item
            label={<span className="font-semibold text-gray-700 dark:text-gray-300">Day of Week</span>}
            name="dayOfWeek"
            rules={[{ required: true, message: "Please select a day" }]}
          >
            <Select placeholder="Select day of the week" size="large" className="rounded-xl">
              {WEEKDAYS.map((day) => (
                <Option key={day} value={day}>
                  {day}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700 dark:text-gray-300">Time Range</span>}
            name="timeRange"
            rules={[{ required: true, message: "Please select time range" }]}
          >
            <TimePicker.RangePicker
              format="HH:mm"
              size="large"
              style={{ width: "100%" }}
              minuteStep={30}
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item className="mb-0 pt-2">
            <Space className="w-full justify-end gap-3">
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                }}
                size="large"
                className="rounded-xl font-medium active:scale-[0.98] transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="bg-brand-green hover:bg-brand-green-hover border-0 text-white font-semibold rounded-xl active:scale-[0.98] transition-all duration-200"
              >
                Add Slot
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}