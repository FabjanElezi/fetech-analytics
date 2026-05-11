import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import type { Product } from "@/types";

interface Props {
  products: Product[];
  limit?: number;
}

export default function TopProductsTable({ products, limit = 10 }: Props) {
  const displayed = products.slice(0, limit);

  return (
    <div className="overflow-x-auto -mx-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {["#", "Product", "Category", "Revenue", "Units", "Margin", "Return %", "Trend"].map((h) => (
              <th key={h} className="px-6 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayed.map((product, index) => (
            <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="px-6 py-3 text-gray-400 font-medium">{index + 1}</td>
              <td className="px-6 py-3">
                <p className="font-medium text-gray-800">{product.name}</p>
                <p className="text-xs text-gray-400 font-mono">{product.sku}</p>
              </td>
              <td className="px-6 py-3 text-gray-500">{product.category}</td>
              <td className="px-6 py-3 font-semibold text-gray-900">{formatCurrency(product.revenue)}</td>
              <td className="px-6 py-3 text-gray-600">{product.unitsSold.toLocaleString()}</td>
              <td className="px-6 py-3">
                <span className={cn(
                  "font-medium",
                  product.margin > 40 ? "text-emerald-600" :
                  product.margin > 25 ? "text-gray-700" : "text-amber-600"
                )}>
                  {product.margin}%
                </span>
              </td>
              <td className="px-6 py-3">
                <span className={cn(
                  "font-medium text-xs",
                  product.returnRate > 6 ? "text-red-500" :
                  product.returnRate > 3 ? "text-amber-500" : "text-gray-500"
                )}>
                  {product.returnRate}%
                </span>
              </td>
              <td className="px-6 py-3">
                {product.trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                {product.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                {product.trend === "flat" && <Minus className="h-4 w-4 text-slate-400" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
