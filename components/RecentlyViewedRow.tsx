"use client";

import { useState, useEffect, useRef } from "react";
import { Card, Avatar, Tag, Spin } from "antd";
import { UserOutlined, StarFilled } from "@ant-design/icons";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { recentlyViewedService, RecentlyViewedItem } from "@/services/recently-viewed.service";
import { getImageUrl } from "@/lib/getImageUrl";

export default function RecentlyViewedRow() {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    if (user && user.role === "STUDENT") {
      fetchRecentlyViewed();
    } else {
      setItems([]);
    }
  }, [user]);

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, [items]);

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

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const scrollAmount = 300;
    containerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Only render if student user and there are items
  if (!user || user.role !== "STUDENT" || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Recently Viewed Tutors
        </h2>
      </div>
      
      {loading && items.length === 0 ? (
        <div className="flex justify-center py-4">
          <Spin size="default" />
        </div>
      ) : (
        <div className="relative group">
          {/* Left Fade Gradient */}
          <div
            className={`absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
              showLeftArrow ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Right Fade Gradient */}
          <div
            className={`absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
              showRightArrow ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Left Navigation Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="absolute left-1 top-1/2 -translate-y-1/2 -mt-2 z-20 w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-brand-green hover:border-brand-green dark:hover:text-brand-green hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* Right Navigation Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="absolute right-1 top-1/2 -translate-y-1/2 -mt-2 z-20 w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-brand-green hover:border-brand-green dark:hover:text-brand-green hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          )}

          {/* Carousel Track with Hidden Scrollbar */}
          <div
            ref={containerRef}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item) => {
              const tutor = item.tutor;
              if (!tutor) return null;
              return (
                <Card
                  key={item.id}
                  hoverable
                  onClick={() => router.push(`/tutors/${tutor.id}`)}
                  className="w-[260px] flex-shrink-0 shadow-sm hover:shadow-md transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-0.5"
                  styles={{ body: { padding: "16px" } }}
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
                        <Tag key={sub} color="success" className="text-[10px] px-2 py-0.5 rounded-full border-0 font-medium">
                          {sub}
                        </Tag>
                      ))}
                      {tutor.subjects?.length > 1 && (
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium self-center">
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
        </div>
      )}
    </div>
  );
}
