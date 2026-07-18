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
  HeartOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { useNotification } from "@/context/NotificationContext";

const { Header, Content, Sider } = Layout;

export default function StudentDashboardLayout({
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
      key: "/dashboard/wishlist",
      icon: <HeartOutlined />,
      label: "Wishlist",
    },
    {
      key: "/dashboard/notifications",
      icon: (
        <Badge count={unreadCount} size="small" offset={[5, 0]}>
          <BellOutlined style={{ fontSize: "16px" }} className="dark:text-slate-300" />
        </Badge>
      ),
      label: "Notifications",
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
        <Header 
          className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-sm px-6 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200"
          style={{ backgroundColor: isDark ? "#0f172a" : "#ffffff", color: isDark ? "#ffffff" : "#000000" }}
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
              <BookOutlined className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden md:inline">
              SkillBridge
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Student</div>
                </div>
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  className="bg-brand-green"
                  src={user?.image}
                />
              </div>
            </Dropdown>
          </div>
        </Header>

        <Layout>
          <Sider
            width={260}
            breakpoint="lg"
            collapsedWidth="0"
            className="shadow-sm bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 transition-colors duration-200"
            style={{ backgroundColor: isDark ? "#0f172a" : "#ffffff" }}
          >
            <div className="p-4 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Avatar
                  size={48}
                  icon={<UserOutlined />}
                  className="bg-gradient-to-br from-brand-green to-emerald-600"
                  src={user?.image}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </div>
                  <Badge status="success" text="Active" className="dark:text-gray-300" />
                </div>
              </div>
            </div>

            <Menu
              mode="inline"
              selectedKeys={[pathname]}
              items={menuItems}
              onClick={({ key }) => router.push(key)}
              className="border-r-0 pt-4 dark:bg-slate-900"
              style={{ backgroundColor: isDark ? "#0f172a" : "#ffffff" }}
            />
          </Sider>

          <Content className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 min-h-screen transition-colors duration-200">
            {children}
          </Content>
        </Layout>
      </Layout>
    </ProtectedRoute>
  );
}