"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Layout, Menu, Avatar, Dropdown, Badge } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  LogoutOutlined,
  StarOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { useNotification } from "@/context/NotificationContext";

const { Header, Content, Sider } = Layout;

export default function TutorLayout({
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

  const navigationItems = [
    {
      key: "/tutor",
      icon: <DashboardOutlined />,
      label: "Overview",
    },
    {
      key: "/tutor/profile",
      icon: <UserOutlined />,
      label: "My Profile",
    },
    {
      key: "/tutor/availability",
      icon: <ClockCircleOutlined />,
      label: "Availability",
    },
    {
      key: "/tutor/sessions",
      icon: <CalendarOutlined />,
      label: "Sessions",
    },
    {
      key: "/tutor/notifications",
      icon: (
        <Badge count={unreadCount} size="small" offset={[5, 0]}>
          <BellOutlined style={{ fontSize: "16px" }} className="dark:text-slate-300" />
        </Badge>
      ),
      label: "Notifications",
    },
  ];

  const profileMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign Out",
      danger: true,
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["TUTOR", "ADMIN"]}>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200"
          style={{
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            backgroundColor: isDark ? "#0f172a" : "#ffffff",
          }}
        >
          <div className="text-brand-green dark:text-brand-green font-bold text-xl">
            SkillBridge Tutor
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ThemeToggle />
            <Dropdown
              menu={{
                items: profileMenuItems,
                onClick: ({ key }) => key === "logout" && logout(),
              }}
            >
              <div className="text-gray-700 dark:text-gray-200" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <Avatar icon={<UserOutlined />} className="bg-brand-green" src={user?.image} />
                <span style={{ display: typeof window !== "undefined" && window.innerWidth > 768 ? "inline" : "none" }}>
                  {user?.name}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>
 
        <Layout>
          <Sider
            width={260}
            breakpoint="lg"
            collapsedWidth="0"
            className="bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 transition-colors duration-200"
            style={{ backgroundColor: isDark ? "#0f172a" : "#ffffff" }}
          >
            <Menu
              mode="inline"
              selectedKeys={[pathname]}
              items={navigationItems}
              onClick={({ key }) => router.push(key)}
              className="dark:bg-slate-900"
              style={{ borderRight: 0, paddingTop: 16, backgroundColor: isDark ? "#0f172a" : "#ffffff" }}
            />
          </Sider>

          <Content className="bg-slate-50 dark:bg-slate-950 transition-colors duration-200" style={{ padding: 24, minHeight: 280 }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </ProtectedRoute>
  );
}