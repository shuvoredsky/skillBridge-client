"use client";

import { useEffect, useState } from "react";
import { Star, User, Calendar } from "lucide-react";
import { tutorService } from "@/services/tutor.service";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  student: {
    name: string;
    image?: string;
  };
}

export default function TutorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await tutorService.getMyProfile();
      if (response.data) {
        setReviews(response.data.reviews || []);
        setStats({
          average: response.data.rating || 0,
          total: response.data.totalReviews || 0,
        });
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-slate-300"
        }
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Student Reviews</h1>
        <p className="text-slate-600 mt-1">See what students say about you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
          <h3 className="text-slate-600 font-medium mb-2">Average Rating</h3>
          <div className="flex items-center gap-3">
            <span className="text-5xl font-bold text-slate-900">
              {stats.average.toFixed(1)}
            </span>
            <div className="flex gap-1">
              {renderStars(Math.round(stats.average))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <h3 className="text-slate-600 font-medium mb-2">Total Reviews</h3>
          <span className="text-5xl font-bold text-slate-900">
            {stats.total}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <p className="text-slate-500">No reviews yet</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {review.student.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900">
                      {review.student.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={16} />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}