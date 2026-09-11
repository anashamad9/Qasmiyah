"use client";

import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";
import { useState } from "react";

import { HugeIcon } from "@/components/sgc/HugeIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDemo } from "@/context/DemoContext";
import { useIntelligenceData } from "@/context/IntelligenceDataContext";
import { cn } from "@/lib/utils";

export function BrandMark({ size = 44, className }: { size?: number; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-center text-[10px] leading-none font-semibold text-primary",
          className,
        )}
        style={{ width: size, height: size }}
        aria-label="الجامعة القاسمية"
      >
        AQ
      </span>
    );
  }

  return (
    <img
      src="/شعار-الجامعة-القاسمية.png"
      alt="الجامعة القاسمية"
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover", className)}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}

export function Chip({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "gold" | "outline" | "risk";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide whitespace-nowrap",
        tone === "gold" && "bg-primary/12 text-primary",
        tone === "neutral" && "bg-muted text-muted-foreground",
        tone === "risk" && "bg-destructive/10 text-destructive",
        tone === "outline" && "border border-border text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

export function DemoEstimateLabel({ text = "Demo Analytical Estimate" }: { text?: string }) {
  const { language } = useDemo();
  const { hasLiveData } = useIntelligenceData();
  const label = hasLiveData
    ? language === "ar"
      ? "تحليل OpenAI للبيانات المرفوعة — يتطلب مراجعة بشرية"
      : "OpenAI analysis of uploaded data — human review required"
    : language === "ar" && text === "Demo Analytical Estimate"
      ? "تقدير تحليلي تجريبي"
      : text;

  return (
    <span className="text-[10.5px] tracking-wide text-muted-foreground uppercase">{label}</span>
  );
}

export function SectionTitle({
  title,
  titleEn,
  subtitle,
  subtitleEn,
  right,
}: {
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  right?: ReactNode;
}) {
  const { language } = useDemo();
  const displayTitle = language === "en" ? (titleEn ?? title) : title;
  const displaySubtitle = language === "en" ? (subtitleEn ?? subtitle) : subtitle;

  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{displayTitle}</h1>
        {displaySubtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{displaySubtitle}</p>
        ) : null}
      </div>
      {right}
    </div>
  );
}

export function Panel({
  title,
  titleEn,
  subtitle,
  subtitleEn,
  footnote,
  footnoteEn,
  children,
  className,
  hint,
}: {
  title?: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  footnote?: string;
  footnoteEn?: string;
  children: ReactNode;
  className?: string;
  hint?: string;
}) {
  const { language } = useDemo();
  const displayTitle = language === "en" ? (titleEn ?? title) : title;
  const displaySubtitle = language === "en" ? (subtitleEn ?? subtitle) : subtitle;
  const displayFootnote = language === "en" ? (footnoteEn ?? footnote) : footnote;

  return (
    <section className={cn("rounded-lg border border-border bg-card p-5", className)}>
      {displayTitle ? (
        <header className="mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-wide text-foreground">{displayTitle}</h2>
            {hint ? (
              <Tooltip>
                <TooltipTrigger aria-label="شرح">
                  <HugeIcon
                    icon={InformationCircleIcon}
                    className="text-muted-foreground"
                    size={14}
                  />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">{hint}</TooltipContent>
              </Tooltip>
            ) : null}
          </div>
          {displaySubtitle ? (
            <p className="mt-1 text-xs text-muted-foreground">{displaySubtitle}</p>
          ) : null}
        </header>
      ) : null}
      {children}
      {displayFootnote ? (
        <footer className="mt-4 border-t border-border pt-3">
          <DemoEstimateLabel text={displayFootnote} />
        </footer>
      ) : null}
    </section>
  );
}

export function KpiCard({
  label,
  labelEn,
  value,
  note,
}: {
  label: string;
  labelEn?: string;
  value: string;
  note?: string;
}) {
  const { language } = useDemo();
  const primaryLabel = language === "en" ? (labelEn ?? label) : label;
  const secondaryLabel = language === "en" && labelEn ? label : null;
  const displayValue = language === "ar" && value === "Prototype" ? "نموذج أولي" : value;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{primaryLabel}</p>
      {secondaryLabel ? (
        <p className="text-[10.5px] text-muted-foreground/70">{secondaryLabel}</p>
      ) : null}
      <p className="mt-2 text-2xl font-semibold text-foreground">{displayValue}</p>
      {note ? <p className="mt-1 text-[10.5px] text-muted-foreground uppercase">{note}</p> : null}
    </div>
  );
}

export function MetricBar({
  label,
  value,
  invert,
}: {
  label: string;
  value: number;
  invert?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div
          className={cn("h-1.5 rounded-full", invert ? "bg-destructive/70" : "bg-primary")}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function FlowChain({ steps, dense }: { steps: string[]; dense?: boolean }) {
  const { language } = useDemo();
  const arrow = language === "ar" ? "←" : "→";

  return (
    <ol className="flex flex-wrap items-center gap-2">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-2">
          <span
            className={cn(
              "rounded border border-primary/25 bg-primary/6 text-foreground",
              dense ? "px-2 py-1 text-[11px]" : "px-3 py-1.5 text-xs",
            )}
          >
            {step}
          </span>
          {i < steps.length - 1 ? <span className="text-primary/60">{arrow}</span> : null}
        </li>
      ))}
    </ol>
  );
}

export function OrnamentRule() {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      <span className="h-px flex-1 bg-border" />
      <span className="size-1.5 rotate-45 bg-primary/50" />
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
