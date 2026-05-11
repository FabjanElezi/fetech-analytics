"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { CustomerSegment } from "@/types";

interface Props {
  data: CustomerSegment[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as CustomerSegment;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{d.segment}</p>
      <p className="text-gray-500">Customers: <span className="font-medium text-gray-800">{formatNumber(d.count)}</span></p>
      <p className="text-gray-500">Avg LTV: <span className="font-medium text-gray-800">{formatCurrency(d.avgLifetimeValue)}</span></p>
      <p className="text-gray-500">Avg Orders/yr: <span className="font-medium text-gray-800">{d.avgOrderFrequency}</span></p>
    </div>
  );
}

export default function CustomerSegmentChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          outerRadius={95}
          dataKey="count"
          nameKey="segment"
        >
          {data.map((entry) => (
            <Cell key={entry.segment} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12 }}
          formatter={(value) => <span className="text-gray-600">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
