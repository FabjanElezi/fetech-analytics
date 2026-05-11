import type {
  MonthlyRevenue,
  DailySales,
  SalesByCategory,
  SalesByRegion,
  SalesByChannel,
  RecentOrder,
} from "@/types";

// ─── Monthly revenue: 2023 vs 2024 ────────────────────────────────────────────
// Reflects seasonal retail patterns: slow Q1, strong Q4 (Black Friday, Holiday)
export const monthlyRevenueData: MonthlyRevenue[] = [
  { month: "Jan", year: 2024, revenue: 1_023_450, orders: 4_321, avgOrderValue: 236.8, prevYearRevenue: 892_340 },
  { month: "Feb", year: 2024, revenue: 987_230,  orders: 4_012, avgOrderValue: 246.1, prevYearRevenue: 843_120 },
  { month: "Mar", year: 2024, revenue: 1_145_670, orders: 4_789, avgOrderValue: 239.2, prevYearRevenue: 1_012_450 },
  { month: "Apr", year: 2024, revenue: 1_234_890, orders: 5_102, avgOrderValue: 242.0, prevYearRevenue: 1_087_670 },
  { month: "May", year: 2024, revenue: 1_289_540, orders: 5_234, avgOrderValue: 246.4, prevYearRevenue: 1_134_230 },
  { month: "Jun", year: 2024, revenue: 1_178_320, orders: 4_987, avgOrderValue: 236.3, prevYearRevenue: 1_056_780 },
  { month: "Jul", year: 2024, revenue: 1_312_450, orders: 5_456, avgOrderValue: 240.6, prevYearRevenue: 1_198_340 },
  { month: "Aug", year: 2024, revenue: 1_398_760, orders: 5_789, avgOrderValue: 241.6, prevYearRevenue: 1_267_890 },
  { month: "Sep", year: 2024, revenue: 1_234_560, orders: 5_123, avgOrderValue: 241.0, prevYearRevenue: 1_112_340 },
  { month: "Oct", year: 2024, revenue: 1_456_780, orders: 5_987, avgOrderValue: 243.3, prevYearRevenue: 1_312_450 },
  { month: "Nov", year: 2024, revenue: 2_134_560, orders: 8_976, avgOrderValue: 237.8, prevYearRevenue: 1_876_540 },
  { month: "Dec", year: 2024, revenue: 2_456_780, orders: 9_876, avgOrderValue: 248.8, prevYearRevenue: 2_123_450 },
];

// ─── Last 30 days of daily sales (rolling from Dec 2024) ──────────────────────
export const dailySalesData: DailySales[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2024, 11, 1 + i);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const base = isWeekend ? 95_000 : 72_000;
  const noise = (Math.sin(i * 1.3) + Math.cos(i * 0.7)) * 12_000;
  const revenue = Math.round(base + noise + (i > 20 ? 30_000 : 0)); // spike near Christmas
  return {
    date: date.toISOString().split("T")[0],
    revenue,
    orders: Math.round(revenue / 245),
    returns: Math.round(revenue * 0.032),
  };
});

// ─── Revenue by product category ──────────────────────────────────────────────
export const salesByCategoryData: SalesByCategory[] = [
  { category: "Electronics",       revenue: 5_423_890, units: 18_432, percentage: 34.2, color: "#6366f1" },
  { category: "Clothing & Apparel",revenue: 3_987_230, units: 32_145, percentage: 25.1, color: "#8b5cf6" },
  { category: "Home & Garden",     revenue: 3_234_560, units: 24_678, percentage: 20.4, color: "#06b6d4" },
  { category: "Sports & Outdoors", revenue: 1_876_450, units: 14_321, percentage: 11.8, color: "#10b981" },
  { category: "Food & Beverage",   revenue: 1_311_430, units: 41_234, percentage: 8.5,  color: "#f59e0b" },
];

// ─── Revenue by region ────────────────────────────────────────────────────────
export const salesByRegionData: SalesByRegion[] = [
  { region: "Northeast",  revenue: 4_234_560, orders: 17_432, growth: 12.4 },
  { region: "Southeast",  revenue: 3_456_780, orders: 14_234, growth: 8.7  },
  { region: "Midwest",    revenue: 3_123_450, orders: 12_876, growth: 11.2 },
  { region: "West",       revenue: 2_987_230, orders: 12_123, growth: 15.6 },
  { region: "Online",     revenue: 2_031_540, orders: 9_987,  growth: 22.3 },
];

// ─── Revenue by sales channel ─────────────────────────────────────────────────
export const salesByChannelData: SalesByChannel[] = [
  { channel: "In-Store",          revenue: 8_765_230, percentage: 55.2, orders: 36_789 },
  { channel: "Online (Website)",  revenue: 4_234_560, percentage: 26.7, orders: 17_432 },
  { channel: "Mobile App",        revenue: 2_234_560, percentage: 14.1, orders: 9_234  },
  { channel: "Phone / Call Center", revenue: 619_210, percentage: 3.9,  orders: 2_197  },
];

// ─── Recent orders table data ─────────────────────────────────────────────────
export const recentOrdersData: RecentOrder[] = [
  { id: "ORD-2024-09876", customer: "Sarah Mitchell",    product: "Dell XPS 15 Laptop",       category: "Electronics",        amount: 1_299.99, status: "completed",  date: "2024-12-30", channel: "online"   },
  { id: "ORD-2024-09875", customer: "James Thornton",    product: "Winter Parka (XL)",         category: "Clothing & Apparel",  amount: 189.00,   status: "processing", date: "2024-12-30", channel: "online"   },
  { id: "ORD-2024-09874", customer: "Maria Gonzalez",    product: "KitchenAid Stand Mixer",    category: "Home & Garden",       amount: 449.95,   status: "completed",  date: "2024-12-29", channel: "in-store" },
  { id: "ORD-2024-09873", customer: "David Park",        product: "Sony WH-1000XM5",           category: "Electronics",        amount: 349.99,   status: "completed",  date: "2024-12-29", channel: "online"   },
  { id: "ORD-2024-09872", customer: "Emma Johnson",      product: "Yoga Mat Pro + Blocks",     category: "Sports & Outdoors",   amount: 87.50,    status: "returned",   date: "2024-12-28", channel: "online"   },
  { id: "ORD-2024-09871", customer: "Robert Chen",       product: "Dyson V15 Detect",          category: "Home & Garden",       amount: 699.99,   status: "completed",  date: "2024-12-28", channel: "in-store" },
  { id: "ORD-2024-09870", customer: "Olivia Williams",   product: "Air Jordan 4 Retro",        category: "Clothing & Apparel",  amount: 210.00,   status: "completed",  date: "2024-12-27", channel: "online"   },
  { id: "ORD-2024-09869", customer: "Michael Brown",     product: "Organic Coffee Bundle",     category: "Food & Beverage",     amount: 54.99,    status: "completed",  date: "2024-12-27", channel: "in-store" },
  { id: "ORD-2024-09868", customer: "Sophia Davis",      product: "Apple Watch Series 10",     category: "Electronics",        amount: 429.00,   status: "processing", date: "2024-12-26", channel: "online"   },
  { id: "ORD-2024-09867", customer: "Daniel Wilson",     product: "Weber Genesis Grill",       category: "Home & Garden",       amount: 1_099.00, status: "completed",  date: "2024-12-26", channel: "in-store" },
];
