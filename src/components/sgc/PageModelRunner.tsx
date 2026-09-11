"use client";

import {
  AiMagicIcon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  PlayIcon,
} from "@hugeicons/core-free-icons";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { AIThinkingOverlay } from "@/components/sgc/AIThinkingOverlay";
import { HugeIcon } from "@/components/sgc/HugeIcon";
import { Chip } from "@/components/sgc/primitives";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/context/DemoContext";
import { useIntelligenceData } from "@/context/IntelligenceDataContext";
import type { LocalizedText } from "@/data/types";

interface PageAnalysisResult {
  title: LocalizedText;
  summary: LocalizedText;
  findings: LocalizedText[];
  actions: LocalizedText[];
  confidence: number;
}

const pageNames: Record<string, LocalizedText> = {
  "/app": { ar: "نظرة عامة", en: "Overview" },
  "/app/campaign": { ar: "إعداد الحملة", en: "Campaign Setup" },
  "/app/audience": { ar: "ذكاء الجمهور", en: "Audience Intelligence" },
  "/app/twin": { ar: "التوأم الرقمي", en: "Digital Twin" },
  "/app/messages": { ar: "مختبر الرسائل", en: "Message Lab" },
  "/app/simulator": { ar: "محاكي السيناريوهات", en: "Scenario Simulator" },
  "/app/optimization": { ar: "تحسين الرسائل", en: "Message Optimization" },
  "/app/prediction": { ar: "التنبؤ", en: "Prediction" },
  "/app/decision": { ar: "القرار البشري", en: "Human Decision" },
  "/app/learning": { ar: "التعلّم", en: "Learning" },
  "/app/knowledge": { ar: "قاعدة المعرفة", en: "Knowledge Base" },
  "/app/governance": { ar: "حوكمة البيانات", en: "Data Governance" },
  "/app/settings": { ar: "الإعدادات", en: "Settings" },
};

export function PageModelRunner() {
  const pathname = usePathname();
  const { language } = useDemo();
  const { data } = useIntelligenceData();
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [liveProgress, setLiveProgress] = useState(0);
  const [liveStage, setLiveStage] = useState<string | undefined>();
  const [result, setResult] = useState<PageAnalysisResult | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ar = language === "ar";
  const page = pageNames[pathname] ?? { ar: "تحليل الصفحة", en: "Page Analysis" };

  useEffect(() => {
    setResult(null);
    setResultOpen(false);
    setError(null);
  }, [pathname]);

  async function runModel() {
    if (!data) return;
    setRunning(true);
    setComplete(false);
    setLiveProgress(5);
    setLiveStage(ar ? "إرسال سياق الصفحة" : "Sending page context");
    setError(null);
    try {
      const response = await fetch("/api/ai/page-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: `${page.en} (${pathname})`, dataset: data }),
      });
      if (!response.ok) {
        const errorPayload = (await response.json()) as { error?: string };
        throw new Error(errorPayload.error ?? "Model run failed.");
      }
      const payload = response.headers.get("content-type")?.includes("application/x-ndjson")
        ? await readPageAnalysisStream(response, (progress, stage) => {
            setLiveProgress(progress);
            setLiveStage(pageStageLabel(stage, ar));
          })
        : ((await response.json()) as PageAnalysisResult);
      setResult(payload);
      setComplete(true);
      setLiveProgress(100);
      setLiveStage(ar ? "اكتمل تحليل الصفحة" : "Page analysis complete");
      await new Promise((resolve) => window.setTimeout(resolve, 650));
      setResultOpen(true);
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "Model run failed.");
    } finally {
      setRunning(false);
      setComplete(false);
      setLiveProgress(0);
      setLiveStage(undefined);
    }
  }

  return (
    <>
      <section className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/25 bg-card px-4 py-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <HugeIcon icon={AiMagicIcon} size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">Qasimyah ML Model</p>
            <Chip tone={data ? "gold" : "outline"}>
              {data ? (ar ? "جاهز" : "Ready") : ar ? "بانتظار البيانات" : "Waiting for data"}
            </Chip>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {ar
              ? `تشغيل تحليل مخصص لصفحة ${page.ar}`
              : `Run a page-specific analysis for ${page.en}`}
          </p>
          {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
        </div>
        {result ? (
          <Button variant="outline" size="sm" onClick={() => setResultOpen(true)}>
            {ar ? "عرض آخر نتيجة" : "View last result"}
          </Button>
        ) : null}
        <Button size="sm" onClick={() => void runModel()} disabled={!data || running}>
          <HugeIcon icon={PlayIcon} size={16} />
          {running
            ? ar
              ? "النموذج يعمل..."
              : "Model running..."
            : ar
              ? "تشغيل النموذج"
              : "Run model"}
        </Button>
      </section>

      <AIThinkingOverlay
        open={running}
        complete={complete}
        language={language}
        recordCount={data?.recordCount ?? 0}
        liveProgress={liveProgress}
        liveStage={liveStage}
      />

      {resultOpen && result ? (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-foreground/35 p-4 backdrop-blur-sm">
          <section className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button
              type="button"
              aria-label={ar ? "إغلاق" : "Close"}
              className="absolute top-4 end-4 text-muted-foreground hover:text-foreground"
              onClick={() => setResultOpen(false)}
            >
              <HugeIcon icon={Cancel01Icon} size={19} />
            </button>
            <div className="pe-8">
              <p className="text-xs font-medium text-primary">
                Qasimyah ML Model · {ar ? page.ar : page.en}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-foreground">
                {ar ? result.title.ar : result.title.en}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {ar ? result.summary.ar : result.summary.en}
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {ar ? "أهم النتائج" : "Key findings"}
                </p>
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-foreground/85">
                  {result.findings.map((finding) => (
                    <li key={finding.en} className="flex gap-2">
                      <HugeIcon
                        icon={CheckmarkCircle01Icon}
                        className="mt-0.5 shrink-0 text-primary"
                        size={15}
                      />
                      {ar ? finding.ar : finding.en}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {ar ? "الإجراءات المقترحة" : "Recommended actions"}
                </p>
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-foreground/85">
                  {result.actions.map((action) => (
                    <li key={action.en} className="flex gap-2">
                      <HugeIcon
                        icon={CheckmarkCircle01Icon}
                        className="mt-0.5 shrink-0 text-primary"
                        size={15}
                      />
                      {ar ? action.ar : action.en}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs">
              <span className="text-muted-foreground">
                {ar ? "ثقة التحليل" : "Analysis confidence"}
              </span>
              <span className="font-semibold text-primary">{result.confidence}%</span>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

async function readPageAnalysisStream(
  response: Response,
  onProgress: (progress: number, stage: string) => void,
): Promise<PageAnalysisResult> {
  if (!response.body) throw new Error("The model stream is unavailable.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: PageAnalysisResult | null = null;

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line) as {
        type: "progress" | "result" | "error";
        progress?: number;
        stage?: string;
        result?: PageAnalysisResult;
        error?: string;
      };
      if (event.type === "progress" && event.progress !== undefined && event.stage) {
        onProgress(event.progress, event.stage);
      } else if (event.type === "result" && event.result) {
        result = event.result;
        onProgress(100, "complete");
      } else if (event.type === "error") {
        throw new Error(event.error ?? "Model run failed.");
      }
    }
    if (done) break;
  }

  if (!result) throw new Error("Model run finished without a result.");
  return result;
}

function pageStageLabel(stage: string, ar: boolean) {
  const labels: Record<string, LocalizedText> = {
    context_validated: { ar: "تم التحقق من سياق الصفحة", en: "Page context validated" },
    model_connected: {
      ar: "تم الاتصال بـ Qasimyah ML Model",
      en: "Connected to Qasimyah ML Model",
    },
    model_streaming: { ar: "يستقبل تحليل الصفحة مباشرة", en: "Receiving live page analysis" },
    validating_output: { ar: "التحقق من صحة النتائج", en: "Validating model results" },
    complete: { ar: "اكتمل تحليل الصفحة", en: "Page analysis complete" },
  };
  const label = labels[stage];
  return label ? (ar ? label.ar : label.en) : stage;
}
