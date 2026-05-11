import type { CustomerSegment, CustomerAcquisition, RetentionCohort } from "@/types";

// ─── Customer segments (RFM-based classification) ─────────────────────────────
// Premium: high frequency + high spend; At-Risk: declining engagement
export const customerSegmentData: CustomerSegment[] = [
  { segment: "Premium",    count: 6_782,  percentage: 15.1, avgLifetimeValue: 2_340, avgOrderFrequency: 9.2,  color: "#6366f1" },
  { segment: "Loyal",      count: 12_456, percentage: 27.7, avgLifetimeValue: 1_120, avgOrderFrequency: 5.4,  color: "#8b5cf6" },
  { segment: "Regular",    count: 14_234, percentage: 31.6, avgLifetimeValue:   489, avgOrderFrequency: 2.8,  color: "#06b6d4" },
  { segment: "Occasional", count: 8_987,  percentage: 20.0, avgLifetimeValue:   187, avgOrderFrequency: 1.2,  color: "#10b981" },
  { segment: "At-Risk",    count: 2_432,  percentage:  5.4, avgLifetimeValue:   312, avgOrderFrequency: 0.6,  color: "#f59e0b" },
  { segment: "Churned",    count:   109,  percentage:  0.2, avgLifetimeValue:    45, avgOrderFrequency: 0.1,  color: "#ef4444" },
];

// ─── Monthly customer acquisition vs churn (Jan–Dec 2024) ─────────────────────
export const customerAcquisitionData: CustomerAcquisition[] = [
  { month: "Jan", newCustomers: 1_234, returningCustomers: 3_087, churnedCustomers: 312 },
  { month: "Feb", newCustomers: 1_089, returningCustomers: 2_923, churnedCustomers: 287 },
  { month: "Mar", newCustomers: 1_456, returningCustomers: 3_333, churnedCustomers: 298 },
  { month: "Apr", newCustomers: 1_623, returningCustomers: 3_479, churnedCustomers: 276 },
  { month: "May", newCustomers: 1_789, returningCustomers: 3_445, churnedCustomers: 264 },
  { month: "Jun", newCustomers: 1_567, returningCustomers: 3_420, churnedCustomers: 289 },
  { month: "Jul", newCustomers: 1_834, returningCustomers: 3_622, churnedCustomers: 257 },
  { month: "Aug", newCustomers: 1_956, returningCustomers: 3_833, churnedCustomers: 243 },
  { month: "Sep", newCustomers: 1_678, returningCustomers: 3_445, churnedCustomers: 268 },
  { month: "Oct", newCustomers: 2_012, returningCustomers: 3_975, churnedCustomers: 231 },
  { month: "Nov", newCustomers: 3_456, returningCustomers: 5_520, churnedCustomers: 198 },
  { month: "Dec", newCustomers: 3_789, returningCustomers: 6_087, churnedCustomers: 176 },
];

// ─── Cohort retention analysis (% of original cohort still active) ────────────
// Each row = cohort acquired in that month; columns = months since acquisition
export const retentionCohortData: RetentionCohort[] = [
  { cohort: "Jan 2024", month0: 100, month1: 62, month2: 47, month3: 38, month6: 28, month12: 21 },
  { cohort: "Feb 2024", month0: 100, month1: 64, month2: 48, month3: 40, month6: 29, month12: 22 },
  { cohort: "Mar 2024", month0: 100, month1: 65, month2: 50, month3: 41, month6: 31, month12: 23 },
  { cohort: "Apr 2024", month0: 100, month1: 66, month2: 52, month3: 43, month6: 32, month12: 24 },
  { cohort: "May 2024", month0: 100, month1: 68, month2: 53, month3: 44, month6: 33, month12: 0  },
  { cohort: "Jun 2024", month0: 100, month1: 67, month2: 51, month3: 42, month6: 31, month12: 0  },
  { cohort: "Jul 2024", month0: 100, month1: 69, month2: 54, month3: 45, month6: 0,  month12: 0  },
  { cohort: "Aug 2024", month0: 100, month1: 71, month2: 55, month3: 46, month6: 0,  month12: 0  },
  { cohort: "Sep 2024", month0: 100, month1: 70, month2: 54, month3: 0,  month6: 0,  month12: 0  },
  { cohort: "Oct 2024", month0: 100, month1: 72, month2: 56, month3: 0,  month6: 0,  month12: 0  },
  { cohort: "Nov 2024", month0: 100, month1: 74, month2: 0,  month3: 0,  month6: 0,  month12: 0  },
  { cohort: "Dec 2024", month0: 100, month1: 0,  month2: 0,  month3: 0,  month6: 0,  month12: 0  },
];
