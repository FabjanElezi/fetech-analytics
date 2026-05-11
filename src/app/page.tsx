"use client";

import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import Header from "@/components/layout/Header";
import KPICard from "@/components/ui/KPICard";
import SectionCard from "@/components/ui/SectionCard";
import InsightBanner from "@/components/ui/InsightBanner";
import HealthScoreCard from "@/components/ui/HealthScoreCard";
import RevenueChart from "@/components/charts/RevenueChart";
import CategoryDonutChart from "@/components/charts/CategoryDonutChart";
import RegionBarChart from "@/components/charts/RegionBarChart";
import RecentOrdersTable from "@/components/tables/RecentOrdersTable";
import { useData } from "@/context/DataContext";
import { getOverviewInsights, getHealthScore } from "@/lib/insightEngine";

export default function DashboardPage() {
  const { data } = useData();

  const totalRevenue = data.monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalRevenuePrev = data.monthlyRevenue.reduce((s, m) => s + m.prevYearRevenue, 0);
  const totalOrders = data.monthlyRevenue.reduce((s, m) => s + m.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalCustomers = data.customerSegments.reduce((s, c) => s + c.count, 0);
  const prevCustomers = Math.round(totalCustomers * 0.87);

  const insights = getOverviewInsights(data);
  const healthScore = getHealthScore(data);

  return (
    <>
      <Header
        title="Overview"
        subtitle={`Retail performance summary — ${data.period}${data.isCustomData ? ` · ${data.companyName}` : ""}`}
      />

      <div className="flex-1 p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard label="Total Revenue"    value={totalRevenue}    previousValue={totalRevenuePrev} format="currency" icon={DollarSign}  iconColor="bg-indigo-50 text-indigo-600" />
          <KPICard label="Total Orders"     value={totalOrders}     previousValue={Math.round(totalOrders * 0.89)} format="number" icon={ShoppingCart} iconColor="bg-violet-50 text-violet-600" />
          <KPICard label="Avg Order Value"  value={avgOrderValue}   previousValue={avgOrderValue * 0.96} format="currency" icon={TrendingUp} iconColor="bg-cyan-50 text-cyan-600" decimals={0} />
          <KPICard label="Active Customers" value={totalCustomers}  previousValue={prevCustomers} format="number" icon={Users} iconColor="bg-emerald-50 text-emerald-600" />
        </div>

        {/* Insights + Health Score */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <InsightBanner insights={insights} title="Performance Insights" />
          </div>
          <HealthScoreCard healthScore={healthScore} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard title="Monthly Revenue — YoY Comparison" subtitle="Current year vs previous year" className="xl:col-span-2">
            <RevenueChart data={data.monthlyRevenue} />
          </SectionCard>
          <SectionCard title="Revenue by Category" subtitle="Share of total revenue">
            <CategoryDonutChart data={data.salesByCategory} />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard title="Revenue by Region" subtitle="YoY growth % per region">
            <RegionBarChart data={data.salesByRegion} />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {data.salesByRegion.map((r) => (
                <div key={r.region} className="flex items-center justify-between text-xs px-2 py-1.5 bg-slate-50 rounded-lg">
                  <span className="text-gray-600 font-medium">{r.region}</span>
                  <span className={r.growth >= 0 ? "text-emerald-600 font-semibold" : "text-red-500 font-semibold"}>
                    {r.growth >= 0 ? "+" : ""}{r.growth}%
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Recent Orders"
            subtitle="Last 10 transactions"
            className="xl:col-span-2"
            action={<span className="text-xs text-indigo-500 font-medium cursor-pointer hover:underline">View all</span>}
          >
            <RecentOrdersTable orders={data.recentOrders} />
          </SectionCard>
        </div>
      </div>
    </>
  );
}
