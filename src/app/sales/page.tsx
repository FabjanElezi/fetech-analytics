"use client";

import { DollarSign, ShoppingCart, RotateCcw, Percent } from "lucide-react";
import Header from "@/components/layout/Header";
import KPICard from "@/components/ui/KPICard";
import SectionCard from "@/components/ui/SectionCard";
import InsightBanner from "@/components/ui/InsightBanner";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import RevenueChart from "@/components/charts/RevenueChart";
import DailySalesChart from "@/components/charts/DailySalesChart";
import RegionBarChart from "@/components/charts/RegionBarChart";
import CategoryDonutChart from "@/components/charts/CategoryDonutChart";
import { formatCurrency } from "@/lib/utils";
import { useData } from "@/context/DataContext";
import { getSalesInsights } from "@/lib/insightEngine";

export default function SalesPage() {
  const { data, isLoaded } = useData();
  if (!isLoaded) return <><Header title="Sales" /><DashboardSkeleton /></>;

  const totalRevenue = data.monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalRevenuePrev = data.monthlyRevenue.reduce((s, m) => s + m.prevYearRevenue, 0);
  const totalOrders = data.monthlyRevenue.reduce((s, m) => s + m.orders, 0);
  const returnValue = data.dailySales.reduce((s, d) => s + d.returns, 0) * 12;
  const grossMarginPct = 38.2;

  const insights = getSalesInsights(data);

  return (
    <>
      <Header
        title="Sales Analytics"
        subtitle={`Revenue trends, channel performance, and regional breakdown${data.isCustomData ? ` · ${data.companyName}` : ""}`}
      />

      <div className="flex-1 p-4 sm:p-8 space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard label="Total Revenue"  value={totalRevenue}    previousValue={totalRevenuePrev}           format="currency" icon={DollarSign}  iconColor="bg-indigo-50 text-indigo-600" />
          <KPICard label="Total Orders"   value={totalOrders}     previousValue={Math.round(totalOrders * 0.89)} format="number" icon={ShoppingCart} iconColor="bg-violet-50 text-violet-600" />
          <KPICard label="Returns Value"  value={returnValue}     previousValue={returnValue * 1.08}         format="currency" icon={RotateCcw}    iconColor="bg-red-50 text-red-500" inverseColor />
          <KPICard label="Gross Margin"   value={grossMarginPct}  previousValue={36.9}                       format="percent"  icon={Percent}      iconColor="bg-emerald-50 text-emerald-600" decimals={1} />
        </div>

        <InsightBanner insights={insights} title="Sales Insights" />

        <SectionCard title="Monthly Revenue — YoY Comparison" subtitle="Current year vs previous year">
          <RevenueChart data={data.monthlyRevenue} />
        </SectionCard>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SectionCard title="Daily Revenue — Last 30 Days" subtitle="Rolling daily sales trend">
            <DailySalesChart data={data.dailySales} />
          </SectionCard>
          <SectionCard title="Revenue by Region" subtitle="YoY growth rate per region">
            <RegionBarChart data={data.salesByRegion} />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SectionCard title="Sales by Channel" subtitle="Revenue share per sales channel">
            <div className="space-y-4">
              {data.salesByChannel.map((ch) => (
                <div key={ch.channel}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <span className="font-medium text-gray-700">{ch.channel}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">{ch.orders.toLocaleString()} orders</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(ch.revenue)}</span>
                      <span className="text-xs font-medium text-indigo-600 w-10 text-right">{ch.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${ch.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Revenue by Category" subtitle="Share of annual revenue">
            <CategoryDonutChart data={data.salesByCategory} />
          </SectionCard>
        </div>
      </div>
    </>
  );
}
