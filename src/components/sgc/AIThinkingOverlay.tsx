"use client";

import { AiMagicIcon } from "@hugeicons/core-free-icons";

import { HugeIcon } from "@/components/sgc/HugeIcon";
import { BrandMark } from "@/components/sgc/primitives";

interface AIThinkingOverlayProps {
  open: boolean;
  complete: boolean;
  language: "ar" | "en";
  recordCount: number;
  liveProgress: number;
  liveStage?: string | undefined;
}

const stages = [
  { at: 0, ar: "تجهيز الملف للتحليل", en: "Preparing the dataset" },
  { at: 16, ar: "فهم الحقول وبنية البيانات", en: "Understanding fields and structure" },
  { at: 38, ar: "تحليل الإشارات والأنماط", en: "Analyzing signals and patterns" },
  { at: 64, ar: "بناء الشرائح والتوصيات", en: "Building segments and recommendations" },
  { at: 84, ar: "إعداد لوحة المعلومات", en: "Preparing the dashboard" },
  { at: 100, ar: "اكتمل التحليل", en: "Analysis complete" },
];

export function AIThinkingOverlay({
  open,
  complete,
  language,
  recordCount,
  liveProgress,
  liveStage,
}: AIThinkingOverlayProps) {
  const ar = language === "ar";

  if (!open) return null;

  const progress = complete ? 100 : liveProgress;
  const stage = [...stages].reverse().find((item) => progress >= item.at) ?? stages[0]!;
  const remaining = Math.max(0, 100 - progress);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/35 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={ar ? "جاري تحليل البيانات" : "Analyzing data"}
    >
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <BrandMark size={52} />
            <span className="absolute -end-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <HugeIcon icon={AiMagicIcon} size={14} />
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Qasimyah ML Model</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {ar ? `يحلل ${recordCount} سجلاً` : `Analyzing ${recordCount} records`}
            </p>
          </div>
          <span className="ms-auto text-2xl font-semibold tabular-nums text-primary">
            {progress}%
          </span>
        </div>

        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-4 text-xs">
          <p className="font-medium text-foreground">{liveStage ?? (ar ? stage.ar : stage.en)}</p>
          <p className="shrink-0 tabular-nums text-muted-foreground">
            {ar ? `متبقي ${remaining}%` : `${remaining}% remaining`}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground">
          {!complete ? (
            <span className="size-3 animate-spin rounded-full border border-primary/30 border-t-primary" />
          ) : null}
          <span>
            {complete
              ? ar
                ? "تم تفعيل البيانات بنجاح"
                : "Dataset activated successfully"
              : ar
                ? "تحديث مباشر من مراحل الخادم ومخرجات النموذج."
                : "Live updates from server stages and model output."}
          </span>
        </div>
      </section>
    </div>
  );
}
