"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { CategoryPerformance } from "@/types";

interface Props {
  data: CategoryPerformance[];
  metric: "revenue" | "units" | "avgMargin" | "growth";
}

const metricLabel: Record<Props["metric"], string> = {
  revenue: "Revenue",
  units: "Units Sold",
  avgMargin: "Avg Gross Margin (%)",
  growth: "YoY Growth (%)",
};

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as CategoryPerformance;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{d.category}</p>
      <p className="text-gray-500">Revenue: <span className="font-medium text-gray-800">{formatCurrency(d.revenue)}</span></p>
      <p className="text-gray-500">Units: <span className="font-medium text-gray-800">{d.units.toLocaleString()}</span></p>
      <p className="text-gray-500">Margin: <span className="font-medium text-gray-800">{d.avgMargin}%</span></p>
      <p className="text-emerald-500 font-medium">Growth: +{d.growth}%</p>
    </div>
  );
}

export default function CategoryBarChart({ data, metric }: Props) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-3 pl-1">{metricLabel[metric]}</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            interval={0}
            tickFormatter={(v: string) => v.split(" ")[0]}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              metric === "revenue"
                ? `$${(v / 1_000_000).toFixed(1)}M`
                : metric === "units"
                ? `${(v / 1000).toFixed(0)}K`
                : `${v}%`
            }
            width={44}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={metric} radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry) => (
              <Cell key={entry.category} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
