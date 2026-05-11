import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatCurrency, formatNumber, formatPercent, calcPercentChange } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  label: string;
  value: number;
  previousValue?: number;
  format?: "currency" | "number" | "percent";
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  iconColor?: string;
  inverseColor?: boolean;  // true = lower is better (e.g. returns, churn)
  decimals?: number;
}

function formatValue(
  value: number,
  format: KPICardProps["format"],
  prefix?: string,
  suffix?: string,
  decimals = 0
): string {
  if (format === "currency") return formatCurrency(value, true);
  if (format === "percent") return `${value.toFixed(decimals)}%`;
  if (format === "number") return formatNumber(value, true);
  return `${prefix ?? ""}${value.toFixed(decimals)}${suffix ?? ""}`;
}

export default function KPICard({
  label,
  value,
  previousValue,
  format = "number",
  prefix,
  suffix,
  icon: Icon,
  iconColor = "bg-indigo-50 text-indigo-600",
  inverseColor = false,
  decimals = 0,
}: KPICardProps) {
  const change = previousValue !== undefined ? calcPercentChange(value, previousValue) : null;
  const isPositive = change !== null && change > 0;
  const isNegative = change !== null && change < 0;

  const trendColorClass =
    change === null
      ? ""
      : inverseColor
      ? isPositive
        ? "text-red-500"
        : isNegative
        ? "text-emerald-500"
        : "text-slate-400"
      : isPositive
      ? "text-emerald-500"
      : isNegative
      ? "text-red-500"
      : "text-slate-400";

  const TrendIcon =
    change === null ? null : isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">
            {formatValue(value, format, prefix, suffix, decimals)}
          </p>
          {change !== null && (
            <div className={cn("flex items-center gap-1 mt-2 text-sm font-medium", trendColorClass)}>
              {TrendIcon && <TrendIcon className="h-4 w-4" />}
              <span>{formatPercent(change)}</span>
              <span className="text-gray-400 font-normal">vs last year</span>
            </div>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
