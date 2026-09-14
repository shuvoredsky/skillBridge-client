"use client";

import { useSiteConfig } from "@/context/SiteConfigContext";
import { getImageUrl } from "@/lib/getImageUrl";
import { BookOutlined } from "@ant-design/icons";

interface LogoSpinnerProps {
  fullscreen?: boolean;
  tip?: string;
  size?: "small" | "default" | "large";
}

export default function LogoSpinner({
  fullscreen = false,
  tip = "Loading...",
  size = "default",
}: LogoSpinnerProps) {
  const { logoUrl, siteName } = useSiteConfig();
  const resolvedLogo = getImageUrl(logoUrl);

  const sizeClasses = {
    small: "w-10 h-10",
    default: "w-16 h-16",
    large: "w-20 h-20",
  }[size];

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        {/* Subtle animated dashed accent ring */}
        <div className="absolute -inset-3 rounded-2xl border-2 border-dashed border-brand-green/40 dark:border-brand-green/60 animate-spin [animation-duration:8s]" />
        
        {/* Dynamic logo or fallback icon container */}
        <div className={`relative ${sizeClasses} flex items-center justify-center transition-all duration-300 animate-pulse`}>
          {resolvedLogo ? (
            <img
              src={resolvedLogo}
              alt={siteName || "SkillBridge"}
              className="w-full h-full object-contain rounded-xl shadow-sm"
            />
          ) : (
            <div className="w-full h-full bg-brand-green rounded-xl flex items-center justify-center shadow-md">
              <BookOutlined className="text-white text-2xl" />
            </div>
          )}
        </div>
      </div>

      {tip && (
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse tracking-wide">
          {tip}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm transition-colors duration-200">
        {content}
      </div>
    );
  }

  return <div className="py-12 flex items-center justify-center">{content}</div>;
}
