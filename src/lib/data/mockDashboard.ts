// Assembles all individual mock data files into a single DashboardData object.
// This is the default dataset shown before any CSV is uploaded.
import type { DashboardData } from "@/types";
import {
  monthlyRevenueData,
  dailySalesData,
  salesByCategoryData,
  salesByRegionData,
  salesByChannelData,
  recentOrdersData,
} from "./salesData";
import { topProductsData, categoryPerformanceData } from "./productData";
import {
  customerSegmentData,
  customerAcquisitionData,
  retentionCohortData,
} from "./customerData";
import { forecastData, forecastMetrics, forecastSummary } from "./forecastData";

export const mockDashboard: DashboardData = {
  companyName: "Meridian Retail Group",
  period: "FY 2024 (Jan – Dec)",
  monthlyRevenue: monthlyRevenueData,
  dailySales: dailySalesData,
  salesByCategory: salesByCategoryData,
  salesByRegion: salesByRegionData,
  salesByChannel: salesByChannelData,
  recentOrders: recentOrdersData,
  topProducts: topProductsData,
  categoryPerformance: categoryPerformanceData,
  customerSegments: customerSegmentData,
  customerAcquisition: customerAcquisitionData,
  retentionCohorts: retentionCohortData,
  forecastPoints: forecastData,
  forecastMetrics,
  forecastSummary: {
    projectedNextAnnual: forecastSummary.projected2025Annual,
    actualCurrentAnnual: forecastSummary.actual2024Annual,
    projectedNextQ1: forecastSummary.projected2025Q1,
    projectedNextQ4: forecastSummary.projected2025Q4,
  },
  isCustomData: false,
};
