"use client";

import type { Insight } from "@/lib/insightEngine";
import InsightCard from "./InsightCard";

interface InsightBannerProps {
  insights: Insight[];
  title?: string;
}

export default function InsightBanner({ insights, title = "Business Insights" }: InsightBannerProps) {
  if (insights.length === 0) return null;

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">{title}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}
