"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { DashboardData } from "@/types";
import { mockDashboard } from "@/lib/data/mockDashboard";

const LS_KEY = "fetech_dashboard_v1";

function lsLoad(): DashboardData | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as DashboardData) : null;
  } catch {
    return null;
  }
}

function lsSave(data: DashboardData) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

function lsClear() {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {}
}

interface DataContextValue {
  data: DashboardData;
  setData: (data: DashboardData) => Promise<void>;
  resetToMock: () => Promise<void>;
  isLoaded: boolean;
  isSaving: boolean;
}

const DataContext = createContext<DataContextValue>({
  data: mockDashboard,
  setData: async () => {},
  resetToMock: async () => {},
  isLoaded: false,
  isSaving: false,
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setDataState] = useState<DashboardData>(mockDashboard);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      // 1. Try cloud DB first (only works when Clerk + Neon are configured)
      try {
        const res = await fetch("/api/dashboard");
        const { data: saved } = await res.json();
        if (saved) {
          setDataState(saved as DashboardData);
          setIsLoaded(true);
          return;
        }
      } catch {
        // API unavailable — fall through
      }

      // 2. Fall back to localStorage (works always, no accounts needed)
      const local = lsLoad();
      if (local) setDataState(local);

      setIsLoaded(true);
    }

    load();
  }, []);

  const setData = useCallback(async (newData: DashboardData) => {
    setDataState(newData);
    setIsSaving(true);

    // Always save to localStorage immediately — instant, no network
    lsSave(newData);

    // Also try to sync to cloud DB if configured
    try {
      await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
    } catch {
      // Cloud not configured — localStorage is the source of truth
    } finally {
      setIsSaving(false);
    }
  }, []);

  const resetToMock = useCallback(async () => {
    setDataState(mockDashboard);
    lsClear();
    setIsSaving(true);
    try {
      await fetch("/api/dashboard", { method: "DELETE" });
    } catch {
      // ignore
    } finally {
      setIsSaving(false);
    }
  }, []);

  return (
    <DataContext.Provider value={{ data, setData, resetToMock, isLoaded, isSaving }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  return useContext(DataContext);
}
