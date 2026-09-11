import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { defaultCampaign } from "@/data/campaigns";
import type { CampaignConfig, DecisionRecord } from "@/data/types";

interface DemoState {
  campaign: CampaignConfig;
  segmentId: string;
  messageId: string;
  scenarioId: string;
  optimizedText: string | null;
  decisions: DecisionRecord[];
  authenticated: boolean;
  language: "ar" | "en";
}

const initialState: DemoState = {
  campaign: defaultCampaign,
  segmentId: "fast-sharer",
  messageId: "msg-c",
  scenarioId: "short-video",
  optimizedText: null,
  decisions: [],
  authenticated: false,
  language: "ar",
};

interface DemoContextValue extends DemoState {
  setCampaign: (c: CampaignConfig) => void;
  setSegmentId: (id: string) => void;
  setMessageId: (id: string) => void;
  setScenarioId: (id: string) => void;
  setOptimizedText: (text: string | null) => void;
  addDecision: (d: DecisionRecord) => void;
  signIn: () => void;
  setLanguage: (language: DemoState["language"]) => void;
  toggleLanguage: () => void;
  reset: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

const STORAGE_KEY = "sgc-dt-application-state-v2";

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as Partial<DemoState>) });
    } catch {
      /* demo state is optional */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* demo state is optional */
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.lang = state.language;
    document.documentElement.dir = state.language === "ar" ? "rtl" : "ltr";
  }, [state.language]);

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      setCampaign: (campaign) => setState((s) => ({ ...s, campaign })),
      setSegmentId: (segmentId) => setState((s) => ({ ...s, segmentId })),
      setMessageId: (messageId) => setState((s) => ({ ...s, messageId })),
      setScenarioId: (scenarioId) => setState((s) => ({ ...s, scenarioId })),
      setOptimizedText: (optimizedText) => setState((s) => ({ ...s, optimizedText })),
      addDecision: (d) => setState((s) => ({ ...s, decisions: [d, ...s.decisions] })),
      signIn: () => setState((s) => ({ ...s, authenticated: true })),
      setLanguage: (language) => setState((s) => ({ ...s, language })),
      toggleLanguage: () =>
        setState((s) => ({ ...s, language: s.language === "ar" ? "en" : "ar" })),
      reset: () =>
        setState({
          ...initialState,
          authenticated: state.authenticated,
          language: state.language,
        }),
    }),
    [state],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}
