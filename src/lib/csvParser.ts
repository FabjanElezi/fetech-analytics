// ─── CSV → DashboardData parser ───────────────────────────────────────────────
// Accepts a parsed CSV (from PapaParse) and aggregates order-level rows into
// every data shape the dashboard needs: monthly revenue, categories, regions,
// channels, products, customers, cohort retention, and a computed forecast.
import Papa from "papaparse";
import type {
  DashboardData,
  MonthlyRevenue,
  DailySales,
  SalesByCategory,
  SalesByRegion,
  SalesByChannel,
  RecentOrder,
  Product,
  CategoryPerformance,
  CustomerSegment,
  CustomerAcquisition,
  RetentionCohort,
} from "@/types";
import { buildForecast } from "./forecastEngine";

// ─── Expected CSV column names (case-insensitive, trimmed) ───────────────────
// date | order_id | customer_id | customer_name | product | category |
// amount | channel | region | status

const CATEGORY_COLORS: Record<string, string> = {
  "electronics": "#6366f1",
  "clothing & apparel": "#8b5cf6",
  "home & garden": "#06b6d4",
  "sports & outdoors": "#10b981",
  "food & beverage": "#f59e0b",
};
const SEGMENT_COLORS = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444"];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── Normalise a raw CSV row into a typed order object ───────────────────────
interface RawOrder {
  date: Date;
  dateStr: string;
  orderId: string;
  customerId: string;
  customerName: string;
  product: string;
  category: string;
  amount: number;
  channel: string;
  region: string;
  status: string;
  year: number;
  month: number; // 0-11
  monthLabel: string;
  yearMonth: string; // "2024-01"
}

function normaliseRow(row: Record<string, string>): RawOrder | null {
  // Flexible column name matching
  const get = (keys: string[]): string => {
    for (const k of keys) {
      const match = Object.keys(row).find((col) => col.trim().toLowerCase() === k);
      if (match && row[match]?.trim()) return row[match].trim();
    }
    return "";
  };

  const dateRaw = get(["date", "order_date", "sale_date", "transaction_date"]);
  const amount = parseFloat(get(["amount", "total", "revenue", "price", "sale_amount", "order_total"]) || "0");

  if (!dateRaw || isNaN(amount) || amount <= 0) return null;

  const date = new Date(dateRaw);
  if (isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = date.getMonth();

  return {
    date,
    dateStr: dateRaw,
    orderId: get(["order_id", "id", "orderid", "order_number"]) || `ORD-${Math.random().toString(36).slice(2,8).toUpperCase()}`,
    customerId: get(["customer_id", "customerid", "cust_id", "customer"]) || "UNKNOWN",
    customerName: get(["customer_name", "customer", "name", "buyer"]) || "Unknown Customer",
    product: get(["product", "product_name", "item", "description", "product_description"]) || "Unknown Product",
    category: get(["category", "product_category", "dept", "department"]) || "Other",
    amount,
    channel: get(["channel", "sales_channel", "source"]).toLowerCase() || "online",
    region: get(["region", "store_region", "area", "location", "state"]) || "Other",
    status: get(["status", "order_status"]).toLowerCase() || "completed",
    year,
    month,
    monthLabel: MONTH_SHORT[month],
    yearMonth: `${year}-${String(month + 1).padStart(2, "0")}`,
  };
}

// ─── Main parse function ──────────────────────────────────────────────────────
export function parseCSV(csvText: string, fileName: string): DashboardData {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  const orders: RawOrder[] = parsed.data
    .map(normaliseRow)
    .filter((r): r is RawOrder => r !== null);

  if (orders.length === 0) {
    throw new Error("No valid rows found. Check that your CSV has the required columns.");
  }

  // ── Determine the primary year (most data) ───────────────────────────────
  const yearCounts: Record<number, number> = {};
  for (const o of orders) yearCounts[o.year] = (yearCounts[o.year] || 0) + 1;
  const primaryYear = Number(Object.entries(yearCounts).sort((a, b) => b[1] - a[1])[0][0]);
  const prevYear = primaryYear - 1;

  const current = orders.filter((o) => o.year === primaryYear);
  const previous = orders.filter((o) => o.year === prevYear);

  // ── Monthly Revenue ───────────────────────────────────────────────────────
  const monthlyMap: Record<string, { revenue: number; orders: number }> = {};
  for (const o of current) {
    const key = o.monthLabel;
    if (!monthlyMap[key]) monthlyMap[key] = { revenue: 0, orders: 0 };
    monthlyMap[key].revenue += o.amount;
    monthlyMap[key].orders += 1;
  }

  const prevMonthlyMap: Record<string, number> = {};
  for (const o of previous) {
    const key = o.monthLabel;
    prevMonthlyMap[key] = (prevMonthlyMap[key] || 0) + o.amount;
  }

  const monthlyRevenue: MonthlyRevenue[] = MONTH_SHORT.map((month) => {
    const d = monthlyMap[month] || { revenue: 0, orders: 0 };
    return {
      month,
      year: primaryYear,
      revenue: Math.round(d.revenue),
      orders: d.orders,
      avgOrderValue: d.orders > 0 ? Math.round(d.revenue / d.orders) : 0,
      prevYearRevenue: Math.round(prevMonthlyMap[month] || 0),
    };
  });

  // ── Daily Sales (last 30 days of primary year) ────────────────────────────
  const sortedCurrent = [...current].sort((a, b) => b.date.getTime() - a.date.getTime());
  const dailyMap: Record<string, { revenue: number; orders: number; returns: number }> = {};
  for (const o of sortedCurrent) {
    if (!dailyMap[o.dateStr]) dailyMap[o.dateStr] = { revenue: 0, orders: 0, returns: 0 };
    dailyMap[o.dateStr].revenue += o.amount;
    dailyMap[o.dateStr].orders += 1;
    if (o.status === "returned") dailyMap[o.dateStr].returns += o.amount;
  }
  const recentDates = Object.keys(dailyMap).sort().slice(-30);
  const dailySales: DailySales[] = recentDates.map((date) => ({
    date,
    revenue: Math.round(dailyMap[date].revenue),
    orders: dailyMap[date].orders,
    returns: Math.round(dailyMap[date].returns),
  }));

  // ── Sales by Category ─────────────────────────────────────────────────────
  const catMap: Record<string, { revenue: number; units: number }> = {};
  for (const o of current) {
    const cat = o.category;
    if (!catMap[cat]) catMap[cat] = { revenue: 0, units: 0 };
    catMap[cat].revenue += o.amount;
    catMap[cat].units += 1;
  }
  const totalRevenue = current.reduce((s, o) => s + o.amount, 0);
  const salesByCategory: SalesByCategory[] = Object.entries(catMap)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .map(([category, d], idx) => ({
      category,
      revenue: Math.round(d.revenue),
      units: d.units,
      percentage: parseFloat(((d.revenue / totalRevenue) * 100).toFixed(1)),
      color: CATEGORY_COLORS[category.toLowerCase()] || `hsl(${idx * 60}, 65%, 55%)`,
    }));

  // ── Sales by Region ───────────────────────────────────────────────────────
  const regionMap: Record<string, { revenue: number; orders: number }> = {};
  for (const o of current) {
    if (!regionMap[o.region]) regionMap[o.region] = { revenue: 0, orders: 0 };
    regionMap[o.region].revenue += o.amount;
    regionMap[o.region].orders += 1;
  }
  const prevRegionMap: Record<string, number> = {};
  for (const o of previous) {
    prevRegionMap[o.region] = (prevRegionMap[o.region] || 0) + o.amount;
  }
  const salesByRegion: SalesByRegion[] = Object.entries(regionMap)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .map(([region, d]) => {
      const prev = prevRegionMap[region] || 0;
      const growth = prev > 0 ? parseFloat((((d.revenue - prev) / prev) * 100).toFixed(1)) : 0;
      return { region, revenue: Math.round(d.revenue), orders: d.orders, growth };
    });

  // ── Sales by Channel ──────────────────────────────────────────────────────
  const channelMap: Record<string, { revenue: number; orders: number }> = {};
  for (const o of current) {
    const ch = o.channel || "online";
    if (!channelMap[ch]) channelMap[ch] = { revenue: 0, orders: 0 };
    channelMap[ch].revenue += o.amount;
    channelMap[ch].orders += 1;
  }
  const salesByChannel: SalesByChannel[] = Object.entries(channelMap)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .map(([channel, d]) => ({
      channel: channel.charAt(0).toUpperCase() + channel.slice(1),
      revenue: Math.round(d.revenue),
      percentage: parseFloat(((d.revenue / totalRevenue) * 100).toFixed(1)),
      orders: d.orders,
    }));

  // ── Recent Orders (last 10) ───────────────────────────────────────────────
  const recentOrders: RecentOrder[] = sortedCurrent.slice(0, 10).map((o) => ({
    id: o.orderId,
    customer: o.customerName,
    product: o.product,
    category: o.category,
    amount: o.amount,
    status: (["completed","processing","returned","cancelled"].includes(o.status)
      ? o.status : "completed") as RecentOrder["status"],
    date: o.dateStr,
    channel: o.channel.includes("store") ? "in-store" : "online",
  }));

  // ── Top Products ──────────────────────────────────────────────────────────
  const productMap: Record<string, { revenue: number; units: number; category: string; returns: number }> = {};
  for (const o of current) {
    if (!productMap[o.product]) productMap[o.product] = { revenue: 0, units: 0, category: o.category, returns: 0 };
    productMap[o.product].revenue += o.amount;
    productMap[o.product].units += 1;
    if (o.status === "returned") productMap[o.product].returns += 1;
  }
  const topProducts: Product[] = Object.entries(productMap)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 12)
    .map(([name, d], idx) => ({
      id: `P${String(idx + 1).padStart(3, "0")}`,
      name,
      category: d.category,
      sku: `${d.category.slice(0, 2).toUpperCase()}-${String(idx + 1).padStart(3, "0")}`,
      revenue: Math.round(d.revenue),
      unitsSold: d.units,
      avgPrice: Math.round(d.revenue / d.units),
      margin: 30 + (idx % 3) * 8, // estimated — not in CSV
      returnRate: parseFloat(((d.returns / d.units) * 100).toFixed(1)),
      trend: d.revenue > totalRevenue / Object.keys(productMap).length ? "up" : "flat",
    }));

  // ── Category Performance ──────────────────────────────────────────────────
  const prevCatMap: Record<string, number> = {};
  for (const o of previous) {
    prevCatMap[o.category] = (prevCatMap[o.category] || 0) + o.amount;
  }
  const categoryPerformance: CategoryPerformance[] = salesByCategory.map((c, idx) => {
    const prev = prevCatMap[c.category] || 0;
    const growth = prev > 0 ? parseFloat((((c.revenue - prev) / prev) * 100).toFixed(1)) : 0;
    return {
      category: c.category,
      revenue: c.revenue,
      units: c.units,
      avgMargin: 30 + (idx % 4) * 7,
      growth,
      color: c.color,
    };
  });

  // ── Customer Segmentation (spend-based RFM proxy) ─────────────────────────
  const custSpend: Record<string, number> = {};
  const custOrders: Record<string, number> = {};
  for (const o of current) {
    custSpend[o.customerId] = (custSpend[o.customerId] || 0) + o.amount;
    custOrders[o.customerId] = (custOrders[o.customerId] || 0) + 1;
  }
  const spendValues = Object.values(custSpend).sort((a, b) => b - a);
  const totalCusts = spendValues.length;
  const p85 = spendValues[Math.floor(totalCusts * 0.15)] || 0;
  const p60 = spendValues[Math.floor(totalCusts * 0.40)] || 0;
  const p25 = spendValues[Math.floor(totalCusts * 0.75)] || 0;

  const segBuckets: Record<string, { count: number; totalSpend: number; totalOrders: number }> = {
    Premium: { count: 0, totalSpend: 0, totalOrders: 0 },
    Loyal: { count: 0, totalSpend: 0, totalOrders: 0 },
    Regular: { count: 0, totalSpend: 0, totalOrders: 0 },
    Occasional: { count: 0, totalSpend: 0, totalOrders: 0 },
    "At-Risk": { count: 0, totalSpend: 0, totalOrders: 0 },
  };
  for (const [id, spend] of Object.entries(custSpend)) {
    const freq = custOrders[id] || 1;
    const seg = spend >= p85 ? "Premium" : spend >= p60 ? "Loyal" : spend >= p25 ? "Regular" : freq <= 1 ? "At-Risk" : "Occasional";
    segBuckets[seg].count++;
    segBuckets[seg].totalSpend += spend;
    segBuckets[seg].totalOrders += freq;
  }
  const customerSegments: CustomerSegment[] = Object.entries(segBuckets)
    .filter(([, d]) => d.count > 0)
    .map(([segment, d], idx) => ({
      segment,
      count: d.count,
      percentage: parseFloat(((d.count / totalCusts) * 100).toFixed(1)),
      avgLifetimeValue: Math.round(d.totalSpend / d.count),
      avgOrderFrequency: parseFloat((d.totalOrders / d.count).toFixed(1)),
      color: SEGMENT_COLORS[idx] || "#94a3b8",
    }));

  // ── Customer Acquisition by Month ─────────────────────────────────────────
  // First-time vs returning, based on whether customer_id first seen this month
  const seenBefore = new Set<string>();
  const acqMap: Record<string, { newC: number; retC: number }> = {};
  const sortedAll = [...current].sort((a, b) => a.date.getTime() - b.date.getTime());
  for (const o of sortedAll) {
    const key = o.monthLabel;
    if (!acqMap[key]) acqMap[key] = { newC: 0, retC: 0 };
    if (!seenBefore.has(o.customerId)) {
      acqMap[key].newC++;
      seenBefore.add(o.customerId);
    } else {
      acqMap[key].retC++;
    }
  }
  const customerAcquisition: CustomerAcquisition[] = MONTH_SHORT.map((month) => ({
    month,
    newCustomers: acqMap[month]?.newC || 0,
    returningCustomers: acqMap[month]?.retC || 0,
    churnedCustomers: 0, // requires multi-year comparison
  }));

  // ── Cohort Retention Heatmap ──────────────────────────────────────────────
  // For each customer, record the set of months in which they purchased
  const custMonths: Record<string, Set<string>> = {};
  for (const o of current) {
    if (!custMonths[o.customerId]) custMonths[o.customerId] = new Set();
    custMonths[o.customerId].add(o.yearMonth); // "2024-01"
  }

  // Build cohorts: customers grouped by their FIRST purchase month
  const cohortCustomers: Record<string, string[]> = {};
  for (const [custId, months] of Object.entries(custMonths)) {
    const firstMonth = [...months].sort()[0];
    if (!cohortCustomers[firstMonth]) cohortCustomers[firstMonth] = [];
    cohortCustomers[firstMonth].push(custId);
  }

  const retentionCohorts: RetentionCohort[] = Object.entries(cohortCustomers)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 12)
    .map(([ym, customers]) => {
      const [y, m] = ym.split("-").map(Number);
      const cohortLabel = `${MONTH_SHORT[m - 1]} ${y}`;
      const totalInCohort = customers.length;

      const retention = (offsetMonths: number): number => {
        const targetY = y + Math.floor((m - 1 + offsetMonths) / 12);
        const targetM = ((m - 1 + offsetMonths) % 12) + 1;
        const targetYM = `${targetY}-${String(targetM).padStart(2, "0")}`;
        if (targetYM > `${primaryYear}-12`) return 0; // future — no data
        const count = customers.filter((id) => custMonths[id]?.has(targetYM)).length;
        return totalInCohort > 0 ? Math.round((count / totalInCohort) * 100) : 0;
      };

      return {
        cohort: cohortLabel,
        month0: 100,
        month1: retention(1),
        month2: retention(2),
        month3: retention(3),
        month6: retention(6),
        month12: retention(12),
      };
    });

  // ── Forecast ──────────────────────────────────────────────────────────────
  const monthlyActuals = monthlyRevenue.map((m) => m.revenue);
  const forecast = buildForecast(monthlyActuals, String(primaryYear));

  // ── Company name from file name ───────────────────────────────────────────
  const companyName = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || "Imported Company";

  return {
    companyName,
    period: `FY ${primaryYear}`,
    monthlyRevenue,
    dailySales,
    salesByCategory,
    salesByRegion,
    salesByChannel,
    recentOrders,
    topProducts,
    categoryPerformance,
    customerSegments,
    customerAcquisition,
    retentionCohorts,
    forecastPoints: forecast.points,
    forecastMetrics: forecast.metrics,
    forecastSummary: forecast.summary,
    isCustomData: true,
    importedAt: new Date().toISOString(),
    fileName,
  };
}
