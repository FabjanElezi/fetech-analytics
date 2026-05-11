import type { Product, CategoryPerformance } from "@/types";

// ─── Top 12 products by annual revenue ────────────────────────────────────────
export const topProductsData: Product[] = [
  { id: "P001", name: "Dell XPS 15 Laptop",        category: "Electronics",        sku: "EL-DX15-001", revenue: 423_780, unitsSold: 326,   avgPrice: 1_299.9, margin: 28.4, returnRate: 1.8, trend: "up"   },
  { id: "P002", name: "Apple Watch Series 10",     category: "Electronics",        sku: "EL-AW10-001", revenue: 398_520, unitsSold: 930,   avgPrice: 428.5,  margin: 31.2, returnRate: 2.1, trend: "up"   },
  { id: "P003", name: "Dyson V15 Detect",          category: "Home & Garden",      sku: "HG-DV15-001", revenue: 349_900, unitsSold: 500,   avgPrice: 699.8,  margin: 35.6, returnRate: 3.2, trend: "up"   },
  { id: "P004", name: "Sony WH-1000XM5",           category: "Electronics",        sku: "EL-SW1-001",  revenue: 332_440, unitsSold: 950,   avgPrice: 349.9,  margin: 29.8, returnRate: 1.4, trend: "flat" },
  { id: "P005", name: "KitchenAid Stand Mixer",    category: "Home & Garden",      sku: "HG-KA-001",   revenue: 314_650, unitsSold: 700,   avgPrice: 449.5,  margin: 38.2, returnRate: 2.8, trend: "up"   },
  { id: "P006", name: "North Face Parka",          category: "Clothing & Apparel", sku: "CA-NF-001",   revenue: 298_760, unitsSold: 1_578, avgPrice: 189.3,  margin: 52.4, returnRate: 6.7, trend: "up"   },
  { id: "P007", name: "Weber Genesis E-325",       category: "Home & Garden",      sku: "HG-WG-001",   revenue: 287_400, unitsSold: 261,   avgPrice: 1_101.1,margin: 22.1, returnRate: 1.1, trend: "flat" },
  { id: "P008", name: "Trek Marlin 7 MTB",         category: "Sports & Outdoors",  sku: "SO-TM7-001",  revenue: 264_300, unitsSold: 315,   avgPrice: 839.1,  margin: 19.8, returnRate: 0.9, trend: "up"   },
  { id: "P009", name: "Levi's 501 Original (5-pk)",category: "Clothing & Apparel", sku: "CA-LV-001",   revenue: 243_210, unitsSold: 3_432, avgPrice: 70.9,   margin: 58.3, returnRate: 8.4, trend: "down" },
  { id: "P010", name: "Instant Pot Duo 7-in-1",   category: "Home & Garden",      sku: "HG-IP-001",   revenue: 221_780, unitsSold: 2_197, avgPrice: 101.0,  margin: 41.6, returnRate: 3.9, trend: "down" },
  { id: "P011", name: "Garmin Fenix 7 Pro",        category: "Electronics",        sku: "EL-GF7-001",  revenue: 213_490, unitsSold: 317,   avgPrice: 673.2,  margin: 27.3, returnRate: 1.7, trend: "up"   },
  { id: "P012", name: "Vitamix 5200 Blender",      category: "Home & Garden",      sku: "HG-VM-001",   revenue: 198_760, unitsSold: 523,   avgPrice: 380.0,  margin: 33.7, returnRate: 2.3, trend: "flat" },
];

// ─── Category-level performance summary ───────────────────────────────────────
export const categoryPerformanceData: CategoryPerformance[] = [
  { category: "Electronics",        revenue: 5_423_890, units: 18_432, avgMargin: 29.1, growth: 14.3, color: "#6366f1" },
  { category: "Clothing & Apparel", revenue: 3_987_230, units: 32_145, avgMargin: 54.2, growth:  9.8, color: "#8b5cf6" },
  { category: "Home & Garden",      revenue: 3_234_560, units: 24_678, avgMargin: 36.8, growth: 11.5, color: "#06b6d4" },
  { category: "Sports & Outdoors",  revenue: 1_876_450, units: 14_321, avgMargin: 23.4, growth: 18.7, color: "#10b981" },
  { category: "Food & Beverage",    revenue: 1_311_430, units: 41_234, avgMargin: 44.6, growth:  6.2, color: "#f59e0b" },
];
