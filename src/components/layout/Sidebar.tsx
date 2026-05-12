"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  Users,
  LineChart,
  BarChart3,
  Upload,
  CheckCircle2,
  Sparkles,
  X,
  Sun,
  Moon,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useData } from "@/context/DataContext";
import { useSidebar } from "@/context/SidebarContext";
import { useTheme } from "@/context/ThemeContext";

const CLERK_ACTIVE =
  (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "").startsWith("pk_") &&
  !(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "").includes("REPLACE_ME");

const navItems = [
  { href: "/",            label: "Overview",    icon: LayoutDashboard },
  { href: "/sales",       label: "Sales",       icon: TrendingUp      },
  { href: "/products",    label: "Products",    icon: Package          },
  { href: "/customers",   label: "Customers",   icon: Users            },
  { href: "/forecasting", label: "Forecasting", icon: LineChart        },
  { href: "/insights",    label: "Insights",    icon: Sparkles         },
];

function ClerkUserWidget() {
  const { UserButton, useUser } = require("@clerk/nextjs"); // eslint-disable-line @typescript-eslint/no-require-imports
  const { user } = useUser();
  return (
    <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-800">
      <UserButton appearance={{ elements: { avatarBox: "h-7 w-7" } }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-200 truncate">
          {user?.fullName ?? user?.firstName ?? "My Account"}
        </p>
        <p className="text-[11px] text-slate-500 truncate">
          {user?.primaryEmailAddress?.emailAddress ?? ""}
        </p>
      </div>
    </div>
  );
}

function DataStatusChip({ data }: { data: import("@/types").DashboardData }) {
  if (data.isCustomData) {
    return (
      <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">{data.companyName}</p>
            <p className="text-[11px] text-slate-500">Custom data active</p>
          </div>
        </div>
        <Link
          href="/import"
          className="text-[11px] text-slate-400 hover:text-indigo-400 transition-colors shrink-0 ml-2"
        >
          Change
        </Link>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
        <div>
          <p className="text-xs font-medium text-slate-200">Demo data</p>
          <p className="text-[11px] text-slate-500">No real data loaded</p>
        </div>
      </div>
      <Link
        href="/import"
        className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors shrink-0 ml-2"
      >
        Import →
      </Link>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { data } = useData();
  const { isOpen, close } = useSidebar();
  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo / Brand */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">FETech Analytics</p>
              <p className="text-xs text-slate-400 leading-tight">BI Platform</p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
            onClick={close}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Analytics
          </p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}

          {/* Import Data */}
          <div className="pt-4 mt-2 border-t border-slate-800">
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Data
            </p>
            <Link
              href="/import"
              onClick={close}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === "/import"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              )}
            >
              <span className="flex items-center gap-3">
                <Upload className="h-4 w-4 shrink-0" />
                Import Data
              </span>
              {data.isCustomData && (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              )}
            </Link>
          </div>
        </nav>

        {/* Footer: about link + dark mode toggle + user widget */}
        <div className="px-3 py-4 border-t border-slate-800 space-y-2">
          {/* About / Landing page link */}
          <Link
            href="/landing"
            onClick={close}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors text-sm font-medium"
          >
            <Info className="h-4 w-4 shrink-0" />
            About this platform
          </Link>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors text-sm font-medium"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          {CLERK_ACTIVE ? <ClerkUserWidget /> : <CreatorCard />}
        </div>
      </aside>
    </>
  );
}
