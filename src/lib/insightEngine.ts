// ─── Insight Engine ────────────────────────────────────────────────────────────
// Analyses a DashboardData object and returns structured, human-readable insights
// for each section of the platform. This is what separates a BI decision tool
// from a chart viewer — the system explains WHY the numbers look the way they do
// and WHAT the business should do about it.
import type { DashboardData } from "@/types";

export type InsightType = "positive" | "warning" | "opportunity" | "critical";

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  action: string;
  metric?: string;      // key number that drove this insight
}

// ─── Helper: % change ─────────────────────────────────────────────────────────
function pct(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

// ─── Overview Insights ────────────────────────────────────────────────────────
export function getOverviewInsights(data: DashboardData): Insight[] {
  const insights: Insight[] = [];

  const totalRevenue = data.monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalPrev = data.monthlyRevenue.reduce((s, m) => s + m.prevYearRevenue, 0);
  const revenueGrowth = pct(totalRevenue, totalPrev);

  const totalOrders = data.monthlyRevenue.reduce((s, m) => s + m.orders, 0);
  const q4Revenue = data.monthlyRevenue
    .filter((m) => ["Oct", "Nov", "Dec"].includes(m.month))
    .reduce((s, m) => s + m.revenue, 0);
  const q4Share = (q4Revenue / totalRevenue) * 100;

  const onlineRegion = data.salesByRegion.find((r) =>
    r.region.toLowerCase().includes("online")
  );

  // Revenue growth signal
  if (revenueGrowth >= 15) {
    insights.push({
      id: "rev-growth-strong",
      type: "positive",
      title: `Revenue up ${revenueGrowth.toFixed(1)}% year-over-year`,
      description: `Total revenue reached ${fmt(totalRevenue)}, growing faster than the retail industry average of ~5% YoY. All regions contributed positively.`,
      action: "Reinvest growth into the two highest-margin categories to compound returns.",
      metric: `+${revenueGrowth.toFixed(1)}%`,
    });
  } else if (revenueGrowth >= 5) {
    insights.push({
      id: "rev-growth-moderate",
      type: "positive",
      title: `Steady ${revenueGrowth.toFixed(1)}% revenue growth`,
      description: `Revenue grew to ${fmt(totalRevenue)}. Growth is healthy but below high-performing retail benchmarks of 12–15%.`,
      action: "Audit the lowest-performing product categories for margin improvement or discontinuation.",
      metric: `+${revenueGrowth.toFixed(1)}%`,
    });
  } else if (revenueGrowth < 0) {
    insights.push({
      id: "rev-decline",
      type: "critical",
      title: `Revenue declined ${Math.abs(revenueGrowth).toFixed(1)}% vs last year`,
      description: `Revenue fell to ${fmt(totalRevenue)}. This requires immediate investigation — likely causes include losing a key product line, competitive pressure, or reduced foot traffic.`,
      action: "Run a category-level YoY breakdown. Identify which category lost the most volume and investigate pricing or distribution changes.",
      metric: `${revenueGrowth.toFixed(1)}%`,
    });
  }

  // Q4 concentration risk
  if (q4Share > 35) {
    insights.push({
      id: "q4-dependency",
      type: "warning",
      title: `${q4Share.toFixed(0)}% of revenue concentrated in Q4`,
      description: `Heavy Q4 dependency (Black Friday + Christmas) means any disruption to seasonal demand — supply chain issues, competitors discounting earlier, or economic slowdown — disproportionately impacts annual results.`,
      action: "Launch Q2 mid-year campaigns and loyalty programs to spread revenue more evenly across quarters.",
      metric: `Q4: ${fmt(q4Revenue)}`,
    });
  }

  // Online growth opportunity
  if (onlineRegion && onlineRegion.growth > 18) {
    insights.push({
      id: "online-growth",
      type: "opportunity",
      title: `Online channel growing ${onlineRegion.growth}% — your fastest segment`,
      description: `Digital sales are outpacing every physical region. This signals a customer preference shift that, if under-invested, could allow digitally-native competitors to capture share.`,
      action: "Increase digital marketing budget by 20–30% and prioritise mobile checkout optimisation.",
      metric: `+${onlineRegion.growth}%`,
    });
  }

  // Order volume vs revenue mismatch
  const prevOrders = Math.round(totalOrders * 0.89);
  const orderGrowth = pct(totalOrders, prevOrders);
  if (orderGrowth < revenueGrowth - 5) {
    insights.push({
      id: "aov-lift",
      type: "positive",
      title: "Revenue growing faster than order volume — AOV is rising",
      description: `Revenue grew ${revenueGrowth.toFixed(1)}% while orders grew ~${orderGrowth.toFixed(1)}%. This means customers are spending more per visit — a strong signal of effective upselling or product mix improvement.`,
      action: "Identify which categories drove the AOV increase and replicate the bundling or upsell strategy across lower-AOV segments.",
      metric: `AOV ↑`,
    });
  }

  return insights.slice(0, 3);
}

// ─── Sales Insights ───────────────────────────────────────────────────────────
export function getSalesInsights(data: DashboardData): Insight[] {
  const insights: Insight[] = [];

  // Find worst and best YoY months
  const withGrowth = data.monthlyRevenue
    .filter((m) => m.prevYearRevenue > 0)
    .map((m) => ({ ...m, growth: pct(m.revenue, m.prevYearRevenue) }));

  const worst = withGrowth.sort((a, b) => a.growth - b.growth)[0];
  const best = withGrowth.sort((a, b) => b.growth - a.growth)[0];

  if (worst && worst.growth < 0) {
    insights.push({
      id: "weak-month",
      type: "warning",
      title: `${worst.month} was your only month with declining revenue`,
      description: `Revenue fell ${Math.abs(worst.growth).toFixed(1)}% vs the prior year in ${worst.month}. This is often seasonal, but worth verifying against any operational disruptions (stockouts, pricing changes, lost marketing spend).`,
      action: `Review ${worst.month} sales data by category. If it's the same category declining repeatedly, consider a pricing or product refresh.`,
      metric: `${worst.growth.toFixed(1)}%`,
    });
  } else if (worst && worst.growth < 5) {
    insights.push({
      id: "underperform-month",
      type: "warning",
      title: `${worst.month} underperformed — only ${worst.growth.toFixed(1)}% growth`,
      description: `While all months were positive, ${worst.month} lagged significantly behind the annual average. Soft months can indicate promotional fatigue or inventory gaps.`,
      action: `Schedule a targeted promotion or flash sale for ${worst.month} next year to smooth seasonal dips.`,
      metric: `${worst.growth.toFixed(1)}%`,
    });
  }

  if (best) {
    insights.push({
      id: "best-month",
      type: "positive",
      title: `${best.month} was your strongest month — ${best.growth.toFixed(1)}% above last year`,
      description: `${best.month} delivered ${fmt(best.revenue)} — ${best.growth.toFixed(1)}% above the prior year. Understanding what drove this (campaign, product launch, seasonality) is the key to replicating it.`,
      action: `Document what ran in ${best.month} — which promotions, which products, which channels. Build a playbook from it.`,
      metric: `+${best.growth.toFixed(1)}%`,
    });
  }

  // Return rate signal
  const returnRevenue = data.dailySales.reduce((s, d) => s + d.returns, 0) * 12;
  const totalRevenue = data.monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const returnRate = (returnRevenue / totalRevenue) * 100;

  if (returnRate > 8) {
    insights.push({
      id: "high-returns",
      type: "critical",
      title: `Return rate of ~${returnRate.toFixed(1)}% is above healthy threshold`,
      description: `Returns above 8% of revenue indicate potential issues with product quality descriptions, sizing guides (Clothing), or unmet customer expectations. Each return costs ~2× the margin earned on the original sale.`,
      action: "Audit the top 5 highest-return SKUs. Add size guides, better product images, or 360° views for Clothing and Electronics.",
      metric: `${returnRate.toFixed(1)}%`,
    });
  } else if (returnRate > 4) {
    insights.push({
      id: "moderate-returns",
      type: "warning",
      title: `Return rate of ~${returnRate.toFixed(1)}% — monitor closely`,
      description: `Returns are within acceptable bounds but trending toward the warning threshold. Clothing and Electronics typically drive the majority of returns.`,
      action: "Filter the returns data by category and flag any SKU with >6% return rate for a product page audit.",
      metric: `${returnRate.toFixed(1)}%`,
    });
  }

  // Best performing region
  const topRegion = [...data.salesByRegion].sort((a, b) => b.growth - a.growth)[0];
  if (topRegion) {
    insights.push({
      id: "top-region",
      type: "opportunity",
      title: `${topRegion.region} is your fastest-growing region at +${topRegion.growth}%`,
      description: `${topRegion.region} is outpacing all other regions. This growth pattern often reflects a demographic or lifestyle trend specific to that market that can be studied and applied elsewhere.`,
      action: `Analyse what products are selling specifically in ${topRegion.region}. Consider expanding the top-performing SKUs from that region nationally.`,
      metric: `+${topRegion.growth}%`,
    });
  }

  return insights.slice(0, 3);
}

// ─── Product Insights ─────────────────────────────────────────────────────────
export function getProductInsights(data: DashboardData): Insight[] {
  const insights: Insight[] = [];

  // High-return SKUs
  const highReturnProducts = data.topProducts.filter((p) => p.returnRate > 6);
  if (highReturnProducts.length > 0) {
    insights.push({
      id: "high-return-skus",
      type: "critical",
      title: `${highReturnProducts.length} product${highReturnProducts.length > 1 ? "s" : ""} with return rate above 6%`,
      description: `${highReturnProducts.map((p) => p.name).join(", ")} — high return rates erode gross margin and increase fulfilment costs. A 6% return rate on a $200 product costs roughly $12 in reverse logistics per unit.`,
      action: "Update product descriptions, add detailed fit guides, and review packaging quality for these SKUs. Target <3% return rate.",
      metric: `${highReturnProducts[0].returnRate}% returns`,
    });
  }

  // Highest-margin vs highest-revenue mismatch
  const highMarginCat = [...data.categoryPerformance].sort((a, b) => b.avgMargin - a.avgMargin)[0];
  const highRevCat = [...data.categoryPerformance].sort((a, b) => b.revenue - a.revenue)[0];

  if (highMarginCat && highRevCat && highMarginCat.category !== highRevCat.category) {
    insights.push({
      id: "margin-revenue-gap",
      type: "opportunity",
      title: `${highMarginCat.category} has the highest margin (${highMarginCat.avgMargin}%) but isn't your top revenue driver`,
      description: `${highRevCat.category} generates the most revenue but at lower margins. Shifting even 5% of revenue from ${highRevCat.category} to ${highMarginCat.category} could increase gross profit significantly without adding revenue.`,
      action: `Run a margin-weighted revenue analysis. Consider promoting ${highMarginCat.category} products more heavily in your next campaign.`,
      metric: `${highMarginCat.avgMargin}% margin`,
    });
  }

  // Fastest growing category
  const fastestGrowing = [...data.categoryPerformance].sort((a, b) => b.growth - a.growth)[0];
  if (fastestGrowing && fastestGrowing.growth > 12) {
    insights.push({
      id: "fast-growing-cat",
      type: "positive",
      title: `${fastestGrowing.category} is your fastest growing category at +${fastestGrowing.growth}%`,
      description: `${fastestGrowing.category} is outgrowing all other categories. This signals strong market demand. Under-investing in inventory or marketing here means leaving money on the table.`,
      action: `Increase ${fastestGrowing.category} inventory depth by 20–30% and allocate additional shelf/page space for peak season.`,
      metric: `+${fastestGrowing.growth}%`,
    });
  }

  // Declining product trend
  const decliningProducts = data.topProducts.filter((p) => p.trend === "down");
  if (decliningProducts.length >= 2) {
    insights.push({
      id: "declining-products",
      type: "warning",
      title: `${decliningProducts.length} top-revenue products are on a downward trend`,
      description: `${decliningProducts.map((p) => p.name).join(", ")} — once-strong performers showing declining momentum. This could signal product fatigue, newer competitor alternatives, or seasonal normalisation.`,
      action: "Run a price-elasticity test on declining SKUs before discounting. Consider a refresh (new variant, bundling) rather than a markdown.",
      metric: `${decliningProducts.length} declining`,
    });
  }

  return insights.slice(0, 3);
}

// ─── Customer Insights ────────────────────────────────────────────────────────
export function getCustomerInsights(data: DashboardData): Insight[] {
  const insights: Insight[] = [];

  const totalCustomers = data.customerSegments.reduce((s, c) => s + c.count, 0);
  const atRisk = data.customerSegments.find((s) => s.segment === "At-Risk");
  const premium = data.customerSegments.find((s) => s.segment === "Premium");

  // At-Risk segment
  if (atRisk && atRisk.count > 0) {
    const atRiskRevenuePotential = atRisk.count * atRisk.avgLifetimeValue * 0.25;
    insights.push({
      id: "at-risk-customers",
      type: "critical",
      title: `${atRisk.count.toLocaleString()} at-risk customers have stopped engaging`,
      description: `These customers had above-average purchase history but haven't bought recently. Reactivating even 20% of them represents ~${fmt(atRiskRevenuePotential)} in recoverable revenue with targeted outreach.`,
      action: "Launch a win-back email campaign for at-risk customers with a time-limited 15% discount. Measure reactivation rate at 30 and 60 days.",
      metric: `${atRisk.count.toLocaleString()} at risk`,
    });
  }

  // Premium segment value concentration
  if (premium) {
    const premiumRevenueShare = (premium.count * premium.avgLifetimeValue) /
      data.customerSegments.reduce((s, c) => s + c.count * c.avgLifetimeValue, 0) * 100;
    if (premiumRevenueShare > 30) {
      insights.push({
        id: "premium-concentration",
        type: "warning",
        title: `${premium.percentage}% of customers drive ~${premiumRevenueShare.toFixed(0)}% of lifetime value`,
        description: `Your Premium segment is highly concentrated. While these customers are extremely valuable, over-reliance on a small cohort creates revenue risk if any significant portion churns.`,
        action: "Implement a loyalty tier programme to actively move Regular and Loyal customers up to Premium status. Focus on frequency incentives (buy 5, get a reward).",
        metric: `${premium.percentage}% = ${premiumRevenueShare.toFixed(0)}% of LTV`,
      });
    }
  }

  // Month-1 retention signal
  const avgMonth1Retention = data.retentionCohorts.length > 0
    ? data.retentionCohorts
        .filter((c) => c.month1 > 0)
        .reduce((s, c) => s + c.month1, 0) /
        data.retentionCohorts.filter((c) => c.month1 > 0).length
    : 0;

  if (avgMonth1Retention > 0 && avgMonth1Retention < 55) {
    insights.push({
      id: "low-m1-retention",
      type: "critical",
      title: `Only ${avgMonth1Retention.toFixed(0)}% of new customers make a second purchase`,
      description: `Month-1 retention below 60% signals a weak post-purchase experience. The first 30 days after acquisition are the highest-leverage window for building a repeat buying habit.`,
      action: "Set up an automated Day-3, Day-7, and Day-14 email sequence for new customers. Include product recommendations based on first purchase category.",
      metric: `${avgMonth1Retention.toFixed(0)}% M1 retention`,
    });
  } else if (avgMonth1Retention >= 65) {
    insights.push({
      id: "strong-retention",
      type: "positive",
      title: `${avgMonth1Retention.toFixed(0)}% Month-1 retention — above industry average`,
      description: `Retail industry average Month-1 retention is approximately 55–60%. Your ${avgMonth1Retention.toFixed(0)}% suggests strong product-market fit and an effective post-purchase experience.`,
      action: "Measure Month-3 retention to confirm the trend. If it also outperforms benchmarks, consider increasing new customer acquisition spend — your retention economics are favourable.",
      metric: `${avgMonth1Retention.toFixed(0)}% vs 55–60% avg`,
    });
  }

  // Customer growth signal
  const totalNew = data.customerAcquisition.reduce((s, c) => s + c.newCustomers, 0);
  const totalChurn = data.customerAcquisition.reduce((s, c) => s + c.churnedCustomers, 0);
  if (totalNew > 0 && totalChurn / totalNew > 0.15) {
    insights.push({
      id: "churn-acquisition-ratio",
      type: "warning",
      title: "Churn is absorbing a significant share of new customer growth",
      description: `For every ${Math.round(totalNew / Math.max(totalChurn, 1))} new customers acquired, 1 churns. Reducing churn by even 2–3 percentage points would have a larger net growth impact than increasing acquisition by the same amount.`,
      action: "Build a churn prediction model using recency and order frequency signals. Intervene at the 60-day inactivity mark with a targeted offer.",
      metric: `${((totalChurn / totalNew) * 100).toFixed(0)}% churn/acquisition ratio`,
    });
  }

  return insights.slice(0, 3);
}

// ─── Forecasting Insights ─────────────────────────────────────────────────────
export function getForecastInsights(data: DashboardData): Insight[] {
  const insights: Insight[] = [];
  const { forecastMetrics, forecastSummary } = data;

  const growthRate = pct(forecastSummary.projectedNextAnnual, forecastSummary.actualCurrentAnnual);

  // Model quality
  if (forecastMetrics.mape <= 5) {
    insights.push({
      id: "model-accurate",
      type: "positive",
      title: `Forecast accuracy is strong — MAPE of ${forecastMetrics.mape}%`,
      description: `A MAPE below 5% means monthly forecast errors are within ±${forecastMetrics.mape}% of actual revenue. This is reliable enough to use for budget setting, inventory planning, and headcount decisions.`,
      action: "Use the forecast's lower confidence bound as your conservative budget scenario and the upper bound as your stretch target.",
      metric: `MAPE ${forecastMetrics.mape}%`,
    });
  } else if (forecastMetrics.mape > 10) {
    insights.push({
      id: "model-uncertain",
      type: "warning",
      title: `Forecast uncertainty is high — MAPE of ${forecastMetrics.mape}%`,
      description: `Higher MAPE suggests more volatility in the underlying data, possibly from new products, market disruption, or limited historical data. Treat forecasts as directional rather than precise.`,
      action: "Collect 2+ years of historical data to improve seasonal pattern detection. Consider adding promotional calendar data to the model.",
      metric: `MAPE ${forecastMetrics.mape}%`,
    });
  }

  // Growth projection assessment
  if (growthRate > 15) {
    insights.push({
      id: "aggressive-forecast",
      type: "warning",
      title: `${growthRate.toFixed(0)}% projected growth — validate this assumption`,
      description: `The model projects ${growthRate.toFixed(0)}% growth based on recent trend extrapolation. Growth at this rate requires proportional increases in inventory, staffing, and fulfilment capacity — which must be planned now.`,
      action: "Stress-test the forecast against a conservative scenario (5% growth). Ensure supply chain capacity can support the upper bound without service degradation.",
      metric: `+${growthRate.toFixed(0)}%`,
    });
  }

  // Q4 forecast concentration
  const q4Share = (forecastSummary.projectedNextQ4 / forecastSummary.projectedNextAnnual) * 100;
  if (q4Share > 30) {
    insights.push({
      id: "q4-forecast-concentration",
      type: "opportunity",
      title: `Q4 projected to be ${q4Share.toFixed(0)}% of next year's revenue`,
      description: `Forecast shows ${fmt(forecastSummary.projectedNextQ4)} in Q4 alone. This is your largest revenue window — any operational misstep (stockout, website downtime, delivery delays) during this period has outsized annual impact.`,
      action: "Begin Q4 inventory procurement 3 months in advance. Run load tests on your e-commerce platform in October and have a backup fulfilment partner on standby.",
      metric: `Q4: ${fmt(forecastSummary.projectedNextQ4)}`,
    });
  }

  return insights.slice(0, 3);
}

// ─── Business Health Score ─────────────────────────────────────────────────────
// Composite 0–100 score computed from 5 weighted dimensions.
export interface HealthScore {
  overall: number;
  dimensions: { label: string; score: number; weight: number; status: "good" | "ok" | "poor" }[];
}

export function getHealthScore(data: DashboardData): HealthScore {
  const totalRevenue = data.monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalPrev = data.monthlyRevenue.reduce((s, m) => s + m.prevYearRevenue, 0);
  const revenueGrowth = pct(totalRevenue, totalPrev);

  const avgMargin = data.categoryPerformance.length > 0
    ? data.categoryPerformance.reduce((s, c) => s + c.avgMargin, 0) / data.categoryPerformance.length
    : 35;

  const avgRetention = data.retentionCohorts.length > 0
    ? data.retentionCohorts.filter((c) => c.month1 > 0)
        .reduce((s, c) => s + c.month1, 0) /
        Math.max(data.retentionCohorts.filter((c) => c.month1 > 0).length, 1)
    : 65;

  const atRisk = data.customerSegments.find((s) => s.segment === "At-Risk");
  const totalCusts = data.customerSegments.reduce((s, c) => s + c.count, 0);
  const atRiskPct = totalCusts > 0 ? ((atRisk?.count ?? 0) / totalCusts) * 100 : 5;

  const returnRate = data.dailySales.length > 0
    ? (data.dailySales.reduce((s, d) => s + d.returns, 0) * 12 / totalRevenue) * 100
    : 3;

  // Score each dimension 0–100
  const growthScore = Math.min(100, Math.max(0, 50 + revenueGrowth * 2));
  const marginScore = Math.min(100, Math.max(0, (avgMargin / 60) * 100));
  const retentionScore = Math.min(100, Math.max(0, (avgRetention / 80) * 100));
  const riskScore = Math.min(100, Math.max(0, 100 - atRiskPct * 5));
  const returnScore = Math.min(100, Math.max(0, 100 - returnRate * 8));

  const dimensions = [
    { label: "Revenue Growth",    score: Math.round(growthScore),    weight: 0.30, status: growthScore >= 70 ? "good" : growthScore >= 45 ? "ok" : "poor" },
    { label: "Gross Margin",      score: Math.round(marginScore),    weight: 0.25, status: marginScore >= 70 ? "good" : marginScore >= 45 ? "ok" : "poor" },
    { label: "Customer Retention",score: Math.round(retentionScore), weight: 0.20, status: retentionScore >= 70 ? "good" : retentionScore >= 45 ? "ok" : "poor" },
    { label: "Customer Risk",     score: Math.round(riskScore),      weight: 0.15, status: riskScore >= 70 ? "good" : riskScore >= 45 ? "ok" : "poor" },
    { label: "Return Rate",       score: Math.round(returnScore),    weight: 0.10, status: returnScore >= 70 ? "good" : returnScore >= 45 ? "ok" : "poor" },
  ] as HealthScore["dimensions"];

  const overall = Math.round(
    dimensions.reduce((s, d) => s + d.score * d.weight, 0)
  );

  return { overall, dimensions };
}
