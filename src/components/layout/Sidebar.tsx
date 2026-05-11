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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useData } from "@/context/DataContext";

// Clerk hooks are only called when real keys are present.
// This avoids crashes when running locally without Clerk configured.
const clerkConfigured =
  typeof window !== "undefined"
    ? false // evaluated at runtime via the env check below
    : false;

// We resolve the flag once at module level (server) and pass it as a prop
// to avoid calling hooks conditionally inside the component.
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

// Lazy-loaded Clerk user widget — only rendered when Clerk is configured
function ClerkUserWidget() {
  // Dynamic import of Clerk hooks at render time, inside a separate component
  // that is only mounted when ClerkProvider exists in the tree.
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

function GuestUserWidget() {
  return (
    <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-800">
      <div className="h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
        D
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-200 truncate">Demo Mode</p>
        <p className="text-[11px] text-slate-500 truncate">Add Clerk keys to enable auth</p>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { data } = useData();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-tight">FETech</p>
          <p className="text-xs text-slate-400 leading-tight">Analytics Platform</p>
        </div>
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

      {/* Footer: user account */}
      <div className="px-3 py-4 border-t border-slate-800">
        {CLERK_ACTIVE ? <ClerkUserWidget /> : <GuestUserWidget />}
      </div>
    </aside>
  );
}
