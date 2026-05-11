"use client";

import { TrendingUp, Target, BarChart2, Activity } from "lucide-react";
import Header from "@/components/layout/Header";
import KPICard from "@/components/ui/KPICard";
import SectionCard from "@/components/ui/SectionCard";
import InsightBanner from "@/components/ui/InsightBanner";
import ForecastChart from "@/components/charts/ForecastChart";
import { formatCurrency } from "@/lib/utils";
import { useData } from "@/context/DataContext";
import { getForecastInsights } from "@/lib/insightEngine";

export default function ForecastingPage() {
  const { data } = useData();
  const { forecastPoints, forecastMetrics, forecastSummary } = data;

  const insights = getForecastInsights(data);

  return (
    <>
      <Header
        title="Revenue Forecasting"
        subtitle={`12-month projection using exponential smoothing with seasonal adjustment${data.isCustomData ? ` · ${data.companyName}` : ""}`}
      />

      <div className="flex-1 p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard label="Projected Next-Year Revenue" value={forecastSummary.projectedNextAnnual} previousValue={forecastSummary.actualCurrentAnnual} format="currency" icon={TrendingUp} iconColor="bg-indigo-50 text-indigo-600" />
          <KPICard label="Next Year Q1 Forecast"       value={forecastSummary.projectedNextQ1}     previousValue={forecastSummary.projectedNextQ1 * 0.91} format="currency" icon={Target}   iconColor="bg-violet-50 text-violet-600" />
          <KPICard label="Next Year Q4 Forecast"       value={forecastSummary.projectedNextQ4}     previousValue={forecastSummary.projectedNextQ4 * 0.91} format="currency" icon={BarChart2} iconColor="bg-cyan-50 text-cyan-600" />
          <KPICard label="Model MAPE"                  value={forecastMetrics.mape}                previousValue={forecastMetrics.mape * 1.25} format="percent" icon={Activity} iconColor="bg-emerald-50 text-emerald-600" decimals={1} inverseColor />
        </div>

        <InsightBanner insights={insights} title="Forecast Insights" />

        <SectionCard
          title="24-Month Revenue Forecast"
          subtitle="Green line = actuals · Purple dashed = ETS forecast · Shaded band = 90% confidence interval"
        >
          <ForecastChart data={forecastPoints} />
        </SectionCard>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SectionCard title="Forecasting Methodology" subtitle="Model design and assumptions">
            <div className="space-y-4 text-sm text-gray-600">
              <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
                <p className="font-semibold text-indigo-800 mb-1">Exponential Smoothing (ETS)</p>
                <p className="text-indigo-700 text-xs leading-relaxed">
                  Single exponential smoothing (α = 0.3) applied to monthly actuals.
                  Seasonal indices computed as each month&apos;s ratio to the annual monthly average,
                  then multiplied into the projected baseline. Growth assumption: +{forecastMetrics.growthAssumption}% YoY.
                </p>
              </div>
              <div className="space-y-2">
                {[
                  ["Smoothing Factor (α)",  "0.30",                          "Controls how fast the model reacts to new data"],
                  ["Growth Assumption",     `+${forecastMetrics.growthAssumption}%`,  "Applied uniformly across all projected months"],
                  ["Seasonality",          "Multiplicative",                 "Index derived from current-year monthly patterns"],
                  ["Confidence Interval",  `${forecastMetrics.confidenceLevel}%`,     "Band widens with forecast horizon (max 12 months)"],
                ].map(([key, value, note]) => (
                  <div key={key} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-44 shrink-0">
                      <p className="font-medium text-gray-700">{key}</p>
                      <p className="text-indigo-600 font-semibold text-xs mt-0.5">{value}</p>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Model Accuracy Metrics" subtitle="In-sample fit: smoothed vs actuals">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "MAPE",        value: `${forecastMetrics.mape}%`,              desc: "Mean Absolute Percentage Error",     color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
                { label: "RMSE",        value: formatCurrency(forecastMetrics.rmse,true),desc: "Root Mean Square Error (monthly)",  color: "border-indigo-200 bg-indigo-50 text-indigo-700"   },
                { label: "R²",          value: forecastMetrics.r2.toFixed(2),            desc: "Coefficient of determination",      color: "border-violet-200 bg-violet-50 text-violet-700"   },
                { label: "CI Level",    value: `${forecastMetrics.confidenceLevel}%`,    desc: "Confidence interval width",         color: "border-cyan-200 bg-cyan-50 text-cyan-700"         },
                { label: "Growth Rate", value: `+${forecastMetrics.growthAssumption}%`,  desc: "Annual growth assumption",          color: "border-amber-200 bg-amber-50 text-amber-700"      },
                { label: "Horizon",     value: "12 months",                              desc: "Max reliable forecast horizon",     color: "border-slate-200 bg-slate-50 text-slate-600"      },
              ].map(({ label, value, desc, color }) => (
                <div key={label} className={`rounded-xl border p-4 ${color}`}>
                  <p className="text-2xl font-bold mb-0.5">{value}</p>
                  <p className="text-xs font-semibold">{label}</p>
                  <p className="text-[11px] opacity-70 mt-1 leading-snug">{desc}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Next-Year Monthly Forecast Detail" subtitle="Point estimate with 90% confidence bounds">
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Month","Forecast","Lower (90%)","Upper (90%)","Band Width","vs Current Year"].map((h) => (
                    <th key={h} className="px-6 py-2.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {forecastPoints
                  .filter((d) => d.isProjected)
                  .map((row) => {
                    const monthKey = row.period.split(" ")[0];
                    const actual2024 = forecastPoints.find((d) => !d.isProjected && d.period.startsWith(monthKey))?.actual;
                    const vsActual = actual2024 ? ((row.forecast - actual2024) / actual2024) * 100 : null;
                    return (
                      <tr key={row.period} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 font-medium text-gray-800">{row.period}</td>
                        <td className="px-6 py-3 font-semibold text-indigo-600">{formatCurrency(row.forecast)}</td>
                        <td className="px-6 py-3 text-gray-500">{formatCurrency(row.lowerBound)}</td>
                        <td className="px-6 py-3 text-gray-500">{formatCurrency(row.upperBound)}</td>
                        <td className="px-6 py-3 text-gray-400">{formatCurrency(row.upperBound - row.lowerBound, true)}</td>
                        <td className="px-6 py-3">
                          {vsActual !== null && (
                            <span className={vsActual >= 0 ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
                              {vsActual >= 0 ? "+" : ""}{vsActual.toFixed(1)}%
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
