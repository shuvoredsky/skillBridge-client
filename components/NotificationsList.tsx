"use client";

import { useEffect } from "react";
import { useNotification } from "@/context/NotificationContext";
import { Card, Button, Empty, Badge, Spin } from "antd";
import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function NotificationsList() {
  const { notifications, loading, loadNotifications, markAllAsRead } = useNotification();

  useEffect(() => {
    loadNotifications();
    // Mark all as read on mount
    markAllAsRead();
  }, []);

  if (loading && notifications.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Center</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Stay updated with your latest activities on SkillBridge.
          </p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={markAllAsRead}
            className="bg-brand-green hover:bg-brand-green-hover border-0 text-white"
          >
            Mark All Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="shadow-sm border-0 rounded-2xl dark:bg-slate-900 dark:border-slate-800 text-center py-16">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No notifications found
              </p>
            }
          />
        </Card>
      ) : (
        <Card className="shadow-sm border-0 rounded-2xl overflow-hidden p-0 dark:bg-slate-900 dark:border-slate-800">
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`px-6 py-5 transition-colors duration-200 flex items-start gap-4 ${
                  !item.isRead
                    ? "bg-emerald-50/40 dark:bg-emerald-950/10"
                    : "bg-transparent"
                }`}
              >
                <div className="mt-1">
                  <Badge dot={!item.isRead} color="#10b981">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <BellOutlined className="text-brand-green text-lg" />
                    </div>
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                      {item.title}
                    </h4>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {dayjs(item.createdAt).fromNow()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
