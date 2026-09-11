"use client";

import Link from "next/link";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";

import { HugeIcon } from "@/components/sgc/HugeIcon";
import { ProcessingOverlay } from "@/components/sgc/ProcessingOverlay";
import { Chip, KpiCard, Panel, SectionTitle } from "@/components/sgc/primitives";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/context/DemoContext";
import { useRequiredIntelligenceData } from "@/context/IntelligenceDataContext";

export default function Optimization() {
  const { setOptimizedText, optimizedText } = useDemo();
  const { data, hasLiveData } = useRequiredIntelligenceData();
  const original = data.messages[0]!;
  const recommended = [...data.messages].sort(
    (a, b) =>
      b.verificationIntent +
      b.audienceFit -
      b.risk -
      (a.verificationIntent + a.audienceFit - a.risk),
  )[0]!;
  const score = (message: typeof original) =>
    Math.round(
      (message.clarity + message.audienceFit + message.verificationIntent + (100 - message.risk)) /
        4,
    );
  const opt = {
    originalText: original.text,
    optimizedText: recommended.text,
    rationaleAr: hasLiveData
      ? [
          data.recommendation.ar,
          `وضوح مقدّر ${recommended.clarity}%`,
          `ملاءمة جمهور مقدّرة ${recommended.audienceFit}%`,
          `مخاطرة اتصالية مقدّرة ${recommended.risk}%`,
        ]
      : ["أكثر قابلية للتنفيذ", "أقصر وأسهل للتذكر", "خطوة تحقق صريحة"],
    before: score(original),
    after: score(recommended),
  };
  const [resimulated, setResimulated] = useState(Boolean(optimizedText));
  const [running, setRunning] = useState(false);

  return (
    <>
      <SectionTitle
        title="تحسين الرسالة بالذكاء الاصطناعي"
        titleEn="AI Message Optimization"
        subtitle="تحسين الرسالة بالذكاء الاصطناعي"
        subtitleEn="AI-assisted message refinement"
        right={<Chip tone="gold">{hasLiveData ? "AI DATA" : "AI RECOMMENDATION"}</Chip>}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Original Message" subtitle="الصياغة الأصلية">
          <p className="text-[15px] leading-relaxed text-foreground">{opt.originalText}</p>
        </Panel>
        <Panel title="AI Optimized" subtitle="الصياغة المحسّنة">
          <p className="text-[15px] leading-relaxed font-medium text-primary">
            {opt.optimizedText}
          </p>
        </Panel>
      </div>

      <Panel title="Optimization Rationale" subtitle="مبررات التحسين">
        <ul className="grid gap-1.5 text-[12.5px] text-foreground/85 sm:grid-cols-2">
          {opt.rationaleAr.map((r) => (
            <li key={r} className="flex items-center gap-2">
              <HugeIcon icon={ArrowLeft01Icon} className="text-primary" size={14} />
              {r}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => setRunning(true)}>Re-Simulate</Button>
          {resimulated ? <Chip tone="outline">تمت إعادة المحاكاة</Chip> : null}
        </div>
      </Panel>

      {resimulated ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard
              label="قبل التحسين"
              labelEn="Before Optimization"
              value={String(opt.before)}
              note="Simulation Result — Not Real-World Performance"
            />
            <KpiCard
              label="بعد التحسين"
              labelEn="After Optimization"
              value={String(opt.after)}
              note="Simulation Result — Not Real-World Performance"
            />
            <KpiCard
              label="الفرق التقديري"
              labelEn="Delta"
              value={`+${opt.after - opt.before}`}
              note="Prototype Simulation"
            />
          </div>
          <Panel title="الخطوة التالية">
            <p className="text-[12.5px] text-muted-foreground">
              هذه النتائج ليست أداءً واقعياً مُتحققاً، بل مخرجات محرك محاكاة حتمي على بيانات
              اصطناعية.
            </p>
            <Button asChild className="mt-4">
              <Link href="/app/prediction">Predicted Campaign Outcome</Link>
            </Button>
          </Panel>
        </>
      ) : null}

      {running ? (
        <ProcessingOverlay
          steps={[
            "Analyzing message...",
            "Applying optimization rules...",
            "Re-simulating response...",
          ]}
          onDone={() => {
            setRunning(false);
            setResimulated(true);
            setOptimizedText(opt.optimizedText);
          }}
        />
      ) : null}
    </>
  );
}
