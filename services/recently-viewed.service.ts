import { api } from "@/lib/api-client";

export interface RecentlyViewedItem {
  id: string;
  studentId: string;
  tutorId: string;
  viewedAt: string;
  tutor: {
    id: string;
    bio?: string;
    subjects: string[];
    hourlyRate: number;
    experience?: string;
    education?: string;
    rating: number;
    totalReviews: number;
    profilePhoto?: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  };
}

export const recentlyViewedService = {
  getRecentlyViewed: async () => {
    return api.get<RecentlyViewedItem[]>("/api/v1/recently-viewed");
  },

  recordView: async (tutorId: string) => {
    return api.post<RecentlyViewedItem>(`/api/v1/recently-viewed/${tutorId}`, {});
  },
};
