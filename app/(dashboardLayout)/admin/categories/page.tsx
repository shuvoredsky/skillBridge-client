"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Card,
  Space,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TagsOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { adminService, Category } from "../../../../services/admin.service";
import type { ColumnsType } from "antd/es/table";
import StatCard from "@/components/shared/StatCard";
import EmptyState from "@/components/shared/EmptyState";
import dayjs from "dayjs";

const { TextArea } = Input;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await adminService.getAllCategories();
      if (error) {
        message.error(error);
      } else if (data) {
        setCategories(data);
      }
    } catch (error) {
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values: { name: string; description?: string }) => {
    setLoading(true);
    try {
      if (editingCategory) {
        const { error } = await adminService.updateCategory(
          editingCategory.id,
          values
        );
        if (error) {
          message.error(error);
        } else {
          message.success("Category updated successfully");
          fetchCategories();
          setModalVisible(false);
        }
      } else {
        const { error } = await adminService.createCategory(values);
        if (error) {
          message.error(error);
        } else {
          message.success("Category created successfully");
          fetchCategories();
          setModalVisible(false);
        }
      }
    } catch (error) {
      message.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await adminService.deleteCategory(id);
      if (error) {
        message.error(error);
      } else {
        message.success("Category deleted successfully");
        fetchCategories();
      }
    } catch (error) {
      message.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (category: Category) => {
    Modal.confirm({
      title: "Delete Category",
      content: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: {
        className: "bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium",
      },
      cancelButtonProps: {
        className: "rounded-xl font-medium",
      },
      onOk: async () => {
        await handleDelete(category.id);
      },
    });
  };

  const columns: ColumnsType<Category> = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-brand-green">
            <TagsOutlined />
          </div>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{name}</span>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => (
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          {description || <span className="italic text-gray-400 dark:text-gray-500">No description</span>}
        </span>
      ),
    },
    {
      title: "Created At",
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
      width: 170,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            className="rounded-lg text-xs font-medium hover:border-brand-green hover:text-brand-green active:scale-[0.96] transition-all duration-150"
          >
            Edit
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete(record)}
            className="rounded-lg text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-[0.96] transition-all duration-150"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Manage subject categories and tutoring fields across the platform
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
          className="bg-brand-green hover:bg-brand-green-hover border-0 text-white font-semibold rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          Add Category
        </Button>
      </div>

      {/* Metrics Row using StatCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Categories"
          value={categories.length}
          icon={<AppstoreOutlined />}
          color="emerald"
          description="Active tutoring disciplines"
        />
      </div>

      {/* Categories Table */}
      <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} categories`,
          }}
          locale={{
            emptyText: (
              <EmptyState
                title="No Categories Yet"
                description="Get started by organizing your platform with your first tutoring category."
                actionLabel="Add Category"
                onAction={openCreateModal}
                className="border-0 bg-transparent py-8"
              />
            ),
          }}
        />
      </Card>

      {/* Category Create/Edit Modal */}
      <Modal
        title={
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {editingCategory ? "Edit Category" : "Create New Category"}
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={560}
        centered
        className="rounded-2xl overflow-hidden"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-5 space-y-4"
        >
          <Form.Item
            name="name"
            label={<span className="font-semibold text-gray-700 dark:text-gray-300">Category Name</span>}
            rules={[
              { required: true, message: "Please enter category name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input
              placeholder="e.g., Mathematics, Computer Science, Economics"
              size="large"
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="font-semibold text-gray-700 dark:text-gray-300">Description (Optional)</span>}
            rules={[
              { max: 500, message: "Description must be less than 500 characters" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Brief description of this tutoring category..."
              size="large"
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item className="mb-0 pt-2">
            <Space className="w-full justify-end gap-3">
              <Button
                onClick={() => setModalVisible(false)}
                size="large"
                className="rounded-xl font-medium active:scale-[0.98] transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="bg-brand-green hover:bg-brand-green-hover border-0 text-white font-semibold rounded-xl active:scale-[0.98] transition-all duration-200"
              >
                {editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}