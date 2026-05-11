"use client";

import { Download } from "lucide-react";

const TECH_STACK = [
  ["Framework",       "Next.js 16 (App Router, Turbopack)"],
  ["Language",        "TypeScript 5 — strict mode throughout"],
  ["Styling",         "Tailwind CSS v4 (@import syntax)"],
  ["Charts",          "Recharts 2 — all client components"],
  ["CSV Parsing",     "PapaParse — flexible column matching"],
  ["Authentication",  "Clerk (@clerk/nextjs v7) — optional"],
  ["Database",        "Neon PostgreSQL (serverless HTTP) — optional"],
  ["AI Chatbot",      "Anthropic Claude Haiku via AI SDK v6"],
  ["Persistence",     "localStorage (always) + Neon DB (if configured)"],
  ["Deployment",      "Vercel (Fluid Compute, global CDN)"],
  ["Version Control", "Git + GitHub"],
];

const PAGES = [
  ["Overview",      "KPI summary, YoY revenue chart, category donut, region bar chart, recent orders table"],
  ["Sales",         "Monthly & daily trends, channel breakdown, region performance, return rate tracking"],
  ["Products",      "Category revenue/margin/units/growth charts, top products table with trend indicators"],
  ["Customers",     "RFM segmentation, cohort retention heatmap, acquisition chart, segment LTV table"],
  ["Forecasting",   "24-month ETS projection, 90% confidence band, model accuracy metrics, monthly detail table"],
  ["Insights",      "Aggregated report: health score, all insights by severity, priority action checklist, PDF export"],
  ["Import Data",   "CSV drag-and-drop upload, column auto-detection, instant dashboard replacement"],
];

const INSIGHT_FUNCTIONS = [
  ["getOverviewInsights",  "Revenue growth signal, Q4 concentration risk, online channel momentum, AOV lift detection"],
  ["getSalesInsights",     "Best/worst YoY month, return rate threshold alert, fastest-growing region"],
  ["getProductInsights",   "High-return SKUs (>6%), margin vs revenue mismatch, fast-growing categories, declining products"],
  ["getCustomerInsights",  "At-risk win-back opportunity, premium concentration risk, Month-1 retention vs benchmark"],
  ["getForecastInsights",  "Model accuracy quality (MAPE), aggressive growth validation, Q4 concentration warning"],
  ["getHealthScore",       "Composite 0–100 score: Revenue Growth (30%), Gross Margin (25%), Retention (20%), Risk (15%), Returns (10%)"],
];

const FEATURES = [
  {
    title: "Insight Engine",
    desc: "Automatically analyses the loaded dataset and generates structured, human-readable business insights with severity levels (Critical, Warning, Opportunity, Positive) and specific recommended actions. This is what separates FETech from a chart viewer.",
  },
  {
    title: "Business Health Score",
    desc: "Composite 0–100 score computed from five weighted dimensions. Gives executives a single number to track business health without reading 50 charts.",
  },
  {
    title: "ETS Revenue Forecasting",
    desc: "Exponential smoothing (α=0.30) with multiplicative seasonal indices and 10% growth assumption. Produces 12 projected months with 90% confidence bands. Reports MAPE, RMSE, and R² accuracy metrics.",
  },
  {
    title: "RFM Customer Segmentation",
    desc: "Classifies customers into Premium, Loyal, Regular, At-Risk, and New segments based on Recency, Frequency, and Monetary value derived from order-level CSV data.",
  },
  {
    title: "Cohort Retention Heatmap",
    desc: "Groups customers by acquisition month (cohort) and tracks the percentage still purchasing at Month 1, 2, 3, 6, and 12. Heat-map colouring makes patterns immediately visible.",
  },
  {
    title: "CSV Import Pipeline",
    desc: "PapaParse-powered CSV parser with case-insensitive flexible column matching (20+ column name aliases). Ingests order-level data and computes all dashboard metrics on the client side.",
  },
  {
    title: "PDF Report Export",
    desc: "The Insights page has a Download PDF button. Print CSS hides all navigation chrome, leaving only the report content: executive summary, health score, insight cards, and the priority action checklist.",
  },
  {
    title: "AI Assistant",
    desc: "Floating chat widget (Claude Haiku) with live dashboard context. Receives a compact data summary on every request so it can answer questions specific to the user's actual numbers, not generic advice.",
  },
  {
    title: "Graceful Degradation",
    desc: "The entire platform runs in Demo Mode with no configuration. localStorage provides cross-session data persistence with zero accounts. Clerk, Neon, and Anthropic integrations activate automatically when env vars are present.",
  },
];

export default function ProjectReportPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Download button — hidden in print */}
      <div className="fixed top-4 right-4 z-10 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-10 py-16 space-y-14">

        {/* ── Cover ── */}
        <section className="border-b border-slate-200 pb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 leading-tight">FETech Analytics</h1>
              <p className="text-lg text-indigo-600 font-semibold">Business Intelligence Platform</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm mb-8">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Project Type</p>
              <p className="text-slate-700 font-medium">Full-Stack Web Application — BI SaaS Platform</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Author</p>
              <p className="text-slate-700 font-medium">Fabjan Elezi</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Live URL</p>
              <p className="text-indigo-600 font-medium">fetech-analytics.vercel.app</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Source Code</p>
              <p className="text-indigo-600 font-medium">github.com/FabjanElezi/fetech-analytics</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Report Date</p>
              <p className="text-slate-700 font-medium">{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Version</p>
              <p className="text-slate-700 font-medium">1.0 — Production</p>
            </div>
          </div>

          <div className="rounded-xl bg-indigo-50 border border-indigo-100 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">One-Line Summary</p>
            <p className="text-indigo-900 font-semibold text-lg leading-snug">
              FETech Analytics is a Business Intelligence platform that turns raw retail sales data into actionable business insights for decision-making.
            </p>
          </div>
        </section>

        {/* ── 1. Executive Summary ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">1. Executive Summary</h2>
          <p className="text-slate-600 leading-relaxed">
            FETech Analytics is a full-stack Business Intelligence web application built to serve retail businesses that need to understand their sales performance without hiring a data analyst or purchasing expensive BI tools. The platform ingests raw order-level CSV data and transforms it into a structured, interactive dashboard with automatic insights, revenue forecasting, customer segmentation, and an AI-powered assistant.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The core design principle is that <strong className="text-slate-800">charts alone are not intelligence</strong>. Any spreadsheet can produce a chart. The differentiating feature of FETech Analytics is the <strong className="text-slate-800">Insight Engine</strong> — a rules-based analysis layer that reads the data, identifies patterns against industry benchmarks, and outputs structured recommendations with specific actions the business should take. This transforms the platform from a data viewer into a decision support system.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The platform is fully deployed on Vercel and publicly accessible. It operates in a graceful degradation model: it works completely out of the box with demo data, and progressively unlocks features (authentication, cloud persistence, AI chat) as environment variables are configured.
          </p>
        </section>

        {/* ── 2. Problem Statement ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">2. Problem Statement</h2>
          <p className="text-slate-600 leading-relaxed">
            Small and mid-size retail businesses generate significant transaction data but lack the tools or expertise to extract meaningful insights from it. Enterprise BI tools (Tableau, Power BI, Looker) are expensive, complex, and require dedicated analysts. Spreadsheets are flexible but cannot generate forecasts, segment customers by behaviour, or automatically flag performance anomalies.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[
              ["The Gap", "Businesses know their revenue numbers but cannot answer: Why did this month underperform? Which customers are about to churn? Which product categories are worth investing in?"],
              ["The Solution", "FETech Analytics answers all of these questions automatically from a single CSV upload — no analyst required, no complex configuration, no subscription fee to start."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{title}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Technical Architecture ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">3. Technical Architecture</h2>
          <p className="text-slate-600 leading-relaxed">
            The application is a single Next.js 16 project using the App Router. All data processing happens on the client side after CSV upload — there is no proprietary backend; the Next.js API routes handle only authentication and database persistence, both of which are optional.
          </p>
          <table className="w-full text-sm border-collapse mt-2">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600 border border-slate-200 w-1/3">Layer</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600 border border-slate-200">Technology / Detail</th>
              </tr>
            </thead>
            <tbody>
              {TECH_STACK.map(([layer, detail], i) => (
                <tr key={layer} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  <td className="px-4 py-2.5 font-medium text-slate-700 border border-slate-200">{layer}</td>
                  <td className="px-4 py-2.5 text-slate-600 border border-slate-200">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="rounded-lg bg-slate-50 border border-slate-200 p-5 mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Data Flow</p>
            <div className="flex items-center gap-2 flex-wrap text-sm">
              {["CSV Upload", "→", "PapaParse", "→", "csvParser.ts", "→", "DashboardData", "→", "React Context", "→", "All Pages + Insight Engine"].map((s, i) => (
                <span key={i} className={s === "→" ? "text-slate-400" : "bg-white border border-slate-200 rounded px-2 py-1 font-medium text-slate-700"}>{s}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. Application Pages ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">4. Application Pages</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600 border border-slate-200 w-1/4">Page</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600 border border-slate-200">Contents</th>
              </tr>
            </thead>
            <tbody>
              {PAGES.map(([page, contents], i) => (
                <tr key={page} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  <td className="px-4 py-2.5 font-semibold text-indigo-600 border border-slate-200">{page}</td>
                  <td className="px-4 py-2.5 text-slate-600 border border-slate-200">{contents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── 5. Key Features ── */}
        <section className="space-y-5">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">5. Key Features</h2>
          <div className="space-y-4">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="flex gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 mb-1">{f.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. Insight Engine ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">6. Insight Engine Detail</h2>
          <p className="text-slate-600 leading-relaxed">
            The Insight Engine (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">src/lib/insightEngine.ts</code>) is the intellectual core of the platform. It is a pure TypeScript module — no external dependencies, no ML model — that applies domain knowledge rules against the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">DashboardData</code> object and returns structured <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">Insight</code> objects.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Each <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">Insight</code> has: a type (critical / warning / opportunity / positive), a title, a description explaining why the metric matters, a recommended action, and the key metric that triggered it. Insights are generated fresh on every render from live data — there is no pre-computed cache.
          </p>
          <table className="w-full text-sm border-collapse mt-2">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600 border border-slate-200 w-1/3">Function</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-600 border border-slate-200">What It Analyses</th>
              </tr>
            </thead>
            <tbody>
              {INSIGHT_FUNCTIONS.map(([fn, desc], i) => (
                <tr key={fn} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  <td className="px-4 py-2.5 font-mono text-xs text-indigo-600 border border-slate-200">{fn}</td>
                  <td className="px-4 py-2.5 text-slate-600 border border-slate-200">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── 7. CSV Data Pipeline ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">7. CSV Data Pipeline</h2>
          <p className="text-slate-600 leading-relaxed">
            The CSV parser (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">src/lib/csvParser.ts</code>) accepts any order-level CSV file and produces a complete <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">DashboardData</code> object. It uses case-insensitive column matching with 20+ alias names per field, meaning a CSV with columns named <em>Amount</em>, <em>Total</em>, <em>Revenue</em>, or <em>Price</em> all resolve to the same revenue field.
          </p>
          <p className="text-slate-600 leading-relaxed">
            From a single CSV of orders it computes: monthly revenue with YoY comparison (multi-year detection), daily sales rolling window, category/region/channel breakdowns, top products with trend analysis, RFM customer segments, monthly acquisition and churn, cohort retention heatmap, and a 24-month ETS forecast — all in the browser, in under one second for typical datasets.
          </p>
          <div className="rounded-lg bg-slate-900 text-slate-300 text-xs font-mono p-5 leading-relaxed">
            <p className="text-slate-500 mb-2">// Minimum viable CSV structure</p>
            <p><span className="text-emerald-400">date</span>, <span className="text-emerald-400">amount</span>, <span className="text-emerald-400">category</span>, <span className="text-emerald-400">region</span>, <span className="text-emerald-400">channel</span>, <span className="text-emerald-400">customer_id</span></p>
            <p className="text-slate-500 mt-3 mb-1">// Optional fields (auto-detected if present)</p>
            <p><span className="text-blue-400">product_name</span>, <span className="text-blue-400">quantity</span>, <span className="text-blue-400">margin</span>, <span className="text-blue-400">return_flag</span>, <span className="text-blue-400">order_id</span></p>
          </div>
        </section>

        {/* ── 8. Forecasting Model ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">8. Revenue Forecasting Model</h2>
          <p className="text-slate-600 leading-relaxed">
            The forecasting engine (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">src/lib/forecastEngine.ts</code>) implements Exponential Smoothing (ETS) with multiplicative seasonal adjustment. It produces a 24-point series: 12 months of smoothed historical actuals plus 12 months of projection.
          </p>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              ["Smoothing Factor α", "0.30", "Controls sensitivity to recent data vs. historical trend"],
              ["Seasonality", "Multiplicative", "Each month's index = month revenue ÷ annual monthly average"],
              ["Growth Assumption", "+10% YoY", "Applied uniformly to the projected baseline"],
              ["Confidence Interval", "90%", "Band widens with forecast horizon — max 12 months out"],
              ["Accuracy Metric", "MAPE", "Mean Absolute Percentage Error reported on the Forecasting page"],
              ["Fit Metric", "R²", "Coefficient of determination measures how well the model fits history"],
            ].map(([label, value, note]) => (
              <div key={label} className="rounded-lg border border-slate-200 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
                <p className="text-lg font-black text-indigo-600 leading-none mb-1">{value}</p>
                <p className="text-[11px] text-slate-500 leading-snug">{note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 9. AI Integration ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">9. AI Assistant Integration</h2>
          <p className="text-slate-600 leading-relaxed">
            The AI assistant uses Claude Haiku (Anthropic) via the Vercel AI SDK v6. A floating chat widget sits on every page. On each message, the client serialises a compact snapshot of the current dashboard — revenue figures, top category, at-risk customer count, forecast accuracy, and other key metrics — and sends it as context alongside the conversation history.
          </p>
          <p className="text-slate-600 leading-relaxed">
            This means the assistant can answer questions like <em>"what should I do about my at-risk customers?"</em> or <em>"is my 8.3% return rate a problem?"</em> with responses grounded in the user's actual data, not generic advice. The API route streams the response using <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">streamText().toTextStreamResponse()</code> and the client reads chunks incrementally via the Fetch ReadableStream API.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The assistant gracefully disables itself when <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">ANTHROPIC_API_KEY</code> is not configured, returning a clear 503 message rather than crashing.
          </p>
        </section>

        {/* ── 10. Deployment ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">10. Deployment & Infrastructure</h2>
          <p className="text-slate-600 leading-relaxed">
            The application is deployed on Vercel using Fluid Compute (Node.js runtime, not Edge). Static pages are pre-rendered at build time; API routes are server-rendered on demand. The platform uses three optional external services, each activating automatically when environment variables are present:
          </p>
          <div className="space-y-3 mt-2">
            {[
              { name: "Clerk", role: "Authentication", detail: "Sign-in/sign-up pages, session management, UserButton widget. When keys are absent the app runs in Demo Mode — no auth, full functionality.", env: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY" },
              { name: "Neon", role: "PostgreSQL Database", detail: "Serverless PostgreSQL over HTTP via @neondatabase/serverless. Stores user_dashboards table with JSONB data column. Lazy-initialised to avoid build crashes.", env: "DATABASE_URL" },
              { name: "Anthropic", role: "AI Chatbot", detail: "Claude Haiku model for the floating chat assistant. Route returns 503 if key absent.", env: "ANTHROPIC_API_KEY" },
            ].map((s) => (
              <div key={s.name} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-slate-800">{s.name}</span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">{s.role}</span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{s.detail}</p>
                <p className="text-xs font-mono text-slate-400">{s.env}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-600 leading-relaxed mt-2">
            Data persistence uses a two-tier fallback: <strong className="text-slate-800">localStorage</strong> (always available, browser-local, zero accounts needed) and <strong className="text-slate-800">Neon cloud DB</strong> (cross-device, per-user, requires Clerk + Neon). On load, the app tries cloud first; if unavailable it reads from localStorage; if empty it shows demo data.
          </p>
        </section>

        {/* ── 11. Project Structure ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">11. Project Structure</h2>
          <div className="rounded-lg bg-slate-900 text-slate-300 text-xs font-mono p-5 leading-6">
            <p><span className="text-slate-500">src/</span></p>
            <p><span className="text-slate-500">├── app/</span>                     <span className="text-slate-600">  Next.js App Router pages</span></p>
            <p><span className="text-slate-500">│   ├── api/chat/</span>            <span className="text-slate-600">  AI chatbot streaming endpoint</span></p>
            <p><span className="text-slate-500">│   ├── api/dashboard/</span>       <span className="text-slate-600">  GET / POST / DELETE user data</span></p>
            <p><span className="text-slate-500">│   ├── [sales|products|…]/</span>  <span className="text-slate-600">  Dashboard pages</span></p>
            <p><span className="text-slate-500">│   └── project-report/</span>      <span className="text-slate-600">  This report (standalone layout)</span></p>
            <p><span className="text-slate-500">├── components/</span></p>
            <p><span className="text-slate-500">│   ├── charts/</span>              <span className="text-slate-600">  8 Recharts components (all "use client")</span></p>
            <p><span className="text-slate-500">│   ├── layout/</span>              <span className="text-slate-600">  Sidebar, Header</span></p>
            <p><span className="text-slate-500">│   ├── tables/</span>              <span className="text-slate-600">  RecentOrders, TopProducts</span></p>
            <p><span className="text-slate-500">│   └── ui/</span>                  <span className="text-slate-600">  KPICard, SectionCard, InsightCard, HealthScoreCard, ChatBot</span></p>
            <p><span className="text-slate-500">├── context/</span>                 <span className="text-slate-600">  DataContext (global state + persistence)</span></p>
            <p><span className="text-slate-500">├── lib/</span></p>
            <p><span className="text-slate-500">│   ├── csvParser.ts</span>          <span className="text-slate-600">  CSV → DashboardData transformation</span></p>
            <p><span className="text-slate-500">│   ├── forecastEngine.ts</span>     <span className="text-slate-600">  ETS forecasting model</span></p>
            <p><span className="text-slate-500">│   ├── insightEngine.ts</span>      <span className="text-slate-600">  Auto-generated business insights</span></p>
            <p><span className="text-slate-500">│   ├── db.ts</span>                 <span className="text-slate-600">  Lazy Neon SQL client</span></p>
            <p><span className="text-slate-500">│   └── data/</span>                <span className="text-slate-600">  Mock dataset (demo mode)</span></p>
            <p><span className="text-slate-500">├── types/index.ts</span>            <span className="text-slate-600">  All domain interfaces</span></p>
            <p><span className="text-slate-500">└── proxy.ts</span>                 <span className="text-slate-600">  Clerk middleware (Next.js 16 convention)</span></p>
          </div>
        </section>

        {/* ── 12. Conclusion ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">12. Conclusion</h2>
          <p className="text-slate-600 leading-relaxed">
            FETech Analytics demonstrates that a full BI platform — with forecasting, customer intelligence, automated insights, AI assistance, and PDF reporting — can be built as a single Next.js application with no proprietary backend infrastructure. The entire analytical pipeline runs on the client side, making the platform fast, portable, and free to host.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The key architectural decision that makes this project more than a dashboard is the Insight Engine: by explicitly separating data computation from insight generation, the platform can tell a business not just <em>what happened</em> but <em>why it matters</em> and <em>what to do next</em>. That is the difference between a chart viewer and a decision system.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              ["13 Routes", "Deployed on Vercel"],
              ["8 Chart Types", "All Recharts, all client-side"],
              ["6 Insight Functions", "450+ lines of business logic"],
              ["3 Persistence Tiers", "localStorage → Neon → Demo"],
              ["1 AI Assistant", "Context-aware, streaming"],
              ["0 Accounts Needed", "To start using it today"],
            ].map(([stat, label]) => (
              <div key={stat} className="rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-xl font-black text-indigo-600">{stat}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-6 flex items-center justify-between text-xs text-slate-400">
          <span>FETech Analytics — Project Report</span>
          <span>fetech-analytics.vercel.app · github.com/FabjanElezi/fetech-analytics</span>
        </div>

      </div>
    </div>
  );
}
