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
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { adminService, Category } from "../../../../services/admin.service";
import type { ColumnsType } from "antd/es/table";
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

  const columns: ColumnsType<Category> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <div className="flex items-center gap-2">
          <TagsOutlined className="text-indigo-600" />
          <span className="font-semibold text-gray-900">{name}</span>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => (
        <span className="text-gray-600">
          {description || "No description"}
        </span>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-gray-500">
          {dayjs(date).format("MMM DD, YYYY")}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Category"
            description="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Categories Management</h1>
          <p className="text-gray-500">Manage tutoring categories</p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Add Category
        </Button>
      </div>

      <Card className="bg-indigo-50 border-indigo-200">
        <div className="text-center">
          <div className="text-4xl font-bold text-indigo-600">
            {categories.length}
          </div>
          <div className="text-gray-600 mt-1">Total Categories</div>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} categories`,
          }}
        />
      </Card>

      <Modal
        title={editingCategory ? "Edit Category" : "Create Category"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-6"
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[
              { required: true, message: "Please enter category name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input
              placeholder="e.g., Mathematics, Programming, etc."
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { max: 500, message: "Description must be less than 500 characters" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Brief description of the category"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setModalVisible(false)} size="large">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {editingCategory ? "Update" : "Create"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}