"use client";

import React from "react";

export default function TutorDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors duration-200 animate-pulse">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button Skeleton */}
        <div className="h-10 w-36 bg-gray-200 dark:bg-slate-800 rounded-lg mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Tutor Profile Card Skeleton */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-slate-800 mb-4" />
                <div className="h-7 w-48 bg-gray-200 dark:bg-slate-800 rounded-md mb-2" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded-md mb-4" />
              </div>

              <div className="h-px bg-gray-100 dark:bg-slate-800 my-4" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-slate-800 rounded" />
                  <div className="h-6 w-16 bg-gray-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="h-4 w-36 bg-gray-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-40 bg-gray-200 dark:bg-slate-800 rounded" />
              </div>

              <div className="h-px bg-gray-100 dark:bg-slate-800 my-4" />

              <div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-slate-800 rounded mb-3" />
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-6 w-20 bg-gray-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-6 w-14 bg-gray-200 dark:bg-slate-800 rounded-full" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <div className="h-12 flex-1 bg-gray-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-12 w-12 bg-gray-200 dark:bg-slate-800 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Right Column: About & Reviews Skeleton */}
          <div className="lg:col-span-8 space-y-6">
            {/* About Me Skeleton */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="h-6 w-32 bg-gray-200 dark:bg-slate-800 rounded-md mb-4" />
              <div className="space-y-2.5">
                <div className="h-4 w-full bg-gray-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-4/6 bg-gray-200 dark:bg-slate-800 rounded" />
              </div>
            </div>

            {/* Student Reviews Skeleton */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 w-40 bg-gray-200 dark:bg-slate-800 rounded-md" />
                <div className="h-6 w-24 bg-gray-200 dark:bg-slate-800 rounded-md" />
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border-b border-gray-100 dark:border-slate-800 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-800 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="h-4 w-28 bg-gray-200 dark:bg-slate-800 rounded" />
                          <div className="h-3 w-20 bg-gray-200 dark:bg-slate-800 rounded" />
                        </div>
                        <div className="h-3 w-24 bg-gray-200 dark:bg-slate-800 rounded" />
                        <div className="h-4 w-full bg-gray-200 dark:bg-slate-800 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
