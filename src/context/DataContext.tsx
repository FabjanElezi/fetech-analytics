"use client";

// ─── Global data context ──────────────────────────────────────────────────────
// Loads the authenticated user's DashboardData from the database on mount.
// Falls back to mockDashboard if the user has no saved data yet.
// Persists every update back to /api/dashboard automatically.
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { DashboardData } from "@/types";
import { mockDashboard } from "@/lib/data/mockDashboard";

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

  // Load user's data from the database on first render
  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(({ data: saved }) => {
        if (saved) setDataState(saved as DashboardData);
      })
      .catch(() => { /* network error — keep mock data */ })
      .finally(() => setIsLoaded(true));
  }, []);

  // Save to database and update local state
  const setData = useCallback(async (newData: DashboardData) => {
    setDataState(newData);
    setIsSaving(true);
    try {
      await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
    } catch {
      // API unavailable (e.g. env vars not set) — still update in-memory
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Delete from database and revert to demo data
  const resetToMock = useCallback(async () => {
    setDataState(mockDashboard);
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
