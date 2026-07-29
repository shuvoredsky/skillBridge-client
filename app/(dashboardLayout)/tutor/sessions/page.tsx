"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  message,
  Tabs,
  Empty,
  Rate,
  Form,
  Input,
  Select,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { tutorService } from "../../../../services/tutor.service";
import { bookingService } from "../../../../services/booking.service";
import type { Session } from "@/types/tutor";
import type { ColumnsType } from "antd/es/table";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [linkForm] = Form.useForm();
  const [submittingLink, setSubmittingLink] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data, error } = await tutorService.getMySessions();
      if (error) {
        message.error(error);
      } else if (data) {
        setSessions(data as any);
      }
    } catch (err) {
      message.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!selectedSession) return;

    try {
      const { error } = await tutorService.updateSessionStatus(
        selectedSession.id,
        "COMPLETED"
      );

      if (error) {
        message.error(error);
      } else {
        message.success("Session marked as completed!");
        setModalVisible(false);
        setSelectedSession(null);
        fetchSessions();
      }
    } catch (err) {
      message.error("Failed to update session");
    }
  };

  const handleSetMeetingLink = async (values: { meetingLink: string; meetingPlatform: "GOOGLE_MEET" | "ZOOM" | "MS_TEAMS" }) => {
    if (!selectedSession) return;
    setSubmittingLink(true);
    try {
      const { error } = await bookingService.updateMeetingLink(
        selectedSession.id,
        values.meetingLink,
        values.meetingPlatform
      );
      if (error) {
        message.error(error);
      } else {
        message.success("Meeting link updated successfully!");
        setLinkModalVisible(false);
        linkForm.resetFields();
        setSelectedSession(null);
        fetchSessions();
      }
    } catch (err) {
      message.error("Failed to update meeting link");
    } finally {
      setSubmittingLink(false);
    }
  };

  const columns: ColumnsType<Session> = [
    {
      title: "Student",
      key: "student",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <UserOutlined />
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{record.student.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {record.student.email}
            </div>
          </div>
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
        <div>
          <div className="text-gray-900 dark:text-gray-100">{new Date(record.date).toLocaleDateString()}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {record.startTime} - {record.endTime}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const config = {
          CONFIRMED: { color: "orange", icon: <ClockCircleOutlined /> },
          COMPLETED: { color: "green", icon: <CheckCircleOutlined /> },
          CANCELLED: { color: "red", icon: null },
        };
        const { color, icon } = config[status as keyof typeof config];
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle" className="flex-wrap">
          {record.status === "CONFIRMED" && (
            <Button
              type="default"
              size="small"
              onClick={() => {
                setSelectedSession(record);
                linkForm.setFieldsValue({
                  meetingLink: record.meetingLink || "",
                  meetingPlatform: record.meetingPlatform || "GOOGLE_MEET",
                });
                setLinkModalVisible(true);
              }}
              className="dark:bg-slate-800 dark:text-white dark:border-slate-700"
            >
              {record.meetingLink ? "Edit Meeting Link" : "Set Meeting Link"}
            </Button>
          )}
          {record.status === "CONFIRMED" && record.meetingLink && (
            <Button
              type="primary"
              size="small"
              href={record.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 border-0 text-white"
            >
              Join Session ({record.meetingPlatform === "GOOGLE_MEET" ? "Meet" : record.meetingPlatform === "ZOOM" ? "Zoom" : "Teams"})
            </Button>
          )}
          {record.status === "CONFIRMED" && (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setSelectedSession(record);
                setModalVisible(true);
              }}
              className="bg-brand-green hover:bg-brand-green-hover border-0 text-white"
            >
              Mark Complete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const upcoming = sessions.filter((s) => s.status === "CONFIRMED");
  const completed = sessions.filter((s) => s.status === "COMPLETED");
  const cancelled = sessions.filter((s) => s.status === "CANCELLED");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Sessions</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage your tutoring sessions
        </p>
      </div>

      <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
        <Tabs
          items={[
            {
              key: "upcoming",
              label: `Upcoming (${upcoming.length})`,
              children: (
                <Table
                  columns={columns}
                  dataSource={upcoming}
                  rowKey="id"
                  loading={loading}
                  locale={{ emptyText: <Empty description="No upcoming sessions" /> }}
                />
              ),
            },
            {
              key: "completed",
              label: `Completed (${completed.length})`,
              children: (
                <Table
                  columns={columns}
                  dataSource={completed}
                  rowKey="id"
                  loading={loading}
                  locale={{ emptyText: <Empty description="No completed sessions" /> }}
                />
              ),
            },
            {
              key: "cancelled",
              label: `Cancelled (${cancelled.length})`,
              children: (
                <Table
                  columns={columns}
                  dataSource={cancelled}
                  rowKey="id"
                  loading={loading}
                  locale={{ emptyText: <Empty description="No cancelled sessions" /> }}
                />
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="Mark Session as Completed"
        open={modalVisible}
        onOk={handleMarkComplete}
        onCancel={() => {
          setModalVisible(false);
          setSelectedSession(null);
        }}
        okText="Mark Complete"
      >
        <p className="text-gray-800 dark:text-gray-200">
          Are you sure you want to mark this session with{" "}
          <strong className="text-brand-green">{selectedSession?.student.name}</strong> as completed?
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This will allow the student to leave a review.
        </p>
      </Modal>

      <Modal
        title="Set Online Meeting Details"
        open={linkModalVisible}
        onCancel={() => {
          setLinkModalVisible(false);
          linkForm.resetFields();
          setSelectedSession(null);
        }}
        footer={null}
        width={500}
      >
        <Form form={linkForm} layout="vertical" onFinish={handleSetMeetingLink} className="mt-4">
          <Form.Item
            name="meetingPlatform"
            label="Video Platform"
            rules={[{ required: true, message: "Please select a meeting platform" }]}
          >
            <Select placeholder="Select Platform">
              <Select.Option value="GOOGLE_MEET">Google Meet</Select.Option>
              <Select.Option value="ZOOM">Zoom</Select.Option>
              <Select.Option value="MS_TEAMS">Microsoft Teams</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="meetingLink"
            label="Meeting Link (URL)"
            rules={[
              { required: true, message: "Please enter the meeting link URL" },
              { type: "url", message: "Please enter a valid URL format" }
            ]}
          >
            <Input placeholder="e.g. https://meet.google.com/abc-defg-hij" />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setLinkModalVisible(false);
                  linkForm.resetFields();
                  setSelectedSession(null);
                }}
                disabled={submittingLink}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-brand-green hover:bg-brand-green-hover border-0 text-white"
                loading={submittingLink}
              >
                Save Meeting Details
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
