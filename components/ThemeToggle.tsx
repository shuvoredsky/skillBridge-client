"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-200 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-500 transition-transform duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 transition-transform duration-300" />
      )}
    </button>
  );
}
