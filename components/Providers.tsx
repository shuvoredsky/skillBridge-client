"use client";

import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App, theme } from "antd";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { NotificationProvider } from "@/context/NotificationContext";

function AntdThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme: currentTheme } = useTheme();
  
  return (
    <ConfigProvider
      theme={{
        algorithm: currentTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#10b981", // brand-green
          colorError: "#ef4444", // brand-red
          borderRadius: 6,
        },
      }}
    >
      <App>
        <AuthProvider>
          <WishlistProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </WishlistProvider>
        </AuthProvider>
      </App>
    </ConfigProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ThemeProvider>
        <AntdThemeWrapper>
          {children}
        </AntdThemeWrapper>
      </ThemeProvider>
    </AntdRegistry>
  );
}
