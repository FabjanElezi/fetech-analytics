"use client";

import Link from "next/link";
import { useState } from "react";
import {
  TrendingUp,
  Users,
  Sparkles,
  Upload,
  LineChart,
  BarChart3,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Mail,
  Globe,
  ChevronDown,
  ChevronUp,
  FileText,
  GitBranch,
  Clock,
  Package,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const features = [
  { icon: TrendingUp, color: "bg-indigo-50 text-indigo-600",  title: "Revenue Analytics",      desc: "Year-over-year comparisons, monthly trends, daily sales breakdown, and channel performance." },
  { icon: Users,      color: "bg-violet-50 text-violet-600",  title: "Customer Intelligence",   desc: "RFM segmentation to identify Premium, Loyal, At-Risk, and New customers. Cohort retention heatmaps." },
  { icon: BarChart3,  color: "bg-cyan-50 text-cyan-600",      title: "Product Performance",     desc: "Category margin analysis, top products by revenue, return rate monitoring, and growth tracking." },
  { icon: LineChart,  color: "bg-emerald-50 text-emerald-600",title: "12-Month Forecasting",    desc: "Exponential Smoothing (ETS) model with seasonal adjustments, confidence bands, and MAPE accuracy." },
  { icon: Sparkles,   color: "bg-amber-50 text-amber-600",    title: "Auto-Generated Insights", desc: "Prioritised recommendations ranked by impact — critical issues, warnings, opportunities, strengths." },
  { icon: Upload,     color: "bg-rose-50 text-rose-600",      title: "Bring Your Own Data",     desc: "Upload any sales CSV. Flexible column mapping. Your data lives in your browser — no accounts needed." },
];

const stats = [
  { value: "6",    label: "Dashboard pages" },
  { value: "20+",  label: "Auto-generated insights" },
  { value: "0",    label: "Accounts required" },
  { value: "100%", label: "Browser-based & private" },
];

const steps = [
  { num: "01", title: "Export your sales data", desc: "Export a CSV from your POS, Shopify, WooCommerce, or any system." },
  { num: "02", title: "Upload to FETech",        desc: "Drag and drop your CSV. Column names are mapped automatically." },
  { num: "03", title: "Instant insights",        desc: "All 6 dashboard pages populate with your real data in seconds." },
];

const techStack = [
  { name: "Next.js 16",      role: "Framework",         color: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200" },
  { name: "React 19",        role: "UI Library",        color: "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400" },
  { name: "TypeScript",      role: "Language",          color: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" },
  { name: "Tailwind CSS v4", role: "Styling",           color: "bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400" },
  { name: "Recharts",        role: "Data Visualisation",color: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400" },
  { name: "ETS Engine",      role: "Forecasting",       color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" },
  { name: "Vercel",          role: "Deployment",        color: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200" },
  { name: "localStorage",    role: "Data Persistence",  color: "bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400" },
  { name: "Lucide React",    role: "Icons",             color: "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400" },
];

const useCases = [
  { title: "Small Retailers",      desc: "Understand which products drive profit and which regions underperform — without hiring a data analyst." },
  { title: "E-Commerce Stores",    desc: "Track Shopify or WooCommerce sales data, segment customers by value, and forecast next year's revenue." },
  { title: "Franchise Owners",     desc: "Compare performance across locations, identify at-risk customers, and act on prioritised recommendations." },
  { title: "Business Students",    desc: "Explore real BI concepts — RFM segmentation, cohort retention, ETS forecasting — with live data." },
];

const roadmap = [
  { status: "done",    label: "Shipped",    item: "Mobile responsive layout + dark mode" },
  { status: "done",    label: "Shipped",    item: "Revenue goal tracker" },
  { status: "done",    label: "Shipped",    item: "Loading skeleton screens" },
  { status: "done",    label: "Shipped",    item: "Built-in AI assistant (free, no API key)" },
  { status: "planned", label: "Planned",    item: "Multi-currency support" },
  { status: "planned", label: "Planned",    item: "Export dashboard to Excel / PDF" },
  { status: "planned", label: "Planned",    item: "Date range filter across all pages" },
  { status: "planned", label: "Planned",    item: "Team sharing & multi-user access" },
  { status: "planned", label: "Planned",    item: "Shopify & WooCommerce direct integration" },
];

const changelog = [
  { version: "v1.3", date: "May 2026",  note: "Dark mode, mobile layout, landing page, skeletons, goal tracker" },
  { version: "v1.2", date: "May 2026",  note: "Built-in AI chatbot, localStorage persistence, PDF export" },
  { version: "v1.1", date: "May 2026",  note: "Insights engine, health score, priority action checklist" },
  { version: "v1.0", date: "May 2026",  note: "Initial release — 6 dashboard pages, ETS forecasting, CSV import" },
];

const faqs = [
  { q: "Is my data private?",                 a: "Yes — 100%. Your CSV is parsed and stored entirely in your browser's localStorage. Nothing is uploaded to any server. We have no database for your business data." },
  { q: "Is FETech Analytics free?",           a: "Completely free. No subscription, no free tier limits, no credit card required. Just open the app and start." },
  { q: "What file formats are supported?",    a: "CSV only. Export from Shopify, WooCommerce, Square, Lightspeed, or any POS system. Three columns are required: date, amount, and category." },
  { q: "What happens if I close the browser?",a: "Your data is saved in localStorage and will be there when you return — as long as you use the same browser and don't clear site data." },
  { q: "How accurate is the forecast?",       a: "The ETS model targets under 5% MAPE (Mean Absolute Percentage Error). Your data's MAPE is shown on the Forecasting page. Under 5% is budget-grade; above 10% should be treated as directional only." },
  { q: "Can I use it on mobile?",             a: "Yes — the dashboard is fully responsive. Use the hamburger menu to open the sidebar on smaller screens." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
      >
        {q}
        {open ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-500 dark:text-slate-400 leading-relaxed border-t border-gray-100 dark:border-slate-700 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <Header title="About FETech Analytics" subtitle="Platform overview, features, and creator" />

      <div className="flex-1 overflow-y-auto">

        {/* Version badge + hero */}
        <section className="px-6 sm:px-12 py-14 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Package className="h-3 w-3" /> v1.3 — Latest
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-xs font-medium text-gray-600 dark:text-slate-300">
              <Clock className="h-3 w-3" /> May 2026
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Zap className="h-3 w-3" /> Free forever
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-slate-100 leading-tight mb-4">
            Turn sales data into<span className="text-indigo-600"> business decisions</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed max-w-2xl mb-8">
            FETech Analytics is a free retail BI platform that transforms your sales CSV into revenue insights,
            customer segments, product analysis, and AI-powered forecasts — instantly, entirely in your browser.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/import" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              <Upload className="h-4 w-4 text-indigo-600" /> Import your CSV
            </Link>
            <Link href="/project-report" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              <FileText className="h-4 w-4 text-indigo-600" /> Project Report
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-indigo-600 py-10 px-6 sm:px-12">
          <div className="max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-sm text-indigo-200 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section className="px-6 sm:px-12 py-12 max-w-5xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">Who is it for?</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Built for anyone running a product or retail business who wants answers from their data.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {useCases.map(({ title, desc }) => (
              <div key={title} className="p-5 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-200">{title}</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed pl-6">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="px-6 sm:px-12 py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-5xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6">Platform features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="p-5 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow">
                  <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl mb-3 ${color}`}>
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-200 mb-1">{title}</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="px-6 sm:px-12 py-12 max-w-5xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">Tech stack</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Built entirely with modern open-source tools. No proprietary dependencies.</p>
          <div className="flex flex-wrap gap-3">
            {techStack.map(({ name, role, color }) => (
              <div key={name} className={cn("flex flex-col items-center px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-700 min-w-[110px] text-center", color)}>
                <p className="text-sm font-semibold leading-tight">{name}</p>
                <p className="text-[11px] opacity-70 mt-0.5">{role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="px-6 sm:px-12 py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-8">Up and running in minutes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {steps.map(({ num, title, desc }) => (
                <div key={num}>
                  <div className="text-4xl font-black text-indigo-100 dark:text-indigo-900 mb-2">{num}</div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-200 mb-1">{title}</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap + Changelog side by side */}
        <section className="px-6 sm:px-12 py-12 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Roadmap */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <GitBranch className="h-5 w-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Roadmap</h2>
              </div>
              <div className="space-y-3">
                {roadmap.map(({ status, label, item }) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className={cn(
                      "mt-0.5 shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full",
                      status === "done"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    )}>
                      {label}
                    </span>
                    <p className={cn("text-sm leading-snug", status === "done" ? "text-gray-700 dark:text-slate-300" : "text-gray-400 dark:text-slate-500")}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Changelog */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Clock className="h-5 w-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Changelog</h2>
              </div>
              <div className="space-y-4">
                {changelog.map(({ version, date, note }) => (
                  <div key={version} className="flex gap-4">
                    <div className="shrink-0 text-right w-12">
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{version}</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500">{date}</p>
                    </div>
                    <div className="flex-1 border-l border-gray-100 dark:border-slate-700 pl-4 pb-4">
                      <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">{note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 sm:px-12 py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6">Frequently asked questions</h2>
            <div className="space-y-2">
              {faqs.map((item) => <FAQItem key={item.q} {...item} />)}
            </div>
          </div>
        </section>

        {/* CSV requirements */}
        <section className="px-6 sm:px-12 py-12 max-w-4xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">Works with any sales CSV</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
            <div className="space-y-2.5">
              {[
                ["date",        "Yes",      "Any date format"],
                ["amount",      "Yes",      "Order total"],
                ["category",    "Yes",      "Product category"],
                ["customer_id", "Optional", "Enables RFM & cohort analysis"],
                ["region",      "Optional", "Regional breakdown"],
                ["channel",     "Optional", "Channel analytics"],
              ].map(([col, req, note]) => (
                <div key={col} className="flex items-center gap-3">
                  <CheckCircle2 className={`h-4 w-4 shrink-0 ${req === "Yes" ? "text-indigo-600" : "text-gray-300 dark:text-slate-600"}`} />
                  <code className="font-mono text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded text-xs">{col}</code>
                  <span className="text-gray-500 dark:text-slate-400 text-xs">{note}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-900 rounded-2xl p-5 text-xs font-mono text-slate-300 leading-6">
              <span className="text-slate-500">// sample-data.csv</span><br />
              <span className="text-emerald-400">date</span>,<span className="text-cyan-400">amount</span>,<span className="text-violet-400">category</span>,<span className="text-amber-400">region</span><br />
              2024-01-15,1299.99,Electronics,North<br />
              2024-01-16,89.50,Clothing,South<br />
              2024-01-17,450.00,Furniture,East<br />
              <span className="text-slate-600">...</span>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="px-6 sm:px-12 py-10 bg-indigo-50 dark:bg-indigo-950/30 border-t border-indigo-100 dark:border-indigo-900">
          <div className="max-w-2xl flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-1">Your data never leaves your browser</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                FETech Analytics runs entirely client-side. Your sales data is stored in your browser&apos;s localStorage.
                Nothing is uploaded to any server. No accounts, no cloud storage, no tracking.
              </p>
            </div>
          </div>
        </section>

        {/* Project report CTA */}
        <section className="px-6 sm:px-12 py-10 max-w-4xl">
          <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Full Technical Project Report</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Architecture, tech stack, data pipeline, forecasting model, and deployment — all documented.</p>
              </div>
            </div>
            <Link href="/project-report" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shrink-0">
              Read Report <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Creator */}
        <section className="px-6 sm:px-12 py-12 max-w-4xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6">Built by</h2>
          <div className="rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 flex flex-col sm:flex-row items-start gap-6">
            <div className="h-14 w-14 rounded-xl bg-indigo-600 flex items-center justify-center text-xl font-black text-white shrink-0">FE</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-0.5">Founder &amp; CEO</p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-0.5">Fabjan Elezi</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">FETech · Business Intelligence Platform</p>
              <div className="flex flex-wrap gap-3">
                <a href="mailto:fabjanelezi@proton.me" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <Mail className="h-4 w-4 text-indigo-500" />fabjanelezi@proton.me
                </a>
                <a href="https://www.linkedin.com/in/fabjan-elezi-7527b2295" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <LinkedInIcon className="h-4 w-4 text-indigo-500" />LinkedIn
                </a>
                <a href="https://felezitech.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <Globe className="h-4 w-4 text-indigo-500" />felezitech.vercel.app
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
