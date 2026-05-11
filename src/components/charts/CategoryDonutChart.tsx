"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { SalesByCategory } from "@/types";

interface Props {
  data: SalesByCategory[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as SalesByCategory;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700">{item.category}</p>
      <p className="text-gray-500 mt-1">
        Revenue: <span className="font-medium text-gray-800">{formatCurrency(item.revenue)}</span>
      </p>
      <p className="text-gray-500">
        Share: <span className="font-medium text-gray-800">{item.percentage}%</span>
      </p>
      <p className="text-gray-500">
        Units: <span className="font-medium text-gray-800">{item.units.toLocaleString()}</span>
      </p>
    </div>
  );
}

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) {
  if (percentage < 6) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${percentage.toFixed(0)}%`}
    </text>
  );
}

export default function CategoryDonutChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={100}
          dataKey="revenue"
          nameKey="category"
          labelLine={false}
          label={CustomLabel}
        >
          {data.map((entry) => (
            <Cell key={entry.category} fill={entry.color} />
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
