"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { IntelligenceDataset } from "@/data/types";

interface IntelligenceDataContextValue {
  data: IntelligenceDataset | null;
  hasLiveData: boolean;
  ready: boolean;
  expiresAt: number | null;
  setLiveData: (data: IntelligenceDataset) => void;
  clearLiveData: () => void;
}

const STORAGE_KEY = "sgc-live-intelligence-data-v1";
const DATA_TTL_MS = 5 * 60 * 1000;
const IntelligenceDataContext = createContext<IntelligenceDataContextValue | null>(null);

interface StoredDataset {
  data: IntelligenceDataset;
  expiresAt: number;
}

export function IntelligenceDataProvider({ children }: { children: ReactNode }) {
  const [liveData, setLiveDataState] = useState<IntelligenceDataset | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredDataset;
        if (parsed.data && parsed.expiresAt > Date.now()) {
          setLiveDataState(parsed.data);
          setExpiresAt(parsed.expiresAt);
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

  useEffect(() => {
    if (!expiresAt) return;
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) {
      setLiveDataState(null);
      setExpiresAt(null);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const timer = window.setTimeout(() => {
      setLiveDataState(null);
      setExpiresAt(null);
      localStorage.removeItem(STORAGE_KEY);
    }, remaining);
    return () => window.clearTimeout(timer);
  }, [expiresAt]);

  const value = useMemo<IntelligenceDataContextValue>(
    () => ({
      data: liveData,
      hasLiveData: Boolean(liveData),
      ready,
      expiresAt,
      setLiveData: (next) => {
        const nextExpiry = Date.now() + DATA_TTL_MS;
        setLiveDataState(next);
        setExpiresAt(nextExpiry);
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ data: next, expiresAt: nextExpiry } satisfies StoredDataset),
        );
      },
      clearLiveData: () => {
        setLiveDataState(null);
        setExpiresAt(null);
        localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [expiresAt, liveData, ready],
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
