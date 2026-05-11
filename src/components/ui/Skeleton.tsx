import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

export function DashboardSkeleton() {
  return (
    <div className="flex-1 p-4 sm:p-8 space-y-8 animate-pulse">
      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Main charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 space-y-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-52 w-full" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 space-y-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-52 w-full rounded-full" />
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-36 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
