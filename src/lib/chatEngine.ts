import type { DashboardData } from "@/types";
import { getHealthScore, getOverviewInsights, getSalesInsights, getProductInsights, getCustomerInsights, getForecastInsights } from "./insightEngine";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function pct(current: number, previous: number) {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

// ── Intent matching ────────────────────────────────────────────────────────────
function matches(q: string, ...terms: string[]): boolean {
  return terms.some((t) => q.includes(t));
}

// ── Response generators ────────────────────────────────────────────────────────
function revenueResponse(data: DashboardData): string {
  const total = data.monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const prev = data.monthlyRevenue.reduce((s, m) => s + m.prevYearRevenue, 0);
  const growth = pct(total, prev);
  const best = [...data.monthlyRevenue].sort((a, b) => b.revenue - a.revenue)[0];
  return `Total revenue is ${fmt(total)}, ${growth >= 0 ? "up" : "down"} ${Math.abs(growth).toFixed(1)}% year-over-year. Your strongest month was ${best?.month} at ${fmt(best?.revenue ?? 0)}. Check the Sales page for the full monthly breakdown and daily trend.`;
}

function marginResponse(data: DashboardData): string {
  const best = [...data.categoryPerformance].sort((a, b) => b.avgMargin - a.avgMargin)[0];
  const worst = [...data.categoryPerformance].sort((a, b) => a.avgMargin - b.avgMargin)[0];
  const avg = data.categoryPerformance.reduce((s, c) => s + c.avgMargin, 0) / Math.max(data.categoryPerformance.length, 1);
  return `Your highest-margin category is ${best?.category} at ${best?.avgMargin}% gross margin. The lowest is ${worst?.category} at ${worst?.avgMargin}%. Overall average gross margin is ${avg.toFixed(1)}%. Head to the Products page to see the full margin breakdown by category.`;
}

function customerResponse(data: DashboardData): string {
  const total = data.customerSegments.reduce((s, c) => s + c.count, 0);
  const premium = data.customerSegments.find((s) => s.segment === "Premium");
  const atRisk = data.customerSegments.find((s) => s.segment === "At-Risk");
  return `You have ${total.toLocaleString()} total customers. ${premium ? `Your Premium segment (${premium.count.toLocaleString()} customers) drives the highest lifetime value at ${fmt(premium.avgLifetimeValue)} per customer.` : ""} ${atRisk && atRisk.count > 0 ? `Watch out — ${atRisk.count.toLocaleString()} customers are at risk of churning.` : ""} Visit the Customers page for full RFM segmentation and cohort retention analysis.`;
}

function atRiskResponse(data: DashboardData): string {
  const atRisk = data.customerSegments.find((s) => s.segment === "At-Risk");
  if (!atRisk || atRisk.count === 0) return "Good news — you have no significant at-risk customer segment in your current data.";
  const potential = fmt(atRisk.count * atRisk.avgLifetimeValue * 0.25);
  return `You have ${atRisk.count.toLocaleString()} at-risk customers who previously purchased but have gone quiet. Reactivating even 20% of them could recover ~${potential} in revenue. Best action: send a win-back email campaign with a time-limited 15% discount offer. Measure reactivation at 30 and 60 days.`;
}

function forecastResponse(data: DashboardData): string {
  const { projectedNextAnnual, actualCurrentAnnual } = data.forecastSummary;
  const growth = pct(projectedNextAnnual, actualCurrentAnnual);
  return `The model projects ${fmt(projectedNextAnnual)} in revenue next year — ${growth >= 0 ? "+" : ""}${growth.toFixed(1)}% vs this year's ${fmt(actualCurrentAnnual)}. The forecast uses Exponential Smoothing (ETS) with a ${data.forecastMetrics.mape}% MAPE error rate. ${data.forecastMetrics.mape <= 5 ? "That's a strong accuracy — reliable enough for budget planning." : "Higher uncertainty — use it as a direction, not a precise target."} See the Forecasting page for monthly detail and confidence bands.`;
}

function healthResponse(data: DashboardData): string {
  const hs = getHealthScore(data);
  const status = hs.overall >= 75 ? "healthy" : hs.overall >= 55 ? "fair" : "at risk";
  const weakest = [...hs.dimensions].sort((a, b) => a.score - b.score)[0];
  return `Your Business Health Score is ${hs.overall}/100 — ${status}. The score is a weighted composite of Revenue Growth (30%), Gross Margin (25%), Customer Retention (20%), Customer Risk (15%), and Return Rate (10%). Your weakest dimension is ${weakest?.label} at ${weakest?.score}/100. Focus there first for the biggest improvement.`;
}

function productResponse(data: DashboardData): string {
  const top = [...data.topProducts].sort((a, b) => b.revenue - a.revenue)[0];
  const highReturn = data.topProducts.filter((p) => p.returnRate > 6);
  return `Your top revenue product is ${top?.name} at ${fmt(top?.revenue ?? 0)}. ${highReturn.length > 0 ? `Warning: ${highReturn.map((p) => p.name).join(", ")} ${highReturn.length === 1 ? "has" : "have"} a return rate above 6% — worth auditing their product pages.` : "No products have a problematic return rate."} The Products page has a full table with margin, units sold, return rate, and trend for every product.`;
}

function importResponse(): string {
  return `To use your own data: click "Import Data" in the left sidebar, then drag and drop your CSV file (or click to browse). The minimum columns needed are: date, amount, and category. If your file also has region, customer_id, channel, product_name, or margin columns, those will automatically power the full dashboard. Your data is saved in your browser so it persists between visits.`;
}

function insightResponse(data: DashboardData): string {
  const all = [
    ...getOverviewInsights(data),
    ...getSalesInsights(data),
    ...getProductInsights(data),
    ...getCustomerInsights(data),
    ...getForecastInsights(data),
  ];
  const critical = all.filter((i) => i.type === "critical");
  const warnings = all.filter((i) => i.type === "warning");
  if (critical.length > 0) {
    return `Your most urgent issue: "${critical[0].title}". Recommended action: ${critical[0].action} Go to the Insights page for the full ranked list of all ${all.length} findings across your business.`;
  }
  if (warnings.length > 0) {
    return `No critical issues found. Your top watch item: "${warnings[0].title}". Recommended action: ${warnings[0].action} Visit the Insights page for all ${all.length} findings.`;
  }
  return `Your business looks healthy — no critical issues detected. The Insights page has ${all.length} findings including your strengths and growth opportunities with specific recommended actions.`;
}

function categoryResponse(data: DashboardData): string {
  const byRev = [...data.categoryPerformance].sort((a, b) => b.revenue - a.revenue)[0];
  const byGrowth = [...data.categoryPerformance].sort((a, b) => b.growth - a.growth)[0];
  return `Your highest-revenue category is ${byRev?.category} at ${fmt(byRev?.revenue ?? 0)}. Your fastest-growing category is ${byGrowth?.category} at +${byGrowth?.growth}% YoY. If those are different categories, the Products page margin analysis will show you whether to push volume (top revenue) or profitability (top margin).`;
}

function regionResponse(data: DashboardData): string {
  const top = [...data.salesByRegion].sort((a, b) => b.growth - a.growth)[0];
  const lowest = [...data.salesByRegion].sort((a, b) => a.growth - b.growth)[0];
  return `Your fastest-growing region is ${top?.region} at +${top?.growth}% YoY. The slowest is ${lowest?.region} at ${lowest?.growth >= 0 ? "+" : ""}${lowest?.growth}%. Investigate what's working in ${top?.region} — which products are selling there specifically — and consider applying that strategy in underperforming regions.`;
}

function returnRateResponse(data: DashboardData): string {
  const totalRevenue = data.monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const returnValue = data.dailySales.reduce((s, d) => s + d.returns, 0) * 12;
  const rate = (returnValue / totalRevenue) * 100;
  const highReturn = data.topProducts.filter((p) => p.returnRate > 6);
  if (rate > 8) return `Your return rate is ~${rate.toFixed(1)}% — above the healthy 8% threshold. This is costing around ${fmt(returnValue)} annually. ${highReturn.length > 0 ? `The main culprits are: ${highReturn.map((p) => p.name).join(", ")}.` : ""} Add detailed size guides, better product images, and clearer descriptions on high-return items.`;
  if (rate > 4) return `Your return rate is ~${rate.toFixed(1)}% — within acceptable range but worth watching. The healthy benchmark is under 4%. Check the Products page to see which specific SKUs are driving returns.`;
  return `Your return rate is ~${rate.toFixed(1)}% — well within the healthy range (under 4%). Good product descriptions and quality control are paying off.`;
}

function retentionResponse(data: DashboardData): string {
  if (data.retentionCohorts.length === 0) return "Cohort retention data requires customer_id in your CSV. Upload a file with customer IDs to see month-by-month retention heatmap on the Customers page.";
  const avg = data.retentionCohorts.filter((c) => c.month1 > 0).reduce((s, c) => s + c.month1, 0) / Math.max(data.retentionCohorts.filter((c) => c.month1 > 0).length, 1);
  return `Your average Month-1 retention is ${avg.toFixed(0)}% — meaning ${avg.toFixed(0)}% of new customers make a second purchase within 30 days. Industry average is 55–60%. ${avg >= 65 ? "You're beating the benchmark — strong post-purchase experience." : avg >= 55 ? "You're around average. An automated Day-3, Day-7 email sequence can push this above 65%." : "Below benchmark. Focus on the first 30 days after purchase — product recommendation emails and a loyalty first-purchase discount work well here."}`;
}

function pdfResponse(): string {
  return `Go to the Insights page (Sparkles icon in the sidebar) and click the "Download PDF" button in the top-right header. The browser will open a print dialog — choose "Save as PDF" as the destination. The report includes your health score, all insights grouped by severity, and a full priority action checklist.`;
}

function mapeResponse(): string {
  return `MAPE stands for Mean Absolute Percentage Error — it measures how accurate the forecast model is. A MAPE of 5% means the model's monthly predictions are off by ±5% on average. Under 5% is excellent (budget-grade), 5–10% is good for direction-setting, over 10% means high uncertainty — treat the forecast as a rough guide rather than a precise target.`;
}

function rfmResponse(): string {
  return `RFM stands for Recency, Frequency, Monetary — a customer segmentation method. Recency = how recently they bought, Frequency = how often they buy, Monetary = how much they spend. Customers are scored on all three dimensions and grouped into segments: Premium (high on all three), Loyal (frequent buyers), Regular (occasional), At-Risk (used to buy, now silent), and New (recent first purchase).`;
}

function etsResponse(): string {
  return `ETS stands for Exponential Smoothing — a forecasting method that gives more weight to recent data points. The platform uses α=0.30 (30% weight to new observations) with multiplicative seasonal adjustment, meaning each month's forecast is scaled by that month's historical ratio to the annual average. This captures seasonal patterns like Q4 spikes while smoothing out one-off anomalies.`;
}

function csvFormatResponse(): string {
  return `Your CSV needs at minimum: a date column (any format), an amount/revenue column, and a category column. Optional but useful: region, channel, customer_id, product_name, quantity, margin, return_flag. Column names are flexible — "Amount", "Total", "Revenue", "Price" all map to the same field automatically. Download the sample file from the Import page to see the exact format.`;
}

function defaultResponse(data: DashboardData): string {
  const total = data.monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const hs = getHealthScore(data);
  return `I can help with your FETech Analytics dashboard. Your current data shows ${fmt(total)} in revenue with a business health score of ${hs.overall}/100. Ask me about: revenue trends, margins, customers, at-risk segments, the forecast, return rates, how to upload data, or what any metric means.`;
}

// ── Main entry point ───────────────────────────────────────────────────────────
export function getChatResponse(question: string, data: DashboardData): string {
  const q = question.toLowerCase();

  if (matches(q, "revenue", "sales total", "how much", "money", "turnover", "top line")) return revenueResponse(data);
  if (matches(q, "margin", "profit", "markup", "gross")) return marginResponse(data);
  if (matches(q, "at-risk", "at risk", "churn", "losing customer", "win back", "inactive")) return atRiskResponse(data);
  if (matches(q, "customer", "segment", "buyer", "client", "who buy")) return customerResponse(data);
  if (matches(q, "forecast", "predict", "next year", "projection", "future")) return forecastResponse(data);
  if (matches(q, "health score", "health", "score", "overall", "how am i doing", "performance")) return healthResponse(data);
  if (matches(q, "product", "sku", "item", "best seller", "top product")) return productResponse(data);
  if (matches(q, "import", "upload", "csv", "my data", "my own", "own data", "bring data")) return importResponse();
  if (matches(q, "insight", "recommend", "action", "what should", "advice", "suggest", "improve", "problem", "issue")) return insightResponse(data);
  if (matches(q, "category", "categor", "department")) return categoryResponse(data);
  if (matches(q, "region", "area", "location", "geography", "north", "south", "east", "west")) return regionResponse(data);
  if (matches(q, "return", "refund", "returned")) return returnRateResponse(data);
  if (matches(q, "retention", "cohort", "repeat", "second purchase", "come back", "loyalty")) return retentionResponse(data);
  if (matches(q, "pdf", "download", "export", "report", "print")) return pdfResponse();
  if (matches(q, "mape", "accuracy", "error rate", "how accurate")) return mapeResponse();
  if (matches(q, "rfm", "recency", "frequency", "monetary")) return rfmResponse();
  if (matches(q, "ets", "exponential", "smoothing", "model work", "forecast work", "how does the forecast")) return etsResponse();
  if (matches(q, "format", "column", "header", "structure", "what column", "what field")) return csvFormatResponse();

  return defaultResponse(data);
}
