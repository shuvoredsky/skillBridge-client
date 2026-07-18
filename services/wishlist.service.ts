import { api } from "@/lib/api-client";

export interface WishlistItem {
  id: string;
  studentId: string;
  tutorId: string;
  createdAt: string;
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
    profilePhotoUrl?: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  };
}

export const wishlistService = {
  getWishlist: async () => {
    return api.get<WishlistItem[]>("/api/v1/wishlist");
  },

  addToWishlist: async (tutorId: string) => {
    return api.post<WishlistItem>(`/api/v1/wishlist/${tutorId}`, {});
  },

  removeFromWishlist: async (tutorId: string) => {
    return api.delete(`/api/v1/wishlist/${tutorId}`);
  },
};
