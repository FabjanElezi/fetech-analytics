# FETech Analytics — Retail BI Platform

A full-stack Business Intelligence dashboard for retail sales analytics. Built with Next.js 15, TypeScript, Recharts, and Tailwind CSS — designed to feel like a real enterprise analytics SaaS product.

---

## Overview

FETech Analytics is a **retail-focused BI platform** that gives business stakeholders a single pane of glass into their company's performance. It covers revenue trends, product performance, customer segmentation, and 12-month revenue forecasting — all rendered with interactive charts and clean data tables.

The platform is intentionally scoped to a single retail company (rather than multi-tenant SaaS), making it a realistic model for what an in-house analytics team or a junior BI analyst would build and maintain.

---

## Features

### Dashboard Overview
- Four KPI cards: Total Revenue, Total Orders, Average Order Value, Active Customers — all with year-over-year change indicators
- Monthly revenue bar chart with 2023 vs 2024 YoY comparison
- Revenue-by-category donut chart (five product categories)
- Regional revenue breakdown with YoY growth rates
- Recent orders table with status badges and channel indicators

### Sales Analytics
- KPI summary: Revenue, Orders, Returns Value, Gross Margin
- Monthly YoY revenue comparison (grouped bar chart)
- 30-day daily revenue area chart (December 2024)
- Regional revenue horizontal bar chart
- Sales channel breakdown with progress bars (In-Store, Online, Mobile, Phone)

### Product Analytics
- Category performance: Revenue, Gross Margin, Units, YoY Growth (four bar charts)
- Top 12 products ranked by annual revenue, with SKU, margin %, return rate, and trend indicators

### Customer Analytics
- Customer segmentation via RFM classification (Premium, Loyal, Regular, Occasional, At-Risk)
- Segment detail table with average LTV and order frequency
- Monthly new vs returning customer area chart
- Cohort retention heatmap (12 cohorts x 6 time periods) with colour-coded intensity

### Revenue Forecasting
- 24-month combined chart: 2024 actuals + 2025 projections with 90% confidence band
- Model methodology card (ETS, smoothing factor, seasonality, growth assumption)
- Six accuracy metric tiles (MAPE, RMSE, R-squared, CI Level, Growth Rate, Horizon)
- Monthly 2025 forecast table with lower/upper bounds and delta vs 2024

---

## Architecture

```
src/
├── app/                    # Next.js App Router pages (Server Components)
│   ├── layout.tsx          # Root layout with persistent sidebar
│   ├── page.tsx            # Dashboard overview
│   ├── sales/page.tsx      # Sales analytics
│   ├── products/page.tsx   # Product performance
│   ├── customers/page.tsx  # Customer analytics & cohort retention
│   └── forecasting/page.tsx # Revenue forecasting + methodology
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx     # Fixed left navigation (Client Component)
│   │   └── Header.tsx      # Top bar with date range & export button
│   ├── ui/
│   │   ├── KPICard.tsx     # Metric card with trend arrow + YoY change
│   │   └── SectionCard.tsx # Titled card container with optional action
│   ├── charts/             # Recharts wrappers — all "use client"
│   │   ├── RevenueChart.tsx
│   │   ├── CategoryDonutChart.tsx
│   │   ├── RegionBarChart.tsx
│   │   ├── DailySalesChart.tsx
│   │   ├── CategoryBarChart.tsx
│   │   ├── CustomerSegmentChart.tsx
│   │   ├── CustomerAcquisitionChart.tsx
│   │   └── ForecastChart.tsx
│   └── tables/
│       ├── RecentOrdersTable.tsx
│       └── TopProductsTable.tsx
├── lib/
│   ├── utils.ts            # formatCurrency, calcPercentChange, cn()
│   └── data/               # Typed mock data fixtures
│       ├── salesData.ts
│       ├── productData.ts
│       ├── customerData.ts
│       └── forecastData.ts
└── types/
    └── index.ts            # Shared TypeScript domain interfaces
```

**Data flow:** All pages are Next.js Server Components that import typed mock data from `src/lib/data/`. Chart components are Client Components (Recharts requires browser APIs). There is no runtime database or API layer — data is static fixtures designed to be swapped for real API calls or a query layer.

---

## Tech Stack

| Layer        | Technology                       |
|--------------|----------------------------------|
| Framework    | Next.js 15 (App Router)          |
| Language     | TypeScript 5                     |
| Styling      | Tailwind CSS v4                  |
| Charts       | Recharts 2                       |
| Icons        | Lucide React                     |
| Utilities    | clsx + tailwind-merge            |
| Build tool   | Turbopack (Next.js built-in)     |
| Runtime      | Node.js 20+                      |

---

## Installation

**Prerequisites:** Node.js 20 or later, npm 9 or later.

```bash
# 1. Navigate to the project directory
cd "C:\FETech Analytics"

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open http://localhost:3000 in your browser.

### Available Scripts

| Command         | Description                                  |
|-----------------|----------------------------------------------|
| `npm run dev`   | Start development server with hot reload     |
| `npm run build` | Create optimised production build            |
| `npm start`     | Serve the production build locally           |
| `npm run lint`  | Run ESLint on all source files               |

---

## Deployment

### Deploy to Vercel (Recommended)

This project is configured for zero-config deployment on Vercel.

```bash
# Install the Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

Alternatively, push to GitHub and connect the repository to Vercel via the dashboard. Vercel auto-detects the Next.js framework and configures the build pipeline.

### Environment Variables

No environment variables are required for the current mock-data version. When connecting to a real data source, add to `.env.local`:

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## Future Improvements

| Priority | Improvement |
|----------|-------------|
| High     | Replace mock data with PostgreSQL (Neon/Supabase) + Prisma |
| High     | Date range picker with dynamic chart filtering |
| Medium   | CSV/PDF export for all tables and charts |
| Medium   | Upgrade forecasting model to ARIMA/Prophet via Python API |
| Medium   | Role-based access control (Admin / Analyst / Read-only) |
| Low      | Multi-store / multi-brand tenant support |
| Low      | Real-time updates via WebSocket / SSE |
| Low      | OpenTelemetry observability instrumentation |

---

## License

MIT — free to use, modify, and deploy for portfolio, commercial, and educational purposes.
