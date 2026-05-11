import { cn, formatCurrency } from "@/lib/utils";
import type { RecentOrder } from "@/types";

interface Props {
  orders: RecentOrder[];
}

const statusConfig: Record<RecentOrder["status"], { label: string; className: string }> = {
  completed:  { label: "Completed",  className: "bg-emerald-50 text-emerald-700" },
  processing: { label: "Processing", className: "bg-blue-50 text-blue-700"       },
  returned:   { label: "Returned",   className: "bg-amber-50 text-amber-700"     },
  cancelled:  { label: "Cancelled",  className: "bg-red-50 text-red-600"         },
};

export default function RecentOrdersTable({ orders }: Props) {
  return (
    <div className="overflow-x-auto -mx-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {["Order ID", "Customer", "Product", "Amount", "Channel", "Status", "Date"].map((h) => (
              <th key={h} className="px-6 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const { label, className } = statusConfig[order.status];
            return (
              <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 font-mono text-xs text-indigo-600">{order.id}</td>
                <td className="px-6 py-3 font-medium text-gray-800">{order.customer}</td>
                <td className="px-6 py-3 text-gray-600 max-w-[180px] truncate">{order.product}</td>
                <td className="px-6 py-3 font-semibold text-gray-900">{formatCurrency(order.amount)}</td>
                <td className="px-6 py-3">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium",
                    order.channel === "online" ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-600"
                  )}>
                    {order.channel === "online" ? "Online" : "In-Store"}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium", className)}>
                    {label}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-400 text-xs">{order.date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
