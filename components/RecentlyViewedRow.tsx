"use client";

import { useState, useEffect } from "react";
import { Card, Avatar, Rate, Tag, Spin } from "antd";
import { UserOutlined, DollarOutlined, StarFilled } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { recentlyViewedService, RecentlyViewedItem } from "@/services/recently-viewed.service";
import { getImageUrl } from "@/lib/getImageUrl";

export default function RecentlyViewedRow() {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === "STUDENT") {
      fetchRecentlyViewed();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchRecentlyViewed = async () => {
    setLoading(true);
    try {
      const { data, error } = await recentlyViewedService.getRecentlyViewed();
      if (data && !error) {
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to fetch recently viewed tutors:", err);
    } finally {
      setLoading(false);
    }
  };

  // Only render if student user and there are items
  if (!user || user.role !== "STUDENT" || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Recently Viewed Tutors
      </h2>
      
      {loading && items.length === 0 ? (
        <div className="flex justify-center py-4">
          <Spin size="default" />
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-800">
          {items.map((item) => {
            const tutor = item.tutor;
            if (!tutor) return null;
            return (
              <Card
                key={item.id}
                hoverable
                onClick={() => router.push(`/tutors/${tutor.id}`)}
                className="w-[260px] flex-shrink-0 shadow-sm hover:shadow-md transition-all duration-300 dark:bg-slate-900 dark:border-slate-800"
                bodyStyle={{ padding: "16px" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar
                    size={48}
                    src={getImageUrl(tutor.profilePhoto || tutor.user.image)}
                    icon={<UserOutlined />}
                    className="bg-brand-green flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate text-sm mb-0.5">
                      {tutor.user.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <StarFilled />
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        {tutor.rating.toFixed(1)} ({tutor.totalReviews})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex flex-wrap gap-1 max-w-[140px]">
                    {tutor.subjects?.slice(0, 1).map((sub) => (
                      <Tag key={sub} color="success" className="text-[10px] px-1 py-0 border-0 font-medium">
                        {sub}
                      </Tag>
                    ))}
                    {tutor.subjects?.length > 1 && (
                      <span className="text-[10px] text-gray-400">
                        +{tutor.subjects.length - 1}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-brand-green dark:text-emerald-400 font-bold text-sm">
                      ${tutor.hourlyRate}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 block">
                      /hr
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
