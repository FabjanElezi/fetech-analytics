"use client";

import type { HealthScore } from "@/lib/insightEngine";
import { cn } from "@/lib/utils";

function scoreColor(score: number): string {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 55) return "bg-amber-400";
  return "bg-red-500";
}

function scoreLabel(score: number): { text: string; color: string } {
  if (score >= 75) return { text: "Healthy",  color: "text-emerald-600" };
  if (score >= 55) return { text: "Fair",     color: "text-amber-600"  };
  return               { text: "At Risk",  color: "text-red-600"    };
}

function statusDot(status: "good" | "ok" | "poor"): string {
  if (status === "good") return "bg-emerald-500";
  if (status === "ok")   return "bg-amber-400";
  return "bg-red-500";
}

interface HealthScoreCardProps {
  healthScore: HealthScore;
}

export default function HealthScoreCard({ healthScore }: HealthScoreCardProps) {
  const { text, color } = scoreLabel(healthScore.overall);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col gap-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Business Health Score</p>
          <p className="text-xs text-gray-500">Composite score across 5 weighted dimensions</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-black text-gray-900 leading-none">{healthScore.overall}</p>
          <p className={cn("text-xs font-semibold mt-0.5", color)}>{text}</p>
        </div>
      </div>

      {/* Overall bar */}
      <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", scoreColor(healthScore.overall))}
          style={{ width: `${healthScore.overall}%` }}
        />
      </div>

      {/* Dimension bars */}
      <div className="space-y-3">
        {healthScore.dimensions.map((dim) => (
          <div key={dim.label}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusDot(dim.status))} />
                <span className="text-xs font-medium text-gray-700">{dim.label}</span>
                <span className="text-[10px] text-gray-400">({Math.round(dim.weight * 100)}%)</span>
              </div>
              <span className="text-xs font-bold text-gray-800">{dim.score}</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", scoreColor(dim.score))}
                style={{ width: `${dim.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-gray-400 leading-relaxed border-t border-gray-100 pt-3">
        Dimensions weighted by business impact: Revenue Growth (30%), Gross Margin (25%), Customer Retention (20%), Customer Risk (15%), Return Rate (10%).
      </p>
    </div>
  );
}
