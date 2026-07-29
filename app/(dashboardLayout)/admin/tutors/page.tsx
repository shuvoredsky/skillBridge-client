"use client";

import { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Input, message, Card } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { adminService, PendingTutor } from "../../../../services/admin.service";
import type { ColumnsType } from "antd/es/table";

const { TextArea } = Input;

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState<PendingTutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<PendingTutor | null>(null);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalTutors, setTotalTutors] = useState(0);

  useEffect(() => {
    fetchPendingTutors(1);
  }, []);

  const fetchPendingTutors = async (currentPage = page) => {
    setLoading(true);
    try {
      const { data, error } = await adminService.getPendingTutors({
        page: currentPage,
        limit: pageSize,
      });
      if (error) {
        message.error(error);
      } else if (data) {
        setTutors(data.data);
        setTotalTutors(data.meta.total);
      }
    } catch (err) {
      message.error("Failed to fetch pending tutors");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedTutor) return;
    setActionLoading(true);
    try {
      const { error } = await adminService.approveTutor(selectedTutor.id);
      if (error) {
        message.error(error);
      } else {
        message.success("Tutor profile approved successfully!");
        setApproveModalVisible(false);
        setSelectedTutor(null);
        fetchPendingTutors();
      }
    } catch (err) {
      message.error("Failed to approve tutor");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTutor) return;
    setActionLoading(true);
    try {
      const { error } = await adminService.rejectTutor(selectedTutor.id, rejectionReason);
      if (error) {
        message.error(error);
      } else {
        message.success("Tutor profile rejected successfully!");
        setRejectModalVisible(false);
        setSelectedTutor(null);
        setRejectionReason("");
        fetchPendingTutors();
      }
    } catch (err) {
      message.error("Failed to reject tutor");
    } finally {
      setActionLoading(false);
    }
  };

  const columns: ColumnsType<PendingTutor> = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <div className="font-semibold text-gray-900 dark:text-white">
          {record.user.name}
        </div>
      ),
    },
    {
      title: "Email",
      key: "email",
      render: (_, record) => record.user.email,
    },
    {
      title: "Subjects",
      dataIndex: "subjects",
      key: "subjects",
      render: (subjects: string[]) => (
        <div className="flex flex-wrap gap-1">
          {subjects.map((sub) => (
            <span key={sub} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded">
              {sub}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: "Verification Documents",
      key: "documents",
      render: (_, record) => {
        const degree = record.documents.find((d) => d.type === "DEGREE");
        const nid = record.documents.find((d) => d.type === "NID");
        const certificate = record.documents.find((d) => d.type === "CERTIFICATE");

        return (
          <Space size="middle" className="flex-wrap">
            {degree ? (
              <a href={degree.url} target="_blank" rel="noreferrer" className="text-brand-green hover:text-brand-green-hover hover:underline font-semibold text-xs flex items-center gap-1">
                <EyeOutlined /> Degree
              </a>
            ) : (
              <span className="text-gray-400 dark:text-gray-600 text-xs">No Degree</span>
            )}
            {nid ? (
              <a href={nid.url} target="_blank" rel="noreferrer" className="text-brand-green hover:text-brand-green-hover hover:underline font-semibold text-xs flex items-center gap-1">
                <EyeOutlined /> NID
              </a>
            ) : (
              <span className="text-gray-400 dark:text-gray-600 text-xs">No NID</span>
            )}
            {certificate ? (
              <a href={certificate.url} target="_blank" rel="noreferrer" className="text-brand-green hover:text-brand-green-hover hover:underline font-semibold text-xs flex items-center gap-1">
                <EyeOutlined /> Certificate
              </a>
            ) : (
              <span className="text-gray-400 dark:text-gray-600 text-xs">No Certificate</span>
            )}
          </Space>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => {
              setSelectedTutor(record);
              setApproveModalVisible(true);
            }}
            className="bg-brand-green hover:bg-brand-green-hover border-0 text-white font-medium rounded-lg animate-pulse hover:animate-none"
          >
            Approve
          </Button>
          <Button
            danger
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={() => {
              setSelectedTutor(record);
              setRejectModalVisible(true);
            }}
            className="bg-brand-red hover:bg-brand-red-hover border-0 text-white font-medium rounded-lg"
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tutor Verification</h1>
        <p className="text-gray-500 dark:text-gray-400">Review and verify tutor credentials and document submissions</p>
      </div>

      <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
        <Table
          columns={columns}
          dataSource={tutors}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: totalTutors,
            onChange: (newPage) => {
              setPage(newPage);
              fetchPendingTutors(newPage);
            },
            showTotal: (total) => `Total ${total} tutors pending review`,
          }}
          locale={{ emptyText: "No pending tutor verification requests" }}
        />
      </Card>

      {/* Approve Confirmation Modal */}
      <Modal
        title="Approve Tutor Verification"
        open={approveModalVisible}
        onOk={handleApprove}
        confirmLoading={actionLoading}
        onCancel={() => {
          setApproveModalVisible(false);
          setSelectedTutor(null);
        }}
        okText="Approve"
        okButtonProps={{ className: "bg-brand-green hover:bg-brand-green-hover border-0 text-white font-medium rounded-lg" }}
      >
        <p className="text-gray-600 dark:text-gray-300">
          Are you sure you want to approve the teaching profile for <strong>{selectedTutor?.user.name}</strong>? 
          This will make their profile publicly visible and bookable immediately.
        </p>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        title="Reject Tutor Verification"
        open={rejectModalVisible}
        onOk={handleReject}
        confirmLoading={actionLoading}
        onCancel={() => {
          setRejectModalVisible(false);
          setSelectedTutor(null);
          setRejectionReason("");
        }}
        okText="Reject"
        okButtonProps={{ danger: true, className: "bg-brand-red hover:bg-brand-red-hover border-0 text-white font-medium rounded-lg" }}
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Please enter a reason for rejecting <strong>{selectedTutor?.user.name}</strong>'s verification request. 
            This feedback will be shown on their tutor dashboard so they can correct and re-upload their documents.
          </p>
          <TextArea
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. The Degree Certificate photo is blurry or cropped. Please re-upload a clear copy."
            maxLength={500}
            showCount
          />
        </div>
      </Modal>
    </div>
  );
}
