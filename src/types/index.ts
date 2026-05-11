// ─── Core domain types for the FETech Analytics BI platform ───────────────────

export interface KPIMetric {
  label: string;
  value: number;
  previousValue: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export interface MonthlyRevenue {
  month: string;          // "Jan", "Feb", ...
  year: number;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  prevYearRevenue: number;
}

export interface DailySales {
  date: string;           // "2024-01-01"
  revenue: number;
  orders: number;
  returns: number;
}

export interface SalesByCategory {
  category: string;
  revenue: number;
  units: number;
  percentage: number;
  color: string;
}

export interface SalesByRegion {
  region: string;
  revenue: number;
  orders: number;
  growth: number;         // % YoY growth
}

export interface SalesByChannel {
  channel: string;
  revenue: number;
  percentage: number;
  orders: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  revenue: number;
  unitsSold: number;
  avgPrice: number;
  margin: number;         // % gross margin
  returnRate: number;     // % return rate
  trend: "up" | "down" | "flat";
}

export interface CategoryPerformance {
  category: string;
  revenue: number;
  units: number;
  avgMargin: number;
  growth: number;
  color: string;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  percentage: number;
  avgLifetimeValue: number;
  avgOrderFrequency: number;  // orders per year
  color: string;
}

export interface CustomerAcquisition {
  month: string;
  newCustomers: number;
  returningCustomers: number;
  churnedCustomers: number;
}

export interface RetentionCohort {
  cohort: string;         // "Jan 2024"
  month0: number;         // 100%
  month1: number;
  month2: number;
  month3: number;
  month6: number;
  month12: number;
}

export interface ForecastPoint {
  period: string;         // "Jan 2025"
  actual: number | null;  // null for future periods
  forecast: number;
  upperBound: number;
  lowerBound: number;
  isProjected: boolean;
}

export interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  category: string;
  amount: number;
  status: "completed" | "processing" | "returned" | "cancelled";
  date: string;
  channel: "online" | "in-store";
}

// ─── Aggregate type that holds all data for one dashboard dataset ─────────────
export interface DashboardData {
  companyName: string;
  period: string;
  monthlyRevenue: MonthlyRevenue[];
  dailySales: DailySales[];
  salesByCategory: SalesByCategory[];
  salesByRegion: SalesByRegion[];
  salesByChannel: SalesByChannel[];
  recentOrders: RecentOrder[];
  topProducts: Product[];
  categoryPerformance: CategoryPerformance[];
  customerSegments: CustomerSegment[];
  customerAcquisition: CustomerAcquisition[];
  retentionCohorts: RetentionCohort[];
  forecastPoints: ForecastPoint[];
  forecastMetrics: {
    mape: number;
    rmse: number;
    r2: number;
    growthAssumption: number;
    confidenceLevel: number;
  };
  forecastSummary: {
    projectedNextAnnual: number;
    actualCurrentAnnual: number;
    projectedNextQ1: number;
    projectedNextQ4: number;
  };
  isCustomData: boolean;
  importedAt?: string;
  fileName?: string;
}
