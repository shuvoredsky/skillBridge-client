"use client";

import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export default function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3">
            <Link href="/" className="hover:text-brand-green dark:hover:text-brand-green transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center space-x-2">
                <span className="text-gray-400">/</span>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-brand-green dark:hover:text-brand-green transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-800 dark:text-gray-200 font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-3xl">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
