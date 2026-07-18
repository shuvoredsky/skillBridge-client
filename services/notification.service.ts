import { api } from "@/lib/api-client";

export interface NotificationItem {
  id: string;
  receiverId: string;
  receiverRole: "STUDENT" | "TUTOR" | "ADMIN";
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  relatedId?: string;
  createdAt: string;
}

export const notificationService = {
  getNotifications: async () => {
    return api.get<NotificationItem[]>("/api/v1/notifications");
  },

  getUnreadCount: async () => {
    return api.get<{ count: number }>("/api/v1/notifications/unread-count");
  },

  markAllRead: async () => {
    return api.patch<{ message: string }>("/api/v1/notifications/mark-all-read", {});
  },
};
