"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { IntelligenceDataset } from "@/data/types";

interface IntelligenceDataContextValue {
  data: IntelligenceDataset | null;
  hasLiveData: boolean;
  ready: boolean;
  setLiveData: (data: IntelligenceDataset) => void;
  clearLiveData: () => void;
}

const STORAGE_KEY = "sgc-live-intelligence-data-v1";
const IntelligenceDataContext = createContext<IntelligenceDataContextValue | null>(null);

interface StoredDataset {
  data: IntelligenceDataset;
}

export function IntelligenceDataProvider({ children }: { children: ReactNode }) {
  const [liveData, setLiveDataState] = useState<IntelligenceDataset | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredDataset;
        if (parsed.data) {
          setLiveDataState(parsed.data);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  const value = useMemo<IntelligenceDataContextValue>(
    () => ({
      data: liveData,
      hasLiveData: Boolean(liveData),
      ready,
      setLiveData: (next) => {
        setLiveDataState(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: next } satisfies StoredDataset));
      },
      clearLiveData: () => {
        setLiveDataState(null);
        localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [liveData, ready],
  );

  return (
    <IntelligenceDataContext.Provider value={value}>{children}</IntelligenceDataContext.Provider>
  );
}

export function useIntelligenceData() {
  const context = useContext(IntelligenceDataContext);
  if (!context) throw new Error("useIntelligenceData must be used inside IntelligenceDataProvider");
  return context;
}

export function useRequiredIntelligenceData() {
  const context = useIntelligenceData();
  if (!context.data) {
    throw new Error("Uploaded intelligence data is required for this page.");
  }
  return { ...context, data: context.data };
}
