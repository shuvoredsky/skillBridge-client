"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "antd";
import { getImageUrl } from "@/lib/getImageUrl";

interface FeaturedTutorCardProps {
  tutor: any;
  index: number;
}

function FeaturedTutorCard({ tutor, index }: FeaturedTutorCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const avatarUrl = getImageUrl(tutor.profilePhoto || tutor.user.image);

  return (
    <div
      ref={cardRef}
      style={{ transitionDelay: `${(index % 4) * 100}ms` }}
      className={`bg-slate-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-2xl p-4 shadow-sm hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.25)] hover:border-emerald-400/50 dark:hover:border-emerald-500/40 hover:-translate-y-1 flex flex-col text-center transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      <div className="mb-3 flex justify-center">
        <div className="relative rounded-full overflow-hidden w-16 h-16 bg-indigo-600 flex items-center justify-center text-white text-2xl font-semibold">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={tutor.user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            tutor.user.name.charAt(0)
          )}
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
        {tutor.user.name}
      </h3>
      <div className="flex items-center justify-center gap-1 mb-3 text-amber-500">
        <span className="text-sm font-semibold">★ {tutor.rating.toFixed(1)}</span>
        <span className="text-gray-400 dark:text-gray-500">({tutor.totalReviews})</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 min-h-[48px]">
        {tutor.bio || "No description provided."}
      </p>
      <div className="mt-auto border-t border-gray-100 dark:border-slate-700 pt-3 flex justify-between items-center">
        <span className="text-brand-green font-bold">
          ${tutor.hourlyRate}/hr
        </span>
        <Link href={`/tutors/${tutor.id}`}>
          <Button type="primary" className="bg-brand-green hover:bg-brand-green-hover border-0 text-white">
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}

interface FeaturedTutorsSectionProps {
  featuredTutors: any[];
}

export default function FeaturedTutorsSection({
  featuredTutors,
}: FeaturedTutorsSectionProps) {
  if (featuredTutors.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        No featured tutors available at the moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredTutors.map((tutor: any, index: number) => (
        <FeaturedTutorCard key={tutor.id} tutor={tutor} index={index} />
      ))}
    </div>
  );
}
