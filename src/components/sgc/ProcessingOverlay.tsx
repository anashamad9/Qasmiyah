import { useEffect, useState } from "react";

import { BrandMark } from "@/components/sgc/primitives";
import { useDemo } from "@/context/DemoContext";
import { useIntelligenceData } from "@/context/IntelligenceDataContext";

export function ProcessingOverlay({
  steps,
  onDone,
  stepMs = 500,
}: {
  steps: string[];
  onDone: () => void;
  stepMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const { language } = useDemo();
  const { hasLiveData } = useIntelligenceData();

  useEffect(() => {
    if (index >= steps.length - 1) {
      const finish = setTimeout(onDone, stepMs);
      return () => clearTimeout(finish);
    }
    const next = setTimeout(() => setIndex((i) => i + 1), stepMs);
    return () => clearTimeout(next);
  }, [index, steps.length, stepMs, onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm">
      <div className="w-[min(420px,90vw)] rounded-lg border border-border bg-card p-6 text-center">
        <BrandMark size={52} className="mx-auto animate-pulse" />
        <p className="mt-4 text-sm font-medium text-foreground">{steps[index]}</p>
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-1 bg-primary transition-all duration-500"
            style={{ width: `${((index + 1) / steps.length) * 100}%` }}
          />
        </div>
        <p className="mt-3 text-[10.5px] tracking-wide text-muted-foreground uppercase">
          {hasLiveData
            ? language === "ar"
              ? "تحليل البيانات المرفوعة"
              : "Uploaded data analysis"
            : language === "ar"
              ? "محاكاة توضيحية — بيانات اصطناعية"
              : "Illustrative simulation — synthetic data"}
        </p>
      </div>
    </div>
  );
}
