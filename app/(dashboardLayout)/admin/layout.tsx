"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Layout, Menu, Avatar, Dropdown, Badge } from "antd";
import {
  UserOutlined,
  BookOutlined,
  LogoutOutlined,
  HomeOutlined,
  TeamOutlined,
  TagsOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { useNotification } from "@/context/NotificationContext";

const { Header, Content, Sider } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { unreadCount } = useNotification();

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
    {
      key: "/admin/notifications",
      icon: (
        <Badge count={unreadCount} size="small" offset={[5, 0]}>
          <BellOutlined style={{ fontSize: "16px" }} className="dark:text-slate-300" />
        </Badge>
      ),
      label: "Notifications",
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
        <Header 
          className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-sm px-6 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200"
          style={{ backgroundColor: isDark ? "#0f172a" : "#ffffff", color: isDark ? "#ffffff" : "#000000" }}
        >
          <div className="text-xl font-bold text-brand-green">
            SkillBridge - Admin
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: ({ key }) => key === "logout" && logout(),
              }}
            >
              <div className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200">
                <Avatar icon={<UserOutlined />} className="bg-brand-green" />
                <span className="hidden md:inline">{user?.name}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Layout>
          <Sider 
            width={250} 
            className="bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 transition-colors duration-200"
            style={{ backgroundColor: isDark ? "#0f172a" : "#ffffff" }}
          >
            <Menu
              mode="inline"
              selectedKeys={[pathname]}
              items={menuItems}
              onClick={({ key }) => router.push(key)}
              className="border-r-0 pt-4 dark:bg-slate-900"
              style={{ backgroundColor: isDark ? "#0f172a" : "#ffffff" }}
            />
          </Sider>

          <Content className="p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">{children}</Content>
        </Layout>
      </Layout>
    </ProtectedRoute>
  );
}