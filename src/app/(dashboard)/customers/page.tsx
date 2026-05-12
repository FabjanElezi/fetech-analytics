"use client";

import { useState } from "react";
import { Users, UserPlus, UserMinus, DollarSign, X, TrendingUp } from "lucide-react";
import type { CustomerSegment } from "@/types";
import Header from "@/components/layout/Header";
import KPICard from "@/components/ui/KPICard";
import SectionCard from "@/components/ui/SectionCard";
import InsightBanner from "@/components/ui/InsightBanner";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import CustomerSegmentChart from "@/components/charts/CustomerSegmentChart";
import CustomerAcquisitionChart from "@/components/charts/CustomerAcquisitionChart";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { useData } from "@/context/DataContext";
import { getCustomerInsights } from "@/lib/insightEngine";

function retentionColor(value: number): string {
  if (value === 0) return "bg-gray-50 text-gray-300";
  if (value >= 80) return "bg-indigo-600 text-white";
  if (value >= 60) return "bg-indigo-400 text-white";
  if (value >= 40) return "bg-indigo-200 text-indigo-800";
  if (value >= 25) return "bg-indigo-100 text-indigo-600";
  return "bg-slate-100 text-slate-500";
}

function SegmentDrawer({ seg, onClose }: { seg: CustomerSegment; onClose: () => void }) {
  const totalRevenue = seg.avgLifetimeValue * seg.count;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-slate-800 shadow-2xl border-l border-gray-200 dark:border-slate-700 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full shrink-0" style={{ background: seg.color }} />
            <h2 className="text-base font-semibold text-gray-900 dark:text-slate-100">{seg.segment} Customers</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Customers",     value: seg.count.toLocaleString() },
              { label: "Segment share", value: `${seg.percentage}%` },
              { label: "Avg LTV",       value: `$${seg.avgLifetimeValue.toLocaleString()}` },
              { label: "Orders / year", value: `${seg.avgOrderFrequency}x` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-gray-50 dark:bg-slate-700 p-4 text-center">
                <p className="text-xl font-bold text-gray-900 dark:text-slate-100">{value}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Segment revenue */}
          <div className="rounded-xl border border-gray-100 dark:border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">Segment Revenue</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-1">
              ${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500">
              {seg.count.toLocaleString()} customers × avg ${seg.avgLifetimeValue.toLocaleString()} LTV
            </p>
            <div className="mt-3 h-2 rounded-full bg-gray-100 dark:bg-slate-600 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${seg.percentage}%`, background: seg.color }}
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{seg.percentage}% of all customers</p>
          </div>

          {/* Segment tips */}
          <div className="rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-5">
            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide mb-2">Strategy</p>
            <p className="text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed">
              {seg.segment === "Premium"   && "Retain with exclusive offers and early access. These customers drive outsized revenue — keep them happy."}
              {seg.segment === "Loyal"     && "Upsell into Premium tier with personalized outreach. They're engaged and ready to spend more."}
              {seg.segment === "Regular"   && "Increase purchase frequency with loyalty rewards and targeted promotions."}
              {seg.segment === "Occasional"&& "Re-engage with win-back campaigns and time-limited discounts to lift frequency."}
              {seg.segment === "At-Risk"   && "Launch a win-back sequence immediately. Offer an incentive to bring them back before they churn permanently."}
              {!["Premium","Loyal","Regular","Occasional","At-Risk"].includes(seg.segment) && "Analyze behaviour patterns and design targeted campaigns to move customers up the value ladder."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CustomersPage() {
  const { data, isLoaded } = useData();
  const [selectedSegment, setSelectedSegment] = useState<CustomerSegment | null>(null);
  if (!isLoaded) return <><Header title="Customers" /><DashboardSkeleton /></>;

  const totalCustomers = data.customerSegments.reduce((s, c) => s + c.count, 0);
  const totalNew = data.customerAcquisition.reduce((s, c) => s + c.newCustomers, 0);
  const totalChurned = data.customerAcquisition.reduce((s, c) => s + c.churnedCustomers, 0);
  const weightedLTV = totalCustomers > 0
    ? data.customerSegments.reduce((s, c) => s + c.avgLifetimeValue * c.count, 0) / totalCustomers : 0;

  const insights = getCustomerInsights(data);

  return (
    <>
      <Header
        title="Customer Analytics"
        subtitle={`Segmentation, acquisition trends, lifetime value, and cohort retention${data.isCustomData ? ` · ${data.companyName}` : ""}`}
      />

      <div className="flex-1 p-4 sm:p-8 space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard label="Total Customers"    value={totalCustomers} previousValue={Math.round(totalCustomers * 0.87)} format="number"   icon={Users}      iconColor="bg-indigo-50 text-indigo-600" />
          <KPICard label="New Customers"      value={totalNew}       previousValue={Math.round(totalNew * 0.91)}       format="number"   icon={UserPlus}   iconColor="bg-emerald-50 text-emerald-600" />
          <KPICard label="Churned"            value={totalChurned}   previousValue={Math.round(totalChurned * 1.12)}   format="number"   icon={UserMinus}  iconColor="bg-red-50 text-red-500" inverseColor />
          <KPICard label="Avg Lifetime Value" value={weightedLTV}    previousValue={weightedLTV * 0.93}                format="currency" icon={DollarSign} iconColor="bg-violet-50 text-violet-600" decimals={0} />
        </div>

        <InsightBanner insights={insights} title="Customer Insights" />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SectionCard title="Customer Segments" subtitle="RFM-based classification">
            <CustomerSegmentChart data={data.customerSegments} />
          </SectionCard>

          <SectionCard title="Segment Details" subtitle="Click a row to see segment details and strategy">
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-700">
                    {["Segment","Customers","Share","Avg LTV","Orders/yr"].map((h) => (
                      <th key={h} className="px-6 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.customerSegments.map((seg) => (
                    <tr
                      key={seg.segment}
                      className="border-b border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedSegment(seg)}
                    >
                      <td className="px-6 py-3">
                        <span className="flex items-center gap-2 font-medium text-gray-800">
                          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
                          {seg.segment}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-600">{formatNumber(seg.count)}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 rounded-full bg-gray-100 w-16 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${seg.percentage}%`, background: seg.color }} />
                          </div>
                          <span className="text-gray-500 text-xs">{seg.percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 font-semibold text-gray-900">{formatCurrency(seg.avgLifetimeValue)}</td>
                      <td className="px-6 py-3 text-gray-600">{seg.avgOrderFrequency}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Customer Acquisition & Retention" subtitle="New vs returning customers per month">
          <CustomerAcquisitionChart data={data.customerAcquisition} />
        </SectionCard>

        {data.retentionCohorts.length > 0 && (
          <SectionCard title="Cohort Retention Analysis" subtitle="% of customers still active N months after acquisition">
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-xs font-medium">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-2.5 text-left text-gray-400 font-medium w-28">Cohort</th>
                    {["Month 0","Month 1","Month 2","Month 3","Month 6","Month 12"].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-center text-gray-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.retentionCohorts.map((row) => (
                    <tr key={row.cohort} className="border-b border-gray-50">
                      <td className="px-6 py-2 text-gray-600 font-medium whitespace-nowrap">{row.cohort}</td>
                      {[row.month0,row.month1,row.month2,row.month3,row.month6,row.month12].map((val, i) => (
                        <td key={i} className="px-3 py-2 text-center">
                          <span className={`inline-block w-12 py-1 rounded text-center ${retentionColor(val)}`}>
                            {val > 0 ? `${val}%` : "—"}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}
      </div>

      {selectedSegment && (
        <SegmentDrawer seg={selectedSegment} onClose={() => setSelectedSegment(null)} />
      )}
    </>
  );
}
