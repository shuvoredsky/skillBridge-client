"use client";

import { Card } from "antd";

interface TutorCardSkeletonProps {
  count?: number;
  className?: string;
}

export function SingleTutorCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <Card
      className={`h-full flex flex-col justify-between rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden animate-pulse ${className}`}
      styles={{
        body: {
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
      }}
    >
      {/* Top Identity Skeleton */}
      <div className="flex flex-col items-center mb-3">
        {/* Avatar Circle */}
        <div className="w-[68px] h-[68px] rounded-full bg-slate-200 dark:bg-slate-800 mb-2.5" />
        {/* Name Bar */}
        <div className="w-28 h-4 bg-slate-200 dark:bg-slate-800 rounded-md mb-2" />
        {/* Rating Bar */}
        <div className="w-20 h-3 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>

      {/* Content Info Skeleton */}
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5 pt-1">
          {/* Rate row */}
          <div className="flex justify-between items-center pt-1 border-t border-gray-100 dark:border-slate-800/80">
            <div className="w-12 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-16 h-3.5 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>

          {/* Experience row */}
          <div className="w-32 h-3 bg-slate-200 dark:bg-slate-800 rounded" />

          {/* Subject Pills */}
          <div className="flex gap-1.5 pt-1">
            <div className="w-14 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>

          {/* Bio text lines */}
          <div className="space-y-1.5 pt-1">
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-3/4 h-2.5 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>

        {/* Action Button Skeleton */}
        <div className="pt-3 mt-auto">
          <div className="w-full h-9 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </Card>
  );
}

export default function TutorCardSkeleton({
  count = 6,
  className = "",
}: TutorCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={className}>
          <SingleTutorCardSkeleton />
        </div>
      ))}
    </>
  );
}
