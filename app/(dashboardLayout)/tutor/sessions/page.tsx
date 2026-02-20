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
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { tutorService } from "../../../../services/tutor.service";
import type { Session } from "@/types/tutor";
import type { ColumnsType } from "antd/es/table";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const columns: ColumnsType<Session> = [
    {
      title: "Student",
      key: "student",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <UserOutlined />
          <div>
            <div style={{ fontWeight: 500 }}>{record.student.name}</div>
            <div style={{ fontSize: 12, color: "#999" }}>
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
          <div>{new Date(record.date).toLocaleDateString()}</div>
          <div style={{ fontSize: 12, color: "#666" }}>
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
        <Space>
          {record.status === "CONFIRMED" && (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setSelectedSession(record);
                setModalVisible(true);
              }}
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
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>My Sessions</h1>
        <p style={{ color: "#666", marginTop: 8 }}>
          View and manage your tutoring sessions
        </p>
      </div>

      <Card>
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
        <p>
          Are you sure you want to mark this session with{" "}
          <strong>{selectedSession?.student.name}</strong> as completed?
        </p>
        <p style={{ color: "#666", fontSize: 14 }}>
          This will allow the student to leave a review.
        </p>
      </Modal>
    </div>
  );
}
