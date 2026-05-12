"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface ToastItem { id: number; message: string; type: ToastType; }
interface ToastContextValue { toast: (message: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

const ICONS = { success: CheckCircle2, error: XCircle, info: Info };
const STYLES: Record<ToastType, string> = {
  success: "border-emerald-200 dark:border-emerald-800",
  error:   "border-red-200 dark:border-red-800",
  info:    "border-indigo-200 dark:border-indigo-800",
};
const ICON_COLORS: Record<ToastType, string> = {
  success: "text-emerald-500",
  error:   "text-red-500",
  info:    "text-indigo-500",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-2 pointer-events-none">
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <div
              key={t.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 shadow-lg text-sm font-medium max-w-sm pointer-events-auto",
                STYLES[t.type]
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", ICON_COLORS[t.type])} />
              <span className="flex-1 text-gray-800 dark:text-slate-200">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  return useContext(ToastContext);
}
