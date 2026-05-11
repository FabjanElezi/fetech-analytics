"use client";

import { Calendar, RefreshCw } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <header data-print-hide className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>FY 2024 (Jan – Dec)</span>
        </div>

        <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>

        {action}
      </div>
    </header>
  );
}
