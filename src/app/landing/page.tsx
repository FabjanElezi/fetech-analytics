import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Users,
  Sparkles,
  Upload,
  LineChart,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Mail,
  Globe,
} from "lucide-react";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

const features = [
  {
    icon: TrendingUp,
    color: "bg-indigo-50 text-indigo-600",
    title: "Revenue Analytics",
    desc: "Year-over-year comparisons, monthly trends, daily sales breakdown, and channel performance — all in one view.",
  },
  {
    icon: Users,
    color: "bg-violet-50 text-violet-600",
    title: "Customer Intelligence",
    desc: "RFM segmentation to identify Premium, Loyal, At-Risk, and New customers. Cohort retention heatmaps.",
  },
  {
    icon: BarChart3,
    color: "bg-cyan-50 text-cyan-600",
    title: "Product Performance",
    desc: "Category margin analysis, top products by revenue, return rate monitoring, and growth tracking.",
  },
  {
    icon: LineChart,
    color: "bg-emerald-50 text-emerald-600",
    title: "12-Month Forecasting",
    desc: "Exponential Smoothing (ETS) model with seasonal adjustments. Confidence bands. MAPE accuracy metrics.",
  },
  {
    icon: Sparkles,
    color: "bg-amber-50 text-amber-600",
    title: "Auto-Generated Insights",
    desc: "Prioritised recommendations ranked by impact — critical issues, warnings, opportunities, and strengths.",
  },
  {
    icon: Upload,
    color: "bg-rose-50 text-rose-600",
    title: "Bring Your Own Data",
    desc: "Upload any sales CSV. Flexible column mapping. Your data lives in your browser — no accounts needed.",
  },
];

const steps = [
  { num: "01", title: "Export your sales data", desc: "Export a CSV from your POS, Shopify, WooCommerce, or any system." },
  { num: "02", title: "Upload to FETech", desc: "Drag and drop your CSV. We map columns automatically." },
  { num: "03", title: "Instant insights", desc: "All 5 dashboard pages populate with your real data in seconds." },
];

const stats = [
  { value: "6", label: "Dashboard pages" },
  { value: "20+", label: "Auto-generated insights" },
  { value: "0", label: "Accounts required" },
  { value: "100%", label: "Browser-based, private" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-12 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900">FETech Analytics</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          Open Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 sm:px-12 py-20 sm:py-28 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-medium text-indigo-600 mb-6">
          <Zap className="h-3.5 w-3.5" />
          No accounts. No subscription. Just upload your CSV.
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
          Turn sales data into
          <span className="text-indigo-600"> business decisions</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          FETech Analytics is a free retail BI platform that transforms your sales CSV into
          revenue insights, customer segments, product analysis, and AI-powered forecasts — instantly.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-base font-semibold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
          >
            Try with demo data
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/import"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-5 w-5 text-indigo-600" />
            Import your CSV
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-indigo-600 py-14">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-sm text-indigo-200 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 sm:px-12 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need to understand your business</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Six dedicated analytics pages, each purpose-built for a different aspect of retail performance.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-lg transition-all group">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-4 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 px-6 sm:px-12 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Up and running in minutes</h2>
            <p className="text-gray-500 text-lg">No setup, no configuration, no accounts.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="relative">
                <div className="text-5xl font-black text-indigo-100 mb-3">{num}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CSV requirements */}
      <section className="px-6 sm:px-12 py-20 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Works with any sales CSV</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Export from Shopify, WooCommerce, Square, Lightspeed, or any POS system.
              FETech maps your columns automatically — just three required fields.
            </p>
            <div className="space-y-3">
              {[
                ["date", "Yes", "Any date format"],
                ["amount", "Yes", "Order total"],
                ["category", "Yes", "Product category"],
                ["customer_id", "Optional", "Enables RFM analysis"],
                ["region", "Optional", "Regional breakdown"],
                ["channel", "Optional", "Channel analytics"],
              ].map(([col, req, note]) => (
                <div key={col} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className={`h-4 w-4 shrink-0 ${req === "Yes" ? "text-indigo-600" : "text-gray-300"}`} />
                  <code className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-xs">{col}</code>
                  <span className="text-gray-500">{note}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 text-sm font-mono text-slate-300 leading-7">
            <span className="text-slate-500">// sample-data.csv</span>
            <br />
            <span className="text-emerald-400">date</span>,
            <span className="text-cyan-400">amount</span>,
            <span className="text-violet-400">category</span>,
            <span className="text-amber-400">region</span>
            <br />
            2024-01-15,1299.99,Electronics,North
            <br />
            2024-01-16,89.50,Clothing,South
            <br />
            2024-01-17,450.00,Furniture,East
            <br />
            <span className="text-slate-600">...</span>
          </div>
        </div>
      </section>

      {/* Privacy note */}
      <section className="bg-indigo-50 border-t border-indigo-100 px-6 sm:px-12 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <ShieldCheck className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your data never leaves your browser</h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xl mx-auto">
            FETech Analytics runs entirely client-side. Your sales data is stored in your browser&apos;s localStorage.
            Nothing is uploaded to any server. No accounts, no cloud storage, no tracking.
          </p>
        </div>
      </section>

      {/* Founder / About */}
      <section className="px-6 sm:px-12 py-20 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 sm:p-12 flex flex-col sm:flex-row items-center sm:items-start gap-8 shadow-sm">
          {/* Avatar initials */}
          <div className="shrink-0 h-20 w-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-black text-white select-none">
            FE
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-1">Built &amp; designed by</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Fabjan Elezi</h3>
            <p className="text-sm font-medium text-gray-500 mb-4">Founder &amp; CEO · FETech</p>
            <p className="text-gray-600 leading-relaxed mb-6 max-w-xl">
              FETech Analytics is my vision of what a modern retail BI platform should look like — fast, free,
              no-account-required, and genuinely useful for real business decisions. Built with Next.js, Recharts,
              and an ETS forecasting engine running entirely in the browser.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:fabjanelezi@proton.me"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Mail className="h-4 w-4 text-indigo-500" />
                fabjanelezi@proton.me
              </a>
              <a
                href="https://www.linkedin.com/in/fabjan-elezi-7527b2295"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LinkedinIcon className="h-4 w-4 text-indigo-500" />
                LinkedIn
              </a>
              <a
                href="https://felezitech.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Globe className="h-4 w-4 text-indigo-500" />
                felezitech.vercel.app
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 sm:px-12 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to understand your business?</h2>
        <p className="text-gray-500 mb-8 text-lg">Start with the demo data or import your own CSV.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-base font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Open Dashboard
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/project-report"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Read Project Report
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 sm:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600">
              <BarChart3 className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">FETech Analytics</span>
            <span className="text-gray-300 text-sm">·</span>
            <span className="text-xs text-gray-400">by Fabjan Elezi</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <a href="mailto:fabjanelezi@proton.me" className="hover:text-indigo-600 transition-colors">
              fabjanelezi@proton.me
            </a>
            <a href="https://felezitech.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
              felezitech.vercel.app
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
