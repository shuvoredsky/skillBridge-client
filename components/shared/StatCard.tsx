"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface StatCardTrend {
  value: string | number;
  label?: string;
  isPositive?: boolean;
}

export interface StatCardProps {
  title: React.ReactNode;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string | StatCardTrend;
  color?: "emerald" | "blue" | "amber" | "purple" | "red" | string;
  description?: React.ReactNode;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
  emerald: {
    bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    text: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  },
  blue: {
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    text: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
  },
  amber: {
    bg: "bg-amber-50/50 dark:bg-amber-950/20",
    text: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
  },
  purple: {
    bg: "bg-purple-50/50 dark:bg-purple-950/20",
    text: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
  },
  red: {
    bg: "bg-red-50/50 dark:bg-red-950/20",
    text: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400",
  },
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  color = "emerald",
  description,
  suffix,
  prefix,
  footer,
  className = "",
  onClick,
}: StatCardProps) {
  const activeColor = colorMap[color] || colorMap.emerald;

  const renderTrend = () => {
    if (!trend) return null;

    if (typeof trend === "string") {
      return (
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
          {trend}
        </span>
      );
    }

    const isPos = trend.isPositive !== false;
    return (
      <div
        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
          isPos
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
            : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
        }`}
      >
        {isPos ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{trend.value}</span>
        {trend.label && <span className="font-normal opacity-80">{trend.label}</span>}
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        onClick ? "cursor-pointer hover:border-emerald-400/50" : ""
      } ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </span>
          {icon && (
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-200 group-hover:scale-105 ${activeColor.iconBg}`}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          {prefix && <span className="text-lg font-bold text-gray-500 dark:text-gray-400">{prefix}</span>}
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {value}
          </div>
          {suffix && <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{suffix}</span>}
        </div>

        {description && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {description}
          </div>
        )}
      </div>

      {(trend || footer) && (
        <div className="mt-4 pt-3 border-t border-gray-50 dark:border-slate-800/80 flex items-center justify-between gap-2">
          {renderTrend()}
          {footer && <div className="text-xs">{footer}</div>}
        </div>
      )}
    </div>
  );
}
