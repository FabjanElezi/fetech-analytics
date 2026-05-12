"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2, CheckCircle2, ArrowRight, AlertCircle, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import SectionCard from "@/components/ui/SectionCard";
import CSVDropzone from "@/components/import/CSVDropzone";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";
import { parseCSV } from "@/lib/csvParser";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";
import type { DashboardData } from "@/types";

// ── Column mapper helpers ──────────────────────────────────────────────────────
const REQUIRED_FIELDS = ["date", "amount", "product", "category"] as const;
const OPTIONAL_FIELDS = ["customer_id", "customer_name", "order_id", "channel", "region", "status"] as const;
type FieldName = (typeof REQUIRED_FIELDS)[number] | (typeof OPTIONAL_FIELDS)[number];

const FIELD_LABELS: Record<FieldName, string> = {
  date: "Date", amount: "Amount", product: "Product", category: "Category",
  customer_id: "Customer ID", customer_name: "Customer Name",
  order_id: "Order ID", channel: "Channel", region: "Region", status: "Status",
};

const FIELD_ALIASES: Record<FieldName, string[]> = {
  date:          ["date", "order_date", "sale_date", "transaction_date"],
  amount:        ["amount", "total", "revenue", "price", "sale_amount", "order_total"],
  product:       ["product", "product_name", "item", "description", "product_description"],
  category:      ["category", "product_category", "dept", "department"],
  customer_id:   ["customer_id", "customerid", "cust_id"],
  customer_name: ["customer_name", "name", "buyer"],
  order_id:      ["order_id", "id", "orderid", "order_number"],
  channel:       ["channel", "sales_channel", "source"],
  region:        ["region", "store_region", "area", "location", "state"],
  status:        ["status", "order_status"],
};

function detectMapping(headers: string[]): Record<FieldName, string> {
  const lower = headers.map((h) => h.toLowerCase().trim());
  const result = {} as Record<FieldName, string>;
  for (const [field, aliases] of Object.entries(FIELD_ALIASES) as [FieldName, string[]][]) {
    for (const alias of aliases) {
      const idx = lower.indexOf(alias);
      if (idx !== -1) { result[field] = headers[idx]; break; }
    }
  }
  return result;
}

function remapHeaders(csvText: string, mapping: Record<FieldName, string>): string {
  // Build reverse map: original header → standard field name
  const reverse: Record<string, string> = {};
  for (const [field, col] of Object.entries(mapping) as [FieldName, string][]) {
    if (col) reverse[col] = field;
  }
  const lines = csvText.split(/\r?\n/);
  if (!lines.length) return csvText;
  const origHeaders = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
  lines[0] = origHeaders.map((h) => reverse[h] ?? h).join(",");
  return lines.join("\n");
}

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
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<DashboardData | null>(null);
  const [rawRows, setRawRows] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [showMapper, setShowMapper] = useState(false);
  const [columnMap, setColumnMap] = useState<Record<FieldName, string>>({} as Record<FieldName, string>);

  const runParse = useCallback((text: string, name: string, mapping?: Record<FieldName, string>) => {
    setIsProcessing(true);
    setParseError(null);
    setPreview(null);
    const csvToProcess = mapping ? remapHeaders(text, mapping) : text;
    setTimeout(() => {
      try {
        const parsed = parseCSV(csvToProcess, name);
        setPreview(parsed);
        setShowMapper(false);
      } catch (e: unknown) {
        setParseError(e instanceof Error ? e.message : "Failed to parse CSV.");
        setShowMapper(true);
      } finally {
        setIsProcessing(false);
      }
    }, 50);
  }, []);

  const handleFile = useCallback((text: string, name: string) => {
    setRawText(text);
    setFileName(name);
    setPreview(null);
    setParseError(null);
    setShowMapper(false);
    const parsed = parseRawRows(text);
    setRawRows(parsed);
    const detected = detectMapping(parsed.headers);
    setColumnMap(detected);
    runParse(text, name);
  }, [runParse]);

  const applyData = useCallback(() => {
    if (!preview) return;
    setData(preview);
    toast(`${preview.companyName} — ${preview.monthlyRevenue.reduce((s, m) => s + m.orders, 0).toLocaleString()} rows loaded`);
    router.push("/");
  }, [preview, setData, router, toast]);

  return (
    <>
      <Header title="Import Data" subtitle="Upload your company's sales CSV to populate all dashboards with your real data" />

      <div className="flex-1 p-4 sm:p-8 space-y-6 sm:space-y-8 max-w-4xl">

        {/* ── Current dataset banner ─────────────────────────────────── */}
        {data.isCustomData && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  Custom data active — {data.companyName}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
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
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Column", "Required", "Example values", "Notes"].map((h) => (
                    <th key={h} className="px-6 py-2.5 text-left font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wide">
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
                  <tr key={col} className="border-b border-gray-50 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-2.5 font-mono font-medium text-indigo-600 dark:text-indigo-400">{col}</td>
                    <td className="px-6 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        req === "Yes" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400"
                      }`}>
                        {req}
                      </span>
                    </td>
                    <td className="px-6 py-2.5 text-gray-500 dark:text-slate-400 font-mono">{ex}</td>
                    <td className="px-6 py-2.5 text-gray-500 dark:text-slate-400">{note}</td>
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
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span><strong>Parse error:</strong> {parseError}</span>
            </div>
          )}
        </SectionCard>

        {/* ── Column Mapper ──────────────────────────────────────────────── */}
        {showMapper && rawRows && rawRows.headers.length > 0 && (
          <SectionCard
            title="Map Your Columns"
            subtitle="Tell us which of your CSV columns correspond to each field"
          >
            <div className="space-y-3 mb-6">
              {([...REQUIRED_FIELDS, ...OPTIONAL_FIELDS] as FieldName[]).map((field) => (
                <div key={field} className="flex items-center gap-3">
                  <div className="w-32 shrink-0">
                    <span className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded",
                      REQUIRED_FIELDS.includes(field as typeof REQUIRED_FIELDS[number])
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400"
                    )}>
                      {REQUIRED_FIELDS.includes(field as typeof REQUIRED_FIELDS[number]) ? "Required" : "Optional"}
                    </span>
                  </div>
                  <div className="w-32 shrink-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{FIELD_LABELS[field]}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
                  <select
                    value={columnMap[field] ?? ""}
                    onChange={(e) => setColumnMap((prev) => ({ ...prev, [field]: e.target.value }))}
                    className="flex-1 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-sm text-gray-800 dark:text-slate-200 outline-none focus:border-indigo-400"
                  >
                    <option value="">— not mapped —</option>
                    {rawRows.headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => runParse(rawText, fileName, columnMap)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                Apply mapping <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowMapper(false)}
                className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 text-sm font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </SectionCard>
        )}

        {/* Show mapper toggle when auto-detection succeeded */}
        {!showMapper && rawRows && rawRows.headers.length > 0 && !parseError && (
          <button
            onClick={() => setShowMapper(true)}
            className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1 -mt-4"
          >
            Columns not mapping correctly? Fix manually
          </button>
        )}

        {/* ── Raw rows preview ───────────────────────────────────────── */}
        {rawRows && rawRows.headers.length > 0 && (
          <SectionCard title="Raw Data Preview" subtitle={`First ${rawRows.rows.length} rows of your CSV`}>
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-700">
                    {rawRows.headers.map((h) => (
                      <th key={h} className="px-4 py-2 text-left font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rawRows.rows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-2 text-gray-600 dark:text-slate-400 whitespace-nowrap font-mono">
                          {cell || <span className="text-gray-300 dark:text-slate-600">—</span>}
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
                <div key={label} className="rounded-xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 p-4 text-center">
                  <p className="text-xl font-bold text-gray-900 dark:text-slate-100">{value}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{label}</p>
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
                className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 text-sm font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
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
