"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2, CheckCircle2, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import SectionCard from "@/components/ui/SectionCard";
import CSVDropzone from "@/components/import/CSVDropzone";
import { useData } from "@/context/DataContext";
import { parseCSV } from "@/lib/csvParser";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { DashboardData } from "@/types";

function parseRawRows(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
  const rows = lines.slice(1, 6).map((line) =>
    line.split(",").map((cell) => cell.trim().replace(/^["']|["']$/g, ""))
  );
  return { headers, rows };
}

export default function ImportPage() {
  const router = useRouter();
  const { data, setData, resetToMock } = useData();
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<DashboardData | null>(null);
  const [rawRows, setRawRows] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleFile = useCallback((text: string, name: string) => {
    setIsProcessing(true);
    setParseError(null);
    setPreview(null);
    setRawRows(parseRawRows(text));

    setTimeout(() => {
      try {
        const parsed = parseCSV(text, name);
        setPreview(parsed);
      } catch (e: unknown) {
        setParseError(e instanceof Error ? e.message : "Failed to parse CSV.");
      } finally {
        setIsProcessing(false);
      }
    }, 50);
  }, []);

  const applyData = useCallback(() => {
    if (!preview) return;
    setData(preview);
    router.push("/");
  }, [preview, setData, router]);

  return (
    <>
      <Header title="Import Data" subtitle="Upload your company's sales CSV to populate all dashboards with your real data" />

      <div className="flex-1 p-4 sm:p-8 space-y-6 sm:space-y-8 max-w-4xl">

        {/* ── Current dataset banner ─────────────────────────────────── */}
        {data.isCustomData && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  Custom data active — {data.companyName}
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Imported from <span className="font-mono">{data.fileName}</span>
                  {data.importedAt && ` on ${new Date(data.importedAt).toLocaleDateString()}`}
                </p>
              </div>
            </div>
            <button
              onClick={resetToMock}
              className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Reset to demo data
            </button>
          </div>
        )}

        {/* ── CSV Format Guide ───────────────────────────────────────── */}
        <SectionCard
          title="Required CSV Format"
          subtitle="Your file needs these columns — column order doesn't matter, names are case-insensitive"
          action={
            <a
              href="/sample-data.csv"
              download
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download sample CSV
            </a>
          }
        >
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Column", "Required", "Example values", "Notes"].map((h) => (
                    <th key={h} className="px-6 py-2.5 text-left font-medium text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["date",          "Yes", "2024-01-15",          "Any standard date format (YYYY-MM-DD recommended)"],
                  ["order_id",      "No",  "ORD-001",             "Auto-generated if missing"],
                  ["customer_id",   "No",  "C-001",               "Used for segmentation & cohort analysis"],
                  ["customer_name", "No",  "Sarah Mitchell",      "Shown in recent orders table"],
                  ["product",       "Yes", "Dell XPS 15 Laptop",  "Product name — top products ranked by revenue"],
                  ["category",      "Yes", "Electronics",         "Groups into category charts"],
                  ["amount",        "Yes", "1299.99",             "Order total in any currency (numbers only)"],
                  ["channel",       "No",  "online / in-store",   "Sales channel breakdown"],
                  ["region",        "No",  "Northeast",           "Regional revenue breakdown"],
                  ["status",        "No",  "completed / returned","Returned orders are tracked separately"],
                ].map(([col, req, ex, note]) => (
                  <tr key={col} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-2.5 font-mono font-medium text-indigo-600">{col}</td>
                    <td className="px-6 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        req === "Yes" ? "bg-indigo-50 text-indigo-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        {req}
                      </span>
                    </td>
                    <td className="px-6 py-2.5 text-gray-500 font-mono">{ex}</td>
                    <td className="px-6 py-2.5 text-gray-500">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* ── Upload Zone ────────────────────────────────────────────── */}
        <SectionCard title="Upload Your Data" subtitle="Drag and drop or click to select a .csv file">
          <CSVDropzone onFile={handleFile} isProcessing={isProcessing} />

          {parseError && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              <strong>Parse error:</strong> {parseError}
            </div>
          )}
        </SectionCard>

        {/* ── Raw rows preview ───────────────────────────────────────── */}
        {rawRows && rawRows.headers.length > 0 && (
          <SectionCard title="Raw Data Preview" subtitle={`First ${rawRows.rows.length} rows of your CSV`}>
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    {rawRows.headers.map((h) => (
                      <th key={h} className="px-4 py-2 text-left font-semibold text-indigo-600 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rawRows.rows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-2 text-gray-600 whitespace-nowrap font-mono">
                          {cell || <span className="text-gray-300">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}

        {/* ── Preview Summary ────────────────────────────────────────── */}
        {preview && (
          <SectionCard
            title={`Preview — ${preview.companyName}`}
            subtitle={`${preview.period} · Parsed from ${preview.fileName}`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Revenue",  value: formatCurrency(preview.monthlyRevenue.reduce((s,m)=>s+m.revenue,0), true) },
                { label: "Total Orders",   value: formatNumber(preview.monthlyRevenue.reduce((s,m)=>s+m.orders,0), true) },
                { label: "Products",       value: formatNumber(preview.topProducts.length) },
                { label: "Customers",      value: formatNumber(preview.customerSegments.reduce((s,c)=>s+c.count,0), true) },
                { label: "Categories",     value: formatNumber(preview.salesByCategory.length) },
                { label: "Regions",        value: formatNumber(preview.salesByRegion.length) },
                { label: "Channels",       value: formatNumber(preview.salesByChannel.length) },
                { label: "Cohorts",        value: formatNumber(preview.retentionCohorts.length) },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
                  <p className="text-xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={applyData}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                Apply to Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => { setPreview(null); setRawRows(null); }}
                className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <p className="text-xs text-gray-400 ml-2">
                All 5 dashboard pages will update with this data
              </p>
            </div>
          </SectionCard>
        )}
      </div>
    </>
  );
}
