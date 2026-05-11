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
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { SalesByRegion } from "@/types";

interface Props {
  data: SalesByRegion[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as SalesByRegion;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{d.region}</p>
      <p className="text-gray-500">Revenue: <span className="font-medium text-gray-800">{formatCurrency(d.revenue)}</span></p>
      <p className="text-gray-500">Orders: <span className="font-medium text-gray-800">{d.orders.toLocaleString()}</span></p>
      <p className="text-emerald-500 font-medium">YoY Growth: {formatPercent(d.growth)}</p>
    </div>
  );
}

export default function RegionBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
        />
        <YAxis
          dataKey="region"
          type="category"
          tick={{ fontSize: 12, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
          width={70}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="revenue" radius={[0, 4, 4, 0]} maxBarSize={22}>
          {data.map((entry, index) => (
            <Cell key={entry.region} fill={index === 0 ? "#6366f1" : "#a5b4fc"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
