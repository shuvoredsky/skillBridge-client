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
  Empty,
  Space,
  Tag,
  Popconfirm,
} from "antd";
import { PlusOutlined, DeleteOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { tutorService } from "../../../../services/tutor.service";
import type { Availability } from "@/types/tutor";

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
      render: (day: string) => (
        <Tag color="success" className="font-semibold text-sm">
          {day}
        </Tag>
      ),
    },
    {
      title: "Time Slots",
      key: "slots",
      render: (_: any, record: { day: string; slots: Availability[] }) => (
        <Space size={[8, 8]} wrap>
          {record.slots.length === 0 ? (
            <span className="text-gray-400 dark:text-gray-500">No slots available</span>
          ) : (
            record.slots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-slate-200/60 dark:border-slate-700/60 rounded-lg text-sm transition-colors duration-200"
              >
                <ClockCircleOutlined />
                <span>
                  {slot.startTime} - {slot.endTime}
                </span>
                <Popconfirm
                  title="Delete this slot?"
                  onConfirm={() => handleDelete(slot.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    className="hover:bg-red-50 dark:hover:bg-red-950/20"
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Availability
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Set your weekly availability for students to book sessions
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="bg-brand-green hover:bg-brand-green-hover border-0 text-white"
          onClick={() => setModalVisible(true)}
        >
          Add Time Slot
        </Button>
      </div>

      <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
        {availability.length === 0 ? (
          <Empty
            description={<span className="dark:text-gray-400">No availability set yet</span>}
            style={{ padding: "60px 0" }}
          >
            <Button type="primary" className="bg-brand-green hover:bg-brand-green-hover border-0" onClick={() => setModalVisible(true)}>
              Add Your First Slot
            </Button>
          </Empty>
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
        title="Add Availability Slot"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleAddSlot}>
          <Form.Item
            label="Day of Week"
            name="dayOfWeek"
            rules={[{ required: true, message: "Please select a day" }]}
          >
            <Select placeholder="Select day" size="large">
              {WEEKDAYS.map((day) => (
                <Option key={day} value={day}>
                  {day}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Time Range"
            name="timeRange"
            rules={[{ required: true, message: "Please select time range" }]}
          >
            <TimePicker.RangePicker
              format="HH:mm"
              size="large"
              style={{ width: "100%" }}
              minuteStep={30}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space className="w-full justify-end">
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" className="bg-brand-green hover:bg-brand-green-hover border-0 text-white">
                Add Slot
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}