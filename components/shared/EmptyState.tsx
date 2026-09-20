"use client";

import React from "react";
import { Button } from "antd";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function EmptyState({
  icon,
  title = "No data available",
  description,
  actionLabel,
  onAction,
  className = "",
  children,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 transition-colors duration-200 ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-brand-green dark:text-emerald-400 mb-4 shadow-sm">
        {icon || <Inbox size={28} />}
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed mb-6">
          {description}
        </p>
      )}

      {children && <div className="mb-6">{children}</div>}

      {actionLabel && onAction && (
        <Button
          type="primary"
          size="large"
          onClick={onAction}
          className="bg-brand-green hover:bg-brand-green-hover border-0 text-white font-semibold rounded-xl h-11 px-6 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
