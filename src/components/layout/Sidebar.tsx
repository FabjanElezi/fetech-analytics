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
  Mail,
  Globe,
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

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function CreatorCard() {
  return (
    <div className="rounded-lg bg-slate-800 px-3 py-3 space-y-2">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-black text-white shrink-0">
          FE
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-200 leading-tight">Fabjan Elezi</p>
          <p className="text-[11px] text-slate-500 leading-tight">Founder &amp; CEO · FETech</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <a
          href="mailto:fabjanelezi@proton.me"
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-400 transition-colors"
          title="fabjanelezi@proton.me"
        >
          <Mail className="h-3 w-3" />
          Email
        </a>
        <span className="text-slate-700 text-[11px]">·</span>
        <a
          href="https://www.linkedin.com/in/fabjan-elezi-7527b2295"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <LinkedInIcon className="h-3 w-3" />
          LinkedIn
        </a>
        <span className="text-slate-700 text-[11px]">·</span>
        <a
          href="https://felezitech.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <Globe className="h-3 w-3" />
          Portfolio
        </a>
      </div>
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
              <p className="text-xs text-slate-400 leading-tight">Analytics Platform</p>
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
