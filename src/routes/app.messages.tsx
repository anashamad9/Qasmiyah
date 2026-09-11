"use client";

import Link from "next/link";
import { AiSparklesIcon } from "@hugeicons/core-free-icons";

import { HugeIcon } from "@/components/sgc/HugeIcon";
import { Chip, MetricBar, Panel, SectionTitle } from "@/components/sgc/primitives";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/context/DemoContext";
import { useRequiredIntelligenceData } from "@/context/IntelligenceDataContext";
import { cn } from "@/lib/utils";

export default function MessageLab() {
  const { messageId, setMessageId, segmentId, language } = useDemo();
  const { data, hasLiveData } = useRequiredIntelligenceData();
  const ar = language === "ar";
  const segment = data.segments.find((item) => item.id === segmentId) ?? data.segments[0]!;
  const selected = data.messages.find((m) => m.id === messageId) ?? data.messages[0]!;
  const recommended = [...data.messages].sort(
    (a, b) =>
      b.audienceFit +
      b.verificationIntent -
      b.risk -
      (a.audienceFit + a.verificationIntent - a.risk),
  )[0]!;

  return (
    <>
      <SectionTitle
        title="مختبر الرسائل"
        titleEn="Message Lab"
        subtitle={`الشريحة المختارة: ${segment.nameAr}`}
        subtitleEn={`Selected segment: ${segment.name}`}
        right={<Chip tone="gold">AI DATA</Chip>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {data.messages.map((m) => (
          <button
            key={m.id}
            onClick={() => setMessageId(m.id)}
            className={cn(
              "rounded-lg border p-5 text-start transition-colors",
              m.id === selected.id
                ? "border-primary bg-primary/6"
                : "border-border bg-card hover:bg-muted/50",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
                {m.label}
              </span>
              {m.id === selected.id ? <Chip tone="gold">{ar ? "محدد" : "Selected"}</Chip> : null}
            </div>
            <p className="mt-2 text-[15px] leading-relaxed font-medium text-foreground">
              {ar ? m.text : (m.textEn ?? m.text)}
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <MetricBar label="Clarity" value={m.clarity} />
              <MetricBar label="Audience Fit" value={m.audienceFit} />
              <MetricBar label="Trust" value={m.trust} />
              <MetricBar label="Expected Interaction" value={m.expectedInteraction} />
              <MetricBar label="Verification Intent" value={m.verificationIntent} />
              <MetricBar label="Communication Risk" value={m.risk} invert />
            </div>
            <p className="mt-3 text-[10.5px] tracking-wide text-muted-foreground uppercase">
              Demo Analytical Estimate
            </p>
          </button>
        ))}
      </div>

      <Panel
        title="توصية الذكاء الاصطناعي"
        titleEn="AI Recommendation"
        subtitle={hasLiveData ? "مبنية على البيانات المرفوعة" : "توصية توضيحية"}
        subtitleEn={hasLiveData ? "Based on the uploaded dataset" : "Illustrative recommendation"}
        footnote={hasLiveData ? "تحليل OpenAI — يتطلب مراجعة بشرية" : "تقدير تحليلي تجريبي"}
        footnoteEn={
          hasLiveData
            ? "OpenAI analysis — human review required"
            : "Illustrative analytical estimate"
        }
      >
        <div className="flex flex-wrap items-start gap-4">
          <HugeIcon icon={AiSparklesIcon} className="mt-0.5 shrink-0 text-primary" size={20} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              {ar ? data.recommendation.ar : data.recommendation.en}
            </p>
            <ul className="mt-3 grid gap-1.5 text-[12.5px] text-foreground/80 sm:grid-cols-2">
              <li>
                • {ar ? `الوضوح: ${recommended.clarity}%` : `Clarity: ${recommended.clarity}%`}
              </li>
              <li>
                •{" "}
                {ar
                  ? `ملاءمة الجمهور: ${recommended.audienceFit}%`
                  : `Audience fit: ${recommended.audienceFit}%`}
              </li>
              <li>• {ar ? `الثقة: ${recommended.trust}%` : `Trust: ${recommended.trust}%`}</li>
              <li>
                •{" "}
                {ar
                  ? `نية التحقق: ${recommended.verificationIntent}%`
                  : `Verification intent: ${recommended.verificationIntent}%`}
              </li>
              <li>
                •{" "}
                {ar
                  ? `المخاطرة الاتصالية: ${recommended.risk}%`
                  : `Communication risk: ${recommended.risk}%`}
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => setMessageId(recommended.id)} variant="outline">
                {ar ? "اعتماد توصية الذكاء الاصطناعي" : "Use AI recommendation"}
              </Button>
              <Button asChild>
                <Link href="/app/simulator">Scenario Simulator</Link>
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </>
  );
}
