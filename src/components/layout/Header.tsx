"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function Header({ title, subtitle, action }: HeaderProps) {
  const { toggle } = useSidebar();

  return (
    <header
      data-print-hide
      className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shrink-0"
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          className="lg:hidden text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors shrink-0"
          onClick={toggle}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action && (
        <div className="flex items-center gap-2 shrink-0 ml-4">{action}</div>
      )}
    </header>
  );
}
