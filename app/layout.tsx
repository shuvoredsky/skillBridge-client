import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AuthProvider } from "@/context/AuthContext";
import { ConfigProvider, App } from "antd";
import "./globals.css";

export const metadata = {
  title: "SkillBridge",
  description: "Connect with Expert Tutors",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#4F46E5",
                borderRadius: 6,
              },
            }}
          >
            <App>
              <AuthProvider>{children}</AuthProvider>
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
