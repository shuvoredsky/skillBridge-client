"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  BookOutlined,
  LogoutOutlined,
  HomeOutlined,
  TeamOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";

const { Header, Content, Sider } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      key: "/admin",
      icon: <HomeOutlined />,
      label: "Dashboard",
    },
    {
      key: "/admin/users",
      icon: <TeamOutlined />,
      label: "Users",
    },
    {
      key: "/admin/bookings",
      icon: <BookOutlined />,
      label: "Bookings",
    },
    {
      key: "/admin/categories",
      icon: <TagsOutlined />,
      label: "Categories",
    },
  ];

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <Layout className="min-h-screen">
        <Header className="bg-white shadow-sm px-6 flex items-center justify-between">
          <div className="text-xl font-bold text-indigo-600">
            SkillBridge - Admin
          </div>
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: ({ key }) => key === "logout" && logout(),
            }}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar icon={<UserOutlined />} className="bg-indigo-600" />
              <span className="hidden md:inline">{user?.name}</span>
            </div>
          </Dropdown>
        </Header>

        <Layout>
          <Sider 
            width={250} 
            style={{ background: '#fff' }}
          >
            <Menu
              mode="inline"
              selectedKeys={[pathname]}
              items={menuItems}
              onClick={({ key }) => router.push(key)}
              className="border-r-0 pt-4"
            />
          </Sider>

          <Content className="p-6 bg-gray-50">{children}</Content>
        </Layout>
      </Layout>
    </ProtectedRoute>
  );
}