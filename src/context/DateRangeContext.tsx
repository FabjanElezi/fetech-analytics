"use client";

import { createContext, useContext, useState } from "react";
import type { MonthlyRevenue } from "@/types";

export type DateRangePreset = "all" | "3m" | "12m" | "ytd";

interface DateRangeContextValue {
  range: DateRangePreset;
  setRange: (r: DateRangePreset) => void;
  filterMonths: (months: MonthlyRevenue[]) => MonthlyRevenue[];
  rangeLabel: string;
}

const DateRangeContext = createContext<DateRangeContextValue>({
  range: "all",
  setRange: () => {},
  filterMonths: (m) => m,
  rangeLabel: "All time",
});

const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function toDate(m: MonthlyRevenue): Date {
  return new Date(m.year, MONTH_SHORT.indexOf(m.month), 1);
}

const LABELS: Record<DateRangePreset, string> = {
  all:  "All time",
  "3m": "Last 3 months",
  "12m":"Last 12 months",
  ytd:  "Year to date",
};

export function DateRangeProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<DateRangePreset>("all");

  function filterMonths(months: MonthlyRevenue[]): MonthlyRevenue[] {
    if (range === "all" || months.length === 0) return months;

    const sorted = [...months].sort((a, b) => toDate(a).getTime() - toDate(b).getTime());
    const latestDate = toDate(sorted[sorted.length - 1]);

    if (range === "3m") {
      return sorted.slice(-3);
    }
    if (range === "12m") {
      return sorted.slice(-12);
    }
    if (range === "ytd") {
      const year = latestDate.getFullYear();
      return sorted.filter((m) => m.year === year);
    }
    return months;
  }

  return (
    <DateRangeContext.Provider value={{ range, setRange, filterMonths, rangeLabel: LABELS[range] }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange(): DateRangeContextValue {
  return useContext(DateRangeContext);
}
