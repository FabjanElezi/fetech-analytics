"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { ForecastPoint } from "@/types";

interface Props {
  data: ForecastPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const isProjected = payload[0]?.payload?.isProjected;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm min-w-[180px]">
      <p className="font-semibold text-gray-700 mb-2">
        {label}
        {isProjected && (
          <span className="ml-2 text-[10px] font-medium bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
            Projected
          </span>
        )}
      </p>
      {payload.map((entry: any) => {
        if (entry.value == null || entry.dataKey === "confidenceBand") return null;
        return (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
              <span className="text-gray-500">{entry.name}</span>
            </span>
            <span className="font-medium text-gray-800">{formatCurrency(entry.value)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ForecastChart({ data }: Props) {
  // Convert to [lowerBound, upperBound] band for the Area component
  const chartData = data.map((d) => ({
    ...d,
    confidenceBand: [d.lowerBound, d.upperBound] as [number, number],
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="period"
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          interval={1}
          angle={-35}
          textAnchor="end"
          height={48}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
          width={52}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />

        {/* 90% confidence interval band */}
        <Area
          type="monotone"
          dataKey="upperBound"
          name="Upper Bound"
          stroke="transparent"
          fill="url(#ciGrad)"
          strokeWidth={0}
          legendType="none"
        />
        <Area
          type="monotone"
          dataKey="lowerBound"
          name="Lower Bound"
          stroke="transparent"
          fill="white"
          strokeWidth={0}
          legendType="none"
        />

        {/* Dividing line between historical and projected */}
        <ReferenceLine
          x="Dec 2024"
          stroke="#e2e8f0"
          strokeDasharray="4 4"
          label={{ value: "Forecast →", position: "insideTopRight", fontSize: 11, fill: "#94a3b8" }}
        />

        {/* Forecast line (covers both historical fit + projection) */}
        <Line
          type="monotone"
          dataKey="forecast"
          name="Forecast"
          stroke="#6366f1"
          strokeWidth={2}
          strokeDasharray="5 3"
          dot={false}
        />

        {/* Actual revenue line */}
        <Line
          type="monotone"
          dataKey="actual"
          name="Actual Revenue"
          stroke="#10b981"
          strokeWidth={2.5}
          dot={{ fill: "#10b981", r: 3 }}
          activeDot={{ r: 5 }}
          connectNulls={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
