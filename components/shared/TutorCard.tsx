"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Avatar, Tag, Button, Rate, message } from "antd";
import {
  UserOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { getImageUrl } from "@/lib/getImageUrl";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

export interface TutorCardUser {
  id?: string;
  name: string;
  email?: string;
  image?: string;
}

export interface TutorCardData {
  id: string;
  bio?: string;
  subjects?: string[];
  hourlyRate?: number;
  experience?: string;
  education?: string;
  rating?: number;
  totalReviews?: number;
  profilePhoto?: string;
  profilePhotoUrl?: string;
  user?: TutorCardUser;
}

export interface TutorCardProps {
  tutor: TutorCardData;
  variant?: "default" | "featured" | "wishlist";
  showWishlistButton?: boolean;
  showRemoveButton?: boolean;
  index?: number;
  className?: string;
  onWishlistToggle?: (tutorId: string) => void;
}

export default function TutorCard({
  tutor,
  variant = "default",
  showWishlistButton = true,
  showRemoveButton = false,
  index = 0,
  className = "",
  onWishlistToggle,
}: TutorCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { isSaved, toggleWishlist } = useWishlist();

  // Reveal animation for featured variant
  const [isVisible, setIsVisible] = useState(variant !== "featured");
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (variant !== "featured") return;
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [variant]);

  const avatarUrl = getImageUrl(
    tutor.profilePhoto || tutor.profilePhotoUrl || tutor.user?.image
  );
  const tutorName = tutor.user?.name || "Tutor";
  const ratingValue = Number(tutor.rating || 0);
  const reviewsCount = tutor.totalReviews || 0;
  const isWishlisted = isSaved(tutor.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onWishlistToggle) {
      onWishlistToggle(tutor.id);
      return;
    }
    if (!user) {
      message.warning("Please login to save tutors");
      router.push("/login");
      return;
    }
    if (user.role !== "STUDENT") {
      message.warning("Only students can save tutors to wishlist");
      return;
    }
    toggleWishlist(tutor.id);
  };

  const handleCardClick = () => {
    router.push(`/tutors/${tutor.id}`);
  };

  return (
    <div
      ref={cardRef}
      style={
        variant === "featured"
          ? { transitionDelay: `${(index % 4) * 80}ms` }
          : undefined
      }
      className={`h-full transition-all duration-500 ease-out ${
        variant === "featured"
          ? isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
          : ""
      }`}
    >
      <Card
        hoverable
        onClick={handleCardClick}
        className={`h-full flex flex-col justify-between rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-[0_12px_30px_-8px_rgba(16,185,129,0.22)] hover:border-emerald-400/60 dark:hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 relative cursor-pointer overflow-hidden ${className}`}
        styles={{
          body: {
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          },
        }}
      >
        {/* Top Action / Wishlist Button */}
        {showWishlistButton && (
          <div
            className="absolute top-3.5 right-3.5 z-10"
            onClick={handleWishlistClick}
          >
            <Button
              type="text"
              shape="circle"
              className="bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm flex items-center justify-center border-0 text-base transition-transform duration-200 hover:scale-110 h-8 w-8"
              icon={
                showRemoveButton || isWishlisted ? (
                  <HeartFilled className="text-brand-red text-base" />
                ) : (
                  <HeartOutlined className="text-gray-400 dark:text-gray-300 hover:text-brand-red text-base" />
                )
              }
              aria-label={
                showRemoveButton || isWishlisted
                  ? "Remove from wishlist"
                  : "Save to wishlist"
              }
            />
          </div>
        )}

        {/* Tutor Identity */}
        <div className="text-center mb-3">
          <Avatar
            size={68}
            src={avatarUrl}
            icon={<UserOutlined />}
            className="bg-gradient-to-br from-brand-green to-emerald-600 shadow-md ring-2 ring-emerald-500/20"
          >
            {tutorName.charAt(0)}
          </Avatar>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2.5 mb-1 truncate px-2">
            {tutorName}
          </h3>
          <div className="flex items-center justify-center gap-1.5 text-amber-500">
            <Rate
              disabled
              allowHalf
              value={ratingValue}
              className="text-xs [&_.ant-rate-star]:mr-0.5"
            />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
              {ratingValue.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              ({reviewsCount})
            </span>
          </div>
        </div>

        {/* Content Info */}
        <div className="space-y-2 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm pt-1 border-t border-gray-50 dark:border-slate-800/80">
              <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                <DollarOutlined className="text-brand-green" /> Rate:
              </span>
              <span className="font-bold text-brand-green dark:text-emerald-400 text-sm">
                ${tutor.hourlyRate || 0}/hr
              </span>
            </div>

            {tutor.experience && (
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-xs">
                <ClockCircleOutlined className="text-brand-green text-xs flex-shrink-0" />
                <span className="truncate">{tutor.experience}</span>
              </div>
            )}

            {tutor.subjects && tutor.subjects.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {tutor.subjects.slice(0, 3).map((subject) => (
                  <Tag
                    key={subject}
                    color="success"
                    className="font-medium text-[11px] px-1.5 py-0 border-0 m-0 bg-emerald-50 dark:bg-emerald-950/40 text-brand-green dark:text-emerald-300 rounded"
                  >
                    {subject}
                  </Tag>
                ))}
                {tutor.subjects.length > 3 && (
                  <Tag className="dark:bg-slate-800 dark:text-gray-400 text-[11px] px-1.5 py-0 border-0 m-0 rounded">
                    +{tutor.subjects.length - 3}
                  </Tag>
                )}
              </div>
            )}

            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[32px] pt-1">
              {tutor.bio || "No description provided."}
            </p>
          </div>

          {/* Action CTA */}
          <div className="pt-3 mt-auto">
            <Button
              type="primary"
              block
              className="bg-brand-green hover:bg-brand-green-hover border-0 text-white font-medium rounded-xl h-9.5 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/tutors/${tutor.id}`);
              }}
            >
              View Profile
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
