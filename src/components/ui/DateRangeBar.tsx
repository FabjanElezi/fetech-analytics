"use client";

import { CalendarDays } from "lucide-react";
import { useDateRange, type DateRangePreset } from "@/context/DateRangeContext";
import { cn } from "@/lib/utils";

const PRESETS: { label: string; value: DateRangePreset }[] = [
  { label: "All time",    value: "all" },
  { label: "Last 3M",    value: "3m"  },
  { label: "Last 12M",   value: "12m" },
  { label: "Year to date",value: "ytd" },
];

export default function DateRangeBar() {
  const { range, setRange } = useDateRange();

  return (
    <div
      data-print-hide
      className="flex items-center gap-2 px-4 sm:px-8 py-2 bg-gray-50 dark:bg-slate-900/80 border-b border-gray-100 dark:border-slate-800"
    >
      <CalendarDays className="h-3.5 w-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
      <span className="text-xs text-gray-400 dark:text-slate-500 mr-0.5 shrink-0 hidden sm:inline">Period:</span>
      <div className="flex gap-1">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => setRange(p.value)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              range === p.value
                ? "bg-indigo-600 text-white"
                : "text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
