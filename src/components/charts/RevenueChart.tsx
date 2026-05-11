"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { MonthlyRevenue } from "@/types";

interface Props {
  data: MonthlyRevenue[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-2">{label} 2024</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-gray-500">{entry.name}</span>
          </span>
          <span className="font-medium text-gray-800">
            {entry.dataKey === "avgOrderValue"
              ? formatCurrency(entry.value)
              : entry.dataKey === "orders"
              ? entry.value.toLocaleString()
              : formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RevenueChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="revenue"
          orientation="left"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
          width={52}
        />
        <YAxis
          yAxisId="prevRevenue"
          orientation="left"
          hide
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
          iconType="circle"
          iconSize={8}
        />
        {/* Previous year bars (muted) for YoY comparison */}
        <Bar
          yAxisId="prevRevenue"
          dataKey="prevYearRevenue"
          name="2023 Revenue"
          fill="#e2e8f0"
          radius={[3, 3, 0, 0]}
          maxBarSize={28}
        />
        {/* Current year bars */}
        <Bar
          yAxisId="revenue"
          dataKey="revenue"
          name="2024 Revenue"
          fill="#6366f1"
          radius={[3, 3, 0, 0]}
          maxBarSize={28}
        />
        {/* AOV as a line overlay */}
        <Line
          yAxisId="revenue"
          type="monotone"
          dataKey="avgOrderValue"
          name="Avg Order Value"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={false}
          hide
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
