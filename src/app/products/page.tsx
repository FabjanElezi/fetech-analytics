"use client";

import { Package, DollarSign, Percent, RotateCcw } from "lucide-react";
import Header from "@/components/layout/Header";
import KPICard from "@/components/ui/KPICard";
import SectionCard from "@/components/ui/SectionCard";
import InsightBanner from "@/components/ui/InsightBanner";
import CategoryBarChart from "@/components/charts/CategoryBarChart";
import TopProductsTable from "@/components/tables/TopProductsTable";
import { useData } from "@/context/DataContext";
import { getProductInsights } from "@/lib/insightEngine";

export default function ProductsPage() {
  const { data } = useData();

  const totalRevenue = data.topProducts.reduce((s, p) => s + p.revenue, 0);
  const totalUnits = data.topProducts.reduce((s, p) => s + p.unitsSold, 0);
  const avgMargin = data.topProducts.length > 0
    ? data.topProducts.reduce((s, p) => s + p.margin, 0) / data.topProducts.length : 0;
  const avgReturnRate = data.topProducts.length > 0
    ? data.topProducts.reduce((s, p) => s + p.returnRate, 0) / data.topProducts.length : 0;

  const insights = getProductInsights(data);

  return (
    <>
      <Header
        title="Product Analytics"
        subtitle={`Product performance, category breakdown, and margin analysis${data.isCustomData ? ` · ${data.companyName}` : ""}`}
      />

      <div className="flex-1 p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard label="Top Products Revenue" value={totalRevenue}  previousValue={totalRevenue * 0.88} format="currency" icon={DollarSign} iconColor="bg-indigo-50 text-indigo-600" />
          <KPICard label="Units Sold"           value={totalUnits}   previousValue={Math.round(totalUnits * 0.91)} format="number" icon={Package} iconColor="bg-violet-50 text-violet-600" />
          <KPICard label="Avg Gross Margin"     value={avgMargin}    previousValue={avgMargin * 0.95} format="percent" icon={Percent} iconColor="bg-emerald-50 text-emerald-600" decimals={1} />
          <KPICard label="Avg Return Rate"      value={avgReturnRate} previousValue={avgReturnRate * 1.05} format="percent" icon={RotateCcw} iconColor="bg-red-50 text-red-500" decimals={1} inverseColor />
        </div>

        <InsightBanner insights={insights} title="Product Insights" />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SectionCard title="Revenue by Category" subtitle="Total revenue per category">
            <CategoryBarChart data={data.categoryPerformance} metric="revenue" />
          </SectionCard>
          <SectionCard title="Gross Margin by Category" subtitle="Average gross margin % per category">
            <CategoryBarChart data={data.categoryPerformance} metric="avgMargin" />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SectionCard title="Units Sold by Category" subtitle="Total unit volume per category">
            <CategoryBarChart data={data.categoryPerformance} metric="units" />
          </SectionCard>
          <SectionCard title="YoY Growth by Category" subtitle="Year-over-year revenue growth rate">
            <CategoryBarChart data={data.categoryPerformance} metric="growth" />
          </SectionCard>
        </div>

        <SectionCard
          title={`Top ${data.topProducts.length} Products by Revenue`}
          subtitle="Ranked by annual revenue · Margin, return rate, and trend included"
        >
          <TopProductsTable products={data.topProducts} />
        </SectionCard>
      </div>
    </>
  );
}
