"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Layout, Menu, Avatar, Dropdown, Badge } from "antd";
import {
  UserOutlined,
  BookOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SettingOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const { Header, Content, Sider } = Layout;

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Overview",
    },
    {
      key: "/dashboard/bookings",
      icon: <BookOutlined />,
      label: "My Bookings",
    },
    {
      key: "/dashboard/profile",
      icon: <SettingOutlined />,
      label: "Profile",
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => router.push("/dashboard/profile"),
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <Layout className="min-h-screen">
        <Header className="bg-white shadow-sm px-6 flex items-center justify-between sticky top-0 z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BookOutlined className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden md:inline">
              SkillBridge
            </span>
          </Link>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-gray-900">
                  {user?.name}
                </div>
                <div className="text-xs text-gray-500">Student</div>
              </div>
              <Avatar
                size={40}
                icon={<UserOutlined />}
                className="bg-indigo-600"
                src={user?.image}
              />
            </div>
          </Dropdown>
        </Header>

        <Layout>
          <Sider
            width={260}
            style={{ background: "#fff" }}
            breakpoint="lg"
            collapsedWidth="0"
            className="shadow-sm"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Avatar
                  size={48}
                  icon={<UserOutlined />}
                  className="bg-gradient-to-br from-indigo-500 to-purple-600"
                  src={user?.image}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">
                    {user?.name}
                  </div>
                  <Badge status="success" text="Active" />
                </div>
              </div>
            </div>

            <Menu
              mode="inline"
              selectedKeys={[pathname]}
              items={menuItems}
              onClick={({ key }) => router.push(key)}
              className="border-r-0 pt-4"
            />
          </Sider>

          <Content className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {children}
          </Content>
        </Layout>
      </Layout>
    </ProtectedRoute>
  );
}