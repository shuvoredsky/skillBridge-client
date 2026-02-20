"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Modal,
  message,
  Card,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { adminService, User } from "../../../../services/admin.service";
import type { ColumnsType } from "antd/es/table";

const { Search } = Input;
const { Option } = Select;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionType, setActionType] = useState<"ban" | "unban">("ban");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (filters?: {
    search?: string;
    role?: string;
    status?: string;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await adminService.getAllUsers(filters);
      if (error) {
        message.error(error);
      } else if (data) {
        setUsers(data);
      }
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchUsers({
      search: value,
      role: roleFilter,
      status: statusFilter,
    });
  };

  const handleRoleFilter = (value: string | undefined) => {
    setRoleFilter(value);
    fetchUsers({
      search: searchText,
      role: value,
      status: statusFilter,
    });
  };

  const handleStatusFilter = (value: string | undefined) => {
    setStatusFilter(value);
    fetchUsers({
      search: searchText,
      role: roleFilter,
      status: value,
    });
  };

  const openActionModal = (user: User, action: "ban" | "unban") => {
    setSelectedUser(user);
    setActionType(action);
    setActionModalVisible(true);
  };

  const handleUserAction = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const { error } =
        actionType === "ban"
          ? await adminService.banUser(selectedUser.id)
          : await adminService.unbanUser(selectedUser.id);

      if (error) {
        message.error(error);
      } else {
        message.success(
          `User ${actionType === "ban" ? "banned" : "unbanned"} successfully`
        );
        fetchUsers({ search: searchText, role: roleFilter, status: statusFilter });
        setActionModalVisible(false);
        setSelectedUser(null);
      }
    } catch (error) {
      message.error(`Failed to ${actionType} user`);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-gray-400" />
          <span className="font-medium">{name}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const colors = {
          ADMIN: "red",
          TUTOR: "green",
          STUDENT: "blue",
        };
        return (
          <Tag color={colors[role as keyof typeof colors]}>{role}</Tag>
        );
      },
    },
    // ❌ REMOVED: Email Verified column
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "success" : "error"}>
          {status || "ACTIVE"}
        </Tag>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {record.role !== "ADMIN" && (
            <>
              {record.status === "ACTIVE" ? (
                <Button
                  danger
                  size="small"
                  icon={<StopOutlined />}
                  onClick={() => openActionModal(record, "ban")}
                >
                  Ban
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="small"
                  onClick={() => openActionModal(record, "unban")}
                >
                  Unban
                </Button>
              )}
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users Management</h1>
        <p className="text-gray-500">Manage all users on the platform</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4">
          <Search
            placeholder="Search by name or email"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            className="flex-1 min-w-[300px]"
          />

          <Select
            placeholder="Filter by Role"
            allowClear
            size="large"
            style={{ minWidth: 150 }}
            onChange={handleRoleFilter}
          >
            <Option value="STUDENT">Student</Option>
            <Option value="TUTOR">Tutor</Option>
            <Option value="ADMIN">Admin</Option>
          </Select>

          <Select
            placeholder="Filter by Status"
            allowClear
            size="large"
            style={{ minWidth: 150 }}
            onChange={handleStatusFilter}
          >
            <Option value="ACTIVE">Active</Option>
            <Option value="BANNED">Banned</Option>
          </Select>

          <Button
            type="default"
            size="large"
            onClick={() => {
              setSearchText("");
              setRoleFilter(undefined);
              setStatusFilter(undefined);
              fetchUsers();
            }}
          >
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} users`,
          }}
        />
      </Card>

      {/* Action Confirmation Modal */}
      <Modal
        title={`${actionType === "ban" ? "Ban" : "Unban"} User`}
        open={actionModalVisible}
        onOk={handleUserAction}
        onCancel={() => {
          setActionModalVisible(false);
          setSelectedUser(null);
        }}
        okText={actionType === "ban" ? "Ban User" : "Unban User"}
        okButtonProps={{
          danger: actionType === "ban",
          loading,
        }}
      >
        <p>
          Are you sure you want to {actionType}{" "}
          <strong>{selectedUser?.name}</strong>?
        </p>
        {actionType === "ban" && (
          <p className="text-gray-500 mt-2">
            This user will not be able to access the platform.
          </p>
        )}
      </Modal>
    </div>
  );
}