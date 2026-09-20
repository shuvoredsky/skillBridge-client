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
  App,
  Card,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { adminService, User } from "../../../../services/admin.service";
import type { ColumnsType } from "antd/es/table";
import EmptyState from "@/components/shared/EmptyState";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;

export default function AdminUsersPage() {
  const { message } = App.useApp();
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

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const fetchUsers = async (
    currentPage = page,
    filters?: {
      search?: string;
      role?: string;
      status?: string;
    }
  ) => {
    setLoading(true);
    try {
      const activeFilters = {
        search: filters?.search !== undefined ? filters.search : searchText,
        role: filters?.role !== undefined ? filters.role : roleFilter,
        status: filters?.status !== undefined ? filters.status : statusFilter,
        page: currentPage,
        limit: pageSize,
      };

      const { data, error } = await adminService.getAllUsers(activeFilters);
      if (error) {
        message.error(error);
      } else if (data) {
        setUsers(data.data);
        setTotalUsers(data.meta.total);
      }
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPage(1);
    fetchUsers(1, {
      search: value,
      role: roleFilter,
      status: statusFilter,
    });
  };

  const handleRoleFilter = (value: string | undefined) => {
    setRoleFilter(value);
    setPage(1);
    fetchUsers(1, {
      search: searchText,
      role: value,
      status: statusFilter,
    });
  };

  const handleStatusFilter = (value: string | undefined) => {
    setStatusFilter(value);
    setPage(1);
    fetchUsers(1, {
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
        fetchUsers(page, { search: searchText, role: roleFilter, status: statusFilter });
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
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-brand-green">
            <UserOutlined />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">{name}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <span className="text-gray-600 dark:text-gray-300 text-sm">{email}</span>
      ),
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
          <Tag color={colors[role as keyof typeof colors]} className="font-semibold text-xs px-2.5 py-0.5 rounded-full">
            {role}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={status === "ACTIVE" ? "success" : "error"}
          className="font-semibold text-xs px-2.5 py-0.5 rounded-full"
        >
          {status || "ACTIVE"}
        </Tag>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-gray-500 dark:text-gray-400 text-xs">
          {dayjs(date).format("MMM DD, YYYY")}
        </span>
      ),
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
                  className="rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-[0.96] transition-all"
                >
                  Ban
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  onClick={() => openActionModal(record, "unban")}
                  className="bg-brand-green hover:bg-brand-green-hover border-0 text-white rounded-lg font-medium active:scale-[0.96] transition-all"
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          View, filter, and manage student, tutor, and admin accounts across the platform
        </p>
      </div>

      {/* Filters */}
      <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm rounded-2xl">
        <div className="flex flex-wrap items-center gap-4">
          <Search
            placeholder="Search by name or email"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            className="flex-1 min-w-[280px]"
          />

          <Select
            placeholder="Filter by Role"
            allowClear
            size="large"
            style={{ minWidth: 160 }}
            onChange={handleRoleFilter}
            value={roleFilter}
            className="rounded-xl"
          >
            <Option value="STUDENT">Student</Option>
            <Option value="TUTOR">Tutor</Option>
            <Option value="ADMIN">Admin</Option>
          </Select>

          <Select
            placeholder="Filter by Status"
            allowClear
            size="large"
            style={{ minWidth: 160 }}
            onChange={handleStatusFilter}
            value={statusFilter}
            className="rounded-xl"
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
              setPage(1);
              fetchUsers(1, { search: "", role: undefined, status: undefined });
            }}
            className="rounded-xl font-medium hover:border-brand-green hover:text-brand-green active:scale-[0.98] transition-all duration-200"
          >
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: totalUsers,
            onChange: (newPage) => {
              setPage(newPage);
              fetchUsers(newPage);
            },
            showTotal: (total) => `Total ${total} users`,
          }}
          locale={{
            emptyText: (
              <EmptyState
                title="No Users Found"
                description={
                  searchText || roleFilter || statusFilter
                    ? "No users match your active search and filter criteria."
                    : "There are no registered users in the platform."
                }
                className="border-0 bg-transparent py-8"
              />
            ),
          }}
        />
      </Card>

      {/* Action Confirmation Modal */}
      <Modal
        title={
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {actionType === "ban" ? "Ban User Account" : "Unban User Account"}
          </div>
        }
        open={actionModalVisible}
        onOk={handleUserAction}
        onCancel={() => {
          setActionModalVisible(false);
          setSelectedUser(null);
        }}
        okText={actionType === "ban" ? "Yes, Ban User" : "Yes, Unban User"}
        centered
        className="rounded-2xl overflow-hidden"
        okButtonProps={{
          danger: actionType === "ban",
          loading,
          className: actionType === "ban" 
            ? "bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium" 
            : "bg-brand-green hover:bg-brand-green-hover border-0 text-white rounded-xl font-medium",
        }}
        cancelButtonProps={{
          className: "rounded-xl font-medium",
        }}
      >
        <p className="text-gray-700 dark:text-gray-300 mt-3">
          Are you sure you want to {actionType}{" "}
          <strong className="text-gray-900 dark:text-white">{selectedUser?.name}</strong>?
        </p>
        {actionType === "ban" && (
          <p className="text-red-500 dark:text-red-400 text-xs mt-2">
            This user will immediately lose login access to the platform.
          </p>
        )}
      </Modal>
    </div>
  );
}