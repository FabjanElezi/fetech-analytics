import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export default function SectionCard({ title, subtitle, children, className, action }: SectionCardProps) {
  return (
    <div className={cn("bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm", className)}>
      <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700">
        <div>
          <h2 className="text-sm font-semibold text-gray-800 dark:text-slate-200">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
