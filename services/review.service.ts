import { api } from "@/lib/api-client";

export interface Review {
  id: string;
  bookingId: string;
  studentId: string;
  tutorId: string;
  rating: number;
  comment: string;
  createdAt: string;
  student: {
    name: string;
    image?: string;
  };
}

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comment: string;
}

export const reviewService = {
  createReview: async (data: CreateReviewPayload) => {
    return api.post<Review>("/api/v1/reviews", data);
  },

  getTutorReviews: async (tutorId: string) => {
    return api.get<Review[]>(`/api/v1/reviews/tutor/${tutorId}`);
  },

  updateReview: async (reviewId: string, data: Partial<CreateReviewPayload>) => {
    return api.put<Review>(`/api/v1/reviews/${reviewId}`, data);
  },

  deleteReview: async (reviewId: string) => {
    return api.delete(`/api/v1/reviews/${reviewId}`);
  },
};