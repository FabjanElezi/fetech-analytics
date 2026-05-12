"use client";

import { useState, useEffect } from "react";
import { DollarSign, ShoppingCart, Users, TrendingUp, Target, Pencil, Check, Printer } from "lucide-react";
import Header from "@/components/layout/Header";
import KPICard from "@/components/ui/KPICard";
import SectionCard from "@/components/ui/SectionCard";
import InsightBanner from "@/components/ui/InsightBanner";
import HealthScoreCard from "@/components/ui/HealthScoreCard";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import RevenueChart from "@/components/charts/RevenueChart";
import CategoryDonutChart from "@/components/charts/CategoryDonutChart";
import RegionBarChart from "@/components/charts/RegionBarChart";
import RecentOrdersTable from "@/components/tables/RecentOrdersTable";
import { useData } from "@/context/DataContext";
import { useDateRange } from "@/context/DateRangeContext";
import { getOverviewInsights, getHealthScore } from "@/lib/insightEngine";
import { cn } from "@/lib/utils";

const GOAL_KEY = "fetech_revenue_goal";

function GoalTracker({ revenue }: { revenue: number }) {
  const [goal, setGoal] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(GOAL_KEY);
    if (saved) setGoal(Number(saved));
  }, []);

  function save() {
    const val = parseFloat(draft.replace(/[,$\s]/g, ""));
    if (!isNaN(val) && val > 0) {
      setGoal(val);
      localStorage.setItem(GOAL_KEY, String(val));
    }
    setEditing(false);
  }

  const pct = goal ? Math.min((revenue / goal) * 100, 100) : 0;
  const over = goal ? revenue > goal : false;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/30">
            <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">Revenue Goal</p>
        </div>
        <button
          onClick={() => { setDraft(goal ? String(goal) : ""); setEditing(true); }}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <Pencil className="h-3 w-3" />
          {goal ? "Edit" : "Set goal"}
        </button>
      </div>

      {editing ? (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-500 dark:text-slate-400">$</span>
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
            placeholder="e.g. 5000000"
            className="flex-1 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-3 py-1.5 text-sm text-gray-800 dark:text-slate-200 outline-none focus:border-indigo-400"
          />
          <button onClick={save} className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
            <Check className="h-4 w-4" />
          </button>
        </div>
      ) : goal ? (
        <div className="space-y-2">
          <div className="flex items-end justify-between text-xs">
            <span className="text-gray-500 dark:text-slate-400">
              ${revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} of ${goal.toLocaleString(undefined, { maximumFractionDigits: 0 })} target
            </span>
            <span className={cn("font-semibold", over ? "text-emerald-600" : "text-indigo-600 dark:text-indigo-400")}>
              {pct.toFixed(1)}%
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", over ? "bg-emerald-500" : "bg-indigo-600")}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 dark:text-slate-500">
            {over
              ? `Goal reached! +$${(revenue - goal).toLocaleString(undefined, { maximumFractionDigits: 0 })} above target`
              : `$${(goal - revenue).toLocaleString(undefined, { maximumFractionDigits: 0 })} remaining`}
          </p>
        </div>
      ) : (
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
          Set a revenue target to track your progress here.
        </p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoaded } = useData();
  const { filterMonths, rangeLabel, range } = useDateRange();

  const filteredMonths = filterMonths(data.monthlyRevenue);
  const totalRevenue = filteredMonths.reduce((s, m) => s + m.revenue, 0);
  const totalRevenuePrev = filteredMonths.reduce((s, m) => s + m.prevYearRevenue, 0);
  const totalOrders = filteredMonths.reduce((s, m) => s + m.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalCustomers = data.customerSegments.reduce((s, c) => s + c.count, 0);
  const prevCustomers = Math.round(totalCustomers * 0.87);
  const periodLabel = range === "all" ? data.period : rangeLabel;

  const insights = getOverviewInsights(data);
  const healthScore = getHealthScore(data);

  if (!isLoaded) {
    return (
      <>
        <Header title="Overview" subtitle="Loading your data…" />
        <DashboardSkeleton />
      </>
    );
  }

  return (
    <>
      <Header
        title="Overview"
        subtitle={`Retail performance summary — ${periodLabel}${data.isCustomData ? ` · ${data.companyName}` : ""}`}
        action={
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        }
      />

      <div className="flex-1 p-4 sm:p-8 space-y-6 sm:space-y-8">
        {/* KPI + Goal row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard label="Total Revenue"    value={totalRevenue}    previousValue={totalRevenuePrev} format="currency" icon={DollarSign}  iconColor="bg-indigo-50 text-indigo-600" />
          <KPICard label="Total Orders"     value={totalOrders}     previousValue={Math.round(totalOrders * 0.89)} format="number" icon={ShoppingCart} iconColor="bg-violet-50 text-violet-600" />
          <KPICard label="Avg Order Value"  value={avgOrderValue}   previousValue={avgOrderValue * 0.96} format="currency" icon={TrendingUp} iconColor="bg-cyan-50 text-cyan-600" decimals={0} />
          <KPICard label="Active Customers" value={totalCustomers}  previousValue={prevCustomers} format="number" icon={Users} iconColor="bg-emerald-50 text-emerald-600" />
        </div>

        {/* Goal tracker */}
        <GoalTracker revenue={totalRevenue} />

        {/* Insights + Health Score */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <InsightBanner insights={insights} title="Performance Insights" />
          </div>
          <HealthScoreCard healthScore={healthScore} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard title="Monthly Revenue — YoY Comparison" subtitle="Current year vs previous year" className="xl:col-span-2">
            <RevenueChart data={filteredMonths} />
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
                <div key={r.region} className="flex items-center justify-between text-xs px-2 py-1.5 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <span className="text-gray-600 dark:text-slate-300 font-medium">{r.region}</span>
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
