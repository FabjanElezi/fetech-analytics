"use client";

import { Users, UserPlus, UserMinus, DollarSign } from "lucide-react";
import Header from "@/components/layout/Header";
import KPICard from "@/components/ui/KPICard";
import SectionCard from "@/components/ui/SectionCard";
import InsightBanner from "@/components/ui/InsightBanner";
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

export default function CustomersPage() {
  const { data } = useData();

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

      <div className="flex-1 p-8 space-y-8">
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

          <SectionCard title="Segment Details" subtitle="Avg lifetime value and order frequency by segment">
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Segment","Customers","Share","Avg LTV","Orders/yr"].map((h) => (
                      <th key={h} className="px-6 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.customerSegments.map((seg) => (
                    <tr key={seg.segment} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
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
    </>
  );
}
