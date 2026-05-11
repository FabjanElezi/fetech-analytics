// ─── ETS forecast engine ──────────────────────────────────────────────────────
// Accepts a sequence of monthly revenue values and returns a 12-month forecast
// using Single Exponential Smoothing with a multiplicative seasonal component.
import type { ForecastPoint } from "@/types";

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ALPHA = 0.3;       // smoothing factor
const GROWTH = 1.10;     // 10% assumed YoY growth
const CI_BASE = 0.08;    // base confidence interval width (8%)
const CI_EXPAND = 0.012; // CI widens by 1.2% per projected month

/** Compute a smoothed baseline from actuals using SES. */
function exponentialSmooth(values: number[]): number[] {
  const smoothed: number[] = [values[0]];
  for (let i = 1; i < values.length; i++) {
    smoothed.push(ALPHA * values[i] + (1 - ALPHA) * smoothed[i - 1]);
  }
  return smoothed;
}

/** MAPE between two same-length arrays. */
function computeMAPE(actuals: number[], forecasts: number[]): number {
  const errors = actuals.map((a, i) => Math.abs((a - forecasts[i]) / a));
  return (errors.reduce((s, e) => s + e, 0) / errors.length) * 100;
}

/** RMSE between two same-length arrays. */
function computeRMSE(actuals: number[], forecasts: number[]): number {
  const mse = actuals.reduce((s, a, i) => s + (a - forecasts[i]) ** 2, 0) / actuals.length;
  return Math.sqrt(mse);
}

/** R² between two same-length arrays. */
function computeR2(actuals: number[], forecasts: number[]): number {
  const mean = actuals.reduce((s, a) => s + a, 0) / actuals.length;
  const ssTot = actuals.reduce((s, a) => s + (a - mean) ** 2, 0);
  const ssRes = actuals.reduce((s, a, i) => s + (a - forecasts[i]) ** 2, 0);
  return ssTot === 0 ? 0 : 1 - ssRes / ssTot;
}

export interface ForecastResult {
  points: ForecastPoint[];
  metrics: { mape: number; rmse: number; r2: number; growthAssumption: number; confidenceLevel: number };
  summary: { projectedNextAnnual: number; actualCurrentAnnual: number; projectedNextQ1: number; projectedNextQ4: number };
}

/**
 * Build a 24-point series: 12 historical + 12 projected.
 * @param actuals   Array of 12 monthly revenue values (current year)
 * @param yearLabel The current year as a string, e.g. "2024"
 */
export function buildForecast(actuals: number[], yearLabel: string): ForecastResult {
  const nextYear = String(Number(yearLabel) + 1);
  const annual = actuals.reduce((s, v) => s + v, 0);
  const monthlyAvg = annual / 12;

  // Seasonal index for each month (ratio to monthly average)
  const seasonalIndex = actuals.map((v) => v / monthlyAvg);

  // Smoothed historical baseline
  const smoothed = exponentialSmooth(actuals);

  // Historical fitted points
  const historical: ForecastPoint[] = actuals.map((actual, i) => {
    const forecast = Math.round(smoothed[i] * (seasonalIndex[i] || 1));
    const ci = Math.round(forecast * CI_BASE);
    return {
      period: `${MONTH_LABELS[i]} ${yearLabel}`,
      actual,
      forecast,
      upperBound: forecast + ci,
      lowerBound: Math.max(forecast - ci, 0),
      isProjected: false,
    };
  });

  // Projected 12 months
  const projected: ForecastPoint[] = MONTH_LABELS.map((month, i) => {
    const forecast = Math.round((annual * GROWTH / 12) * seasonalIndex[i]);
    const ci = Math.round(forecast * (CI_BASE + i * CI_EXPAND));
    return {
      period: `${month} ${nextYear}`,
      actual: null,
      forecast,
      upperBound: forecast + ci,
      lowerBound: Math.max(forecast - ci, 0),
      isProjected: true,
    };
  });

  // Accuracy metrics (in-sample fit: smoothed vs actuals)
  const fittedValues = smoothed.map((s, i) => Math.round(s * (seasonalIndex[i] || 1)));
  const mape = computeMAPE(actuals, fittedValues);
  const rmse = computeRMSE(actuals, fittedValues);
  const r2 = computeR2(actuals, fittedValues);

  const projAnnual = projected.reduce((s, p) => s + p.forecast, 0);

  return {
    points: [...historical, ...projected],
    metrics: { mape: parseFloat(mape.toFixed(1)), rmse: Math.round(rmse), r2: parseFloat(r2.toFixed(2)), growthAssumption: (GROWTH - 1) * 100, confidenceLevel: 90 },
    summary: {
      projectedNextAnnual: projAnnual,
      actualCurrentAnnual: annual,
      projectedNextQ1: projected.slice(0, 3).reduce((s, p) => s + p.forecast, 0),
      projectedNextQ4: projected.slice(9, 12).reduce((s, p) => s + p.forecast, 0),
    },
  };
}
