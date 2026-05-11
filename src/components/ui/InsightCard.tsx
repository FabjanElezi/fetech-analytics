"use client";

import { TrendingUp, AlertTriangle, Lightbulb, AlertCircle, ArrowRight } from "lucide-react";
import type { Insight, InsightType } from "@/lib/insightEngine";
import { cn } from "@/lib/utils";

const CONFIG: Record<InsightType, {
  icon: React.ElementType;
  border: string;
  bg: string;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeText: string;
  label: string;
}> = {
  positive: {
    icon: TrendingUp,
    border: "border-emerald-200",
    bg: "bg-emerald-50/60",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    badgeText: "Positive",
    label: "positive",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-200",
    bg: "bg-amber-50/60",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    badgeText: "Watch",
    label: "warning",
  },
  opportunity: {
    icon: Lightbulb,
    border: "border-blue-200",
    bg: "bg-blue-50/60",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    badgeText: "Opportunity",
    label: "opportunity",
  },
  critical: {
    icon: AlertCircle,
    border: "border-red-200",
    bg: "bg-red-50/60",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    badge: "bg-red-100 text-red-700",
    badgeText: "Action Required",
    label: "critical",
  },
};

interface InsightCardProps {
  insight: Insight;
  className?: string;
}

export default function InsightCard({ insight, className }: InsightCardProps) {
  const c = CONFIG[insight.type];
  const Icon = c.icon;

  return (
    <div className={cn("rounded-xl border p-4 flex flex-col gap-3", c.border, c.bg, className)}>
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", c.iconBg)}>
          <Icon className={cn("h-4 w-4", c.iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={cn("text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5", c.badge)}>
              {c.badgeText}
            </span>
            {insight.metric && (
              <span className="text-[11px] font-bold text-gray-700 dark:text-slate-200 bg-white/70 dark:bg-slate-700/70 rounded-full px-2 py-0.5 border border-gray-200 dark:border-slate-600">
                {insight.metric}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 leading-snug">{insight.title}</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">{insight.description}</p>

      <div className="flex items-start gap-1.5 pt-1 border-t border-black/5 dark:border-white/5">
        <ArrowRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-gray-400" />
        <p className="text-xs font-medium text-gray-700 dark:text-slate-300 leading-snug">{insight.action}</p>
      </div>
    </div>
  );
}
