"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  BookOutlined,
  LogoutOutlined,
  HomeOutlined,
  ClockCircleOutlined,
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

  const menuItems = [
    {
      key: "/tutor",
      icon: <HomeOutlined />,
      label: "Dashboard",
    },
    {
      key: "/tutor/availability",
      icon: <ClockCircleOutlined />,
      label: "Availability",
    },
    {
      key: "/tutor/bookings",
      icon: <BookOutlined />,
      label: "Sessions",
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
    },
  ];

  const handleMenuClick = (key: string) => {
    if (key === "logout") {
      logout();
    } else {
      router.push(key);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["TUTOR"]}>
      <Layout className="min-h-screen">
        <Header className="bg-white shadow-sm px-6 flex items-center justify-between">
          <div className="text-xl font-bold text-green-600">
            SkillBridge - Tutor
          </div>
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: ({ key }) => handleMenuClick(key),
            }}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar icon={<UserOutlined />} src={user?.image} />
              <span className="hidden md:inline">{user?.name}</span>
            </div>
          </Dropdown>
        </Header>

        <Layout>
          <Sider width={250} className="bg-white shadow-sm">
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