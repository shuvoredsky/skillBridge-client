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
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";

const { Header, Content, Sider } = Layout;

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

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
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 600, color: "#16a34a" }}>
            SkillBridge Tutor
          </div>
          <Dropdown
            menu={{
              items: profileMenuItems,
              onClick: ({ key }) => key === "logout" && logout(),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} src={user?.image} />
              <span style={{ display: window.innerWidth > 768 ? "inline" : "none" }}>
                {user?.name}
              </span>
            </div>
          </Dropdown>
        </Header>

        <Layout>
          <Sider
            width={260}
            style={{ background: "#fff", boxShadow: "2px 0 8px rgba(0,0,0,0.06)" }}
            breakpoint="lg"
            collapsedWidth="0"
          >
            <Menu
              mode="inline"
              selectedKeys={[pathname]}
              items={navigationItems}
              onClick={({ key }) => router.push(key)}
              style={{ borderRight: 0, paddingTop: 16 }}
            />
          </Sider>

          <Content style={{ padding: 24, background: "#f5f5f5", minHeight: 280 }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </ProtectedRoute>
  );
}