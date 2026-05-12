"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, TrendingUp, Package, Users, LineChart,
  Sparkles, Upload, Info, FileText, Search, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PAGES = [
  { label: "Overview",       href: "/",               icon: LayoutDashboard, desc: "Main KPI dashboard" },
  { label: "Sales",          href: "/sales",          icon: TrendingUp,      desc: "Revenue & sales trends" },
  { label: "Products",       href: "/products",       icon: Package,         desc: "Product performance" },
  { label: "Customers",      href: "/customers",      icon: Users,           desc: "Segments & retention" },
  { label: "Forecasting",    href: "/forecasting",    icon: LineChart,       desc: "12-month revenue forecast" },
  { label: "Insights",       href: "/insights",       icon: Sparkles,        desc: "Auto-generated recommendations" },
  { label: "Import Data",    href: "/import",         icon: Upload,          desc: "Upload your sales CSV" },
  { label: "About",          href: "/landing",        icon: Info,            desc: "Platform overview" },
  { label: "Project Report", href: "/project-report", icon: FileText,        desc: "Technical documentation" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setActive(0);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = PAGES.filter(
    (p) =>
      query === "" ||
      p.label.toLowerCase().includes(query.toLowerCase()) ||
      p.desc.toLowerCase().includes(query.toLowerCase())
  );

  function go(href: string) {
    router.push(href);
    setOpen(false);
    setQuery("");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((v) => Math.min(v + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive((v) => Math.max(v - 1, 0)); }
    if (e.key === "Enter" && filtered[active]) go(filtered[active].href);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[18vh] px-4 bg-black/40 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-slate-700">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            placeholder="Go to page…"
            className="flex-1 text-sm text-gray-900 dark:text-slate-100 bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <ul className="py-2 max-h-72 overflow-y-auto">
          {filtered.map((p, i) => {
            const Icon = p.icon;
            return (
              <li key={p.href}>
                <button
                  onClick={() => go(p.href)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                    i === active
                      ? "bg-indigo-50 dark:bg-indigo-900/30"
                      : "hover:bg-gray-50 dark:hover:bg-slate-700/50"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", i === active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-slate-500")} />
                  <div>
                    <p className={cn("text-sm font-medium", i === active ? "text-indigo-700 dark:text-indigo-300" : "text-gray-800 dark:text-slate-200")}>
                      {p.label}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-slate-500">{p.desc}</p>
                  </div>
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-gray-400 dark:text-slate-500">
              No pages found
            </li>
          )}
        </ul>

        {/* Footer hints */}
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-slate-700 flex items-center gap-4 text-xs text-gray-400 dark:text-slate-500">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
          <span className="ml-auto font-medium">⌘K</span>
        </div>
      </div>
    </div>
  );
}
