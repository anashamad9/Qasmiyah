"use client";

import {
  AiMagicIcon,
  Database01Icon,
  Delete02Icon,
  FileUploadIcon,
} from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState } from "react";

import { HugeIcon } from "@/components/sgc/HugeIcon";
import { AIThinkingOverlay } from "@/components/sgc/AIThinkingOverlay";
import { Chip, Panel } from "@/components/sgc/primitives";
import { Button } from "@/components/ui/button";
import type { IntelligenceDataset } from "@/data/types";
import { useDemo } from "@/context/DemoContext";
import { useIntelligenceData } from "@/context/IntelligenceDataContext";

type ApiStatus = { configured: boolean; model: string };

export function DataUploadPanel() {
  const { language } = useDemo();
  const { data, hasLiveData, setLiveData, clearLiveData } = useIntelligenceData();
  const inputRef = useRef<HTMLInputElement>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [records, setRecords] = useState<Record<string, unknown>[]>([]);
  const [working, setWorking] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [liveProgress, setLiveProgress] = useState(0);
  const [liveStage, setLiveStage] = useState<string | undefined>();
  const [message, setMessage] = useState<string | null>(null);
  const ar = language === "ar";

  useEffect(() => {
    void fetch("/api/ai/analyze")
      .then((response) => response.json() as Promise<ApiStatus>)
      .then(setApiStatus)
      .catch(() => setApiStatus({ configured: false, model: "Unavailable" }));
  }, []);

  async function selectFile(nextFile: File | undefined) {
    setMessage(null);
    setFile(null);
    setRecords([]);
    if (!nextFile) return;
    if (nextFile.size > 2_000_000) {
      setMessage(ar ? "يجب ألا يتجاوز الملف 2 ميجابايت." : "The file must be 2 MB or smaller.");
      return;
    }

    try {
      const parsed = parseUpload(await nextFile.text(), nextFile.name);
      if (parsed.length < 3) throw new Error("At least three records are required.");
      if (parsed.length > 1000) throw new Error("A maximum of 1,000 records is supported.");
      setFile(nextFile);
      setRecords(parsed);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not read this file.");
    }
  }

  async function analyze() {
    if (!file || records.length === 0) return;
    setWorking(true);
    setAnalysisComplete(false);
    setLiveProgress(3);
    setLiveStage(ar ? "رفع الملف إلى الخادم" : "Uploading file to server");
    clearLiveData();
    setMessage(
      ar
        ? "تم قبول الملف. يجري Qasimyah ML Model التحليل الآن..."
        : "File accepted. Qasimyah ML Model is analyzing it now...",
    );
    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceName: file.name, records }),
      });
      if (!response.ok) {
        const errorPayload = (await response.json()) as { error?: string };
        throw new Error(errorPayload.error ?? "Analysis failed.");
      }
      const payload = response.headers.get("content-type")?.includes("application/x-ndjson")
        ? await readAnalysisStream(response, (progress, stage) => {
            setLiveProgress(progress);
            setLiveStage(stageLabel(stage, ar));
          })
        : ((await response.json()) as IntelligenceDataset);
      setLiveData(payload);
      setFile(null);
      setRecords([]);
      if (inputRef.current) inputRef.current.value = "";
      setMessage(
        ar
          ? "اكتمل التحليل. ستُحذف النتيجة تلقائياً بعد 5 دقائق."
          : "Analysis complete. The result will be deleted automatically after 5 minutes.",
      );
      setAnalysisComplete(true);
      setLiveProgress(100);
      setLiveStage(ar ? "تم تفعيل لوحة المعلومات" : "Dashboard activated");
      await new Promise((resolve) => window.setTimeout(resolve, 700));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Analysis failed.");
    } finally {
      setWorking(false);
      setAnalysisComplete(false);
      setLiveProgress(0);
      setLiveStage(undefined);
    }
  }

  return (
    <Panel
      title="مصدر البيانات والتحليل"
      titleEn="Data Source & AI Analysis"
      subtitle="ارفع سجلات CSV أو JSON وحللها عبر OpenAI"
      subtitleEn="Upload CSV or JSON records and analyze them with OpenAI"
    >
      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex min-h-36 w-full flex-col items-center justify-center border border-dashed border-primary/40 bg-primary/5 px-5 py-6 text-center transition-colors hover:bg-primary/8"
          >
            <HugeIcon icon={FileUploadIcon} className="text-primary" size={26} />
            <span className="mt-3 text-sm font-medium text-foreground">
              {file?.name ?? (ar ? "اختر ملف بيانات" : "Choose a data file")}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              {file
                ? `${records.length} ${ar ? "سجل جاهز للتحليل" : "records ready"}`
                : ar
                  ? "أي بيانات منظمة بصيغة CSV أو JSON، حتى 2 ميجابايت و1,000 سجل"
                  : "Any structured CSV or JSON data, up to 2 MB and 1,000 records"}
            </span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.json,text/csv,application/json"
            className="sr-only"
            onChange={(event) => void selectFile(event.target.files?.[0])}
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              onClick={() => void analyze()}
              disabled={!file || working || !apiStatus?.configured}
            >
              <HugeIcon icon={AiMagicIcon} size={17} />
              {working
                ? ar
                  ? "جارٍ التحليل..."
                  : "Analyzing..."
                : ar
                  ? "تحليل وتفعيل البيانات"
                  : "Analyze & activate"}
            </Button>
            {hasLiveData ? (
              <Button variant="outline" onClick={clearLiveData} disabled={working}>
                <HugeIcon icon={Delete02Icon} size={17} />
                {ar ? "إزالة البيانات الحالية" : "Remove current data"}
              </Button>
            ) : null}
          </div>
          {message ? <p className="mt-3 text-xs text-foreground/80">{message}</p> : null}
        </div>

        <div className="border-s border-border ps-5">
          <div className="flex items-center gap-2">
            <HugeIcon icon={Database01Icon} className="text-primary" size={19} />
            <p className="text-sm font-semibold text-foreground">
              {ar ? "حالة النظام" : "System status"}
            </p>
          </div>
          <dl className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">{ar ? "واجهة OpenAI" : "OpenAI API"}</dt>
              <dd>
                <Chip tone={apiStatus?.configured ? "gold" : "risk"}>
                  {apiStatus?.configured
                    ? ar
                      ? "متصلة"
                      : "Connected"
                    : ar
                      ? "غير مهيأة"
                      : "Not configured"}
                </Chip>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">{ar ? "النموذج" : "Model"}</dt>
              <dd dir="ltr" className="font-medium text-foreground">
                {apiStatus?.model ?? "..."}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">{ar ? "المصدر النشط" : "Active source"}</dt>
              <dd className="max-w-44 truncate font-medium text-foreground">
                {data?.sourceName ?? (ar ? "لا يوجد" : "None")}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">{ar ? "السجلات" : "Records"}</dt>
              <dd className="font-medium text-foreground">{data?.recordCount ?? 0}</dd>
            </div>
            {hasLiveData && data ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">
                    {ar ? "ثقة التحليل" : "Analysis confidence"}
                  </dt>
                  <dd className="font-medium text-foreground">{data.confidence}%</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">
                    {ar ? "الحذف التلقائي" : "Automatic deletion"}
                  </dt>
                  <dd className="font-medium text-foreground">
                    {ar ? "بعد 5 دقائق" : "After 5 minutes"}
                  </dd>
                </div>
              </>
            ) : null}
          </dl>
        </div>
      </div>

      {!apiStatus?.configured ? (
        <p className="mt-5 border-s-2 border-primary bg-muted/45 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          {ar
            ? "أضف OPENAI_API_KEY إلى ملف .env.local ثم أعد تشغيل الخادم. لا تضع المفتاح في متغير NEXT_PUBLIC."
            : "Add OPENAI_API_KEY to .env.local, then restart the server. Do not place the key in a NEXT_PUBLIC variable."}
        </p>
      ) : null}

      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        {ar
          ? "استخدم بيانات مصرّحاً بها فقط، واحذف الأسماء وأرقام الهواتف والبريد الإلكتروني وأي معلومات شخصية قبل الرفع."
          : "Upload authorized data only. Remove names, phone numbers, email addresses, and other personal information before uploading."}
      </p>

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs font-medium text-foreground">
          {ar ? "أمثلة قابلة للتنزيل" : "Downloadable examples"}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs">
          <a
            className="text-primary hover:underline"
            href="/data-examples/01-social-listening.csv"
            download
          >
            {ar ? "1. الاستماع الاجتماعي" : "1. Social listening"}
          </a>
          <a
            className="text-primary hover:underline"
            href="/data-examples/02-campaign-performance.csv"
            download
          >
            {ar ? "2. أداء الحملة" : "2. Campaign performance"}
          </a>
          <a
            className="text-primary hover:underline"
            href="/data-examples/03-audience-survey.csv"
            download
          >
            {ar ? "3. استطلاع الجمهور" : "3. Audience survey"}
          </a>
        </div>
      </div>

      <AIThinkingOverlay
        open={working}
        complete={analysisComplete}
        language={language}
        recordCount={records.length || data?.recordCount || 0}
        liveProgress={liveProgress}
        liveStage={liveStage}
      />
    </Panel>
  );
}

async function readAnalysisStream(
  response: Response,
  onProgress: (progress: number, stage: string) => void,
): Promise<IntelligenceDataset> {
  if (!response.body) throw new Error("The analysis stream is unavailable.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: IntelligenceDataset | null = null;

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
        result?: IntelligenceDataset;
        error?: string;
      };
      if (event.type === "progress" && event.progress !== undefined && event.stage) {
        onProgress(event.progress, event.stage);
      } else if (event.type === "result" && event.result) {
        result = event.result;
        onProgress(100, "complete");
      } else if (event.type === "error") {
        throw new Error(event.error ?? "Analysis failed.");
      }
    }
    if (done) break;
  }

  if (!result) throw new Error("Analysis finished without a result.");
  return result;
}

function stageLabel(stage: string, ar: boolean) {
  const labels: Record<string, { ar: string; en: string }> = {
    validated: { ar: "تم التحقق من الملف", en: "Dataset validated" },
    profiled: { ar: "اكتمل تحليل بنية البيانات", en: "Data structure profiled" },
    model_connected: {
      ar: "تم الاتصال بـ Qasimyah ML Model",
      en: "Connected to Qasimyah ML Model",
    },
    model_streaming: { ar: "يستقبل النتائج من النموذج مباشرة", en: "Receiving live model output" },
    validating_output: { ar: "التحقق من صحة النتائج", en: "Validating model results" },
    complete: { ar: "اكتمل التحليل", en: "Analysis complete" },
  };
  const label = labels[stage];
  return label ? (ar ? label.ar : label.en) : stage;
}

function parseUpload(text: string, fileName: string): Record<string, unknown>[] {
  if (fileName.toLowerCase().endsWith(".json")) {
    const parsed = JSON.parse(text) as unknown;
    const rows = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object" && "records" in parsed
        ? (parsed as { records: unknown }).records
        : null;
    if (!Array.isArray(rows))
      throw new Error("JSON must be an array or an object with a records array.");
    if (!rows.every((row) => row && typeof row === "object" && !Array.isArray(row))) {
      throw new Error("Every JSON record must be an object.");
    }
    return rows as Record<string, unknown>[];
  }

  if (!fileName.toLowerCase().endsWith(".csv")) throw new Error("Use a .csv or .json file.");
  return parseCsv(text);
}

function parseCsv(text: string): Record<string, unknown>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        value += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(value.trim());
      value = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(value.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }
  row.push(value.trim());
  if (row.some(Boolean)) rows.push(row);
  const headers = rows.shift()?.map((header) => header.replace(/^\uFEFF/, ""));
  if (!headers?.length || headers.some((header) => !header))
    throw new Error("CSV headers are missing.");

  return rows.map((cells) =>
    Object.fromEntries(
      headers.map((header, index) => [header, coerceCsvValue(cells[index] ?? "")]),
    ),
  );
}

function coerceCsvValue(value: string): string | number | boolean | null {
  if (value === "") return null;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  return value;
}
