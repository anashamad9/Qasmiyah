"use client";

import Link from "next/link";

import { Chip, FlowChain, MetricBar, Panel, SectionTitle } from "@/components/sgc/primitives";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/context/DemoContext";
import { useRequiredIntelligenceData } from "@/context/IntelligenceDataContext";
import { simulateMessage } from "@/lib/simulation/engine";
import { cn } from "@/lib/utils";

const levelValue = { LOW: 30, MEDIUM: 60, HIGH: 92 } as const;

export default function DigitalTwin() {
  const { segmentId, setSegmentId, messageId, scenarioId } = useDemo();
  const { data, hasLiveData } = useRequiredIntelligenceData();
  const segment = data.segments.find((item) => item.id === segmentId) ?? data.segments[0]!;
  const message = data.messages.find((item) => item.id === messageId) ?? data.messages[0]!;
  const scenario = data.scenarios.find((item) => item.id === scenarioId) ?? data.scenarios[0]!;
  const result = simulateMessage(segment, message, scenario);

  const attributes = [
    { label: "Sharing Tendency — نزعة المشاركة", level: segment.sharingTendency },
    { label: "Verification Tendency — نزعة التحقق", level: segment.verificationTendency },
    { label: "Source Sensitivity — الحساسية للمصدر", level: segment.sourceSensitivity },
    { label: "Trust in Official Sources — الثقة بالمصادر الرسمية", level: segment.officialTrust },
    { label: "Message Fatigue — إشباع الرسائل", level: segment.messageFatigue },
  ];

  return (
    <>
      <SectionTitle
        title="التوأم الرقمي للجمهور"
        titleEn="Audience Digital Twin"
        subtitle="نموذج سلوكي مجمّع"
        subtitleEn="Aggregated Behavioural Model"
        right={<Chip tone="gold">{hasLiveData ? "AI DATA" : "SIMULATION"}</Chip>}
      />

      <Panel title="ما هو التوأم الرقمي؟">
        <p className="text-[13px] leading-relaxed text-foreground/85">
          The Digital Twin is not a digital copy of an individual. It is an aggregated behavioural
          model representing how defined audience segments may perceive and respond to communication
          under specific scenarios.
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
          التوأم الرقمي ليس نسخة رقمية من فرد، بل نموذج سلوكي مجمّع يمثل كيف قد تدرك شرائح الجمهور
          المحددة الرسالة وتستجيب لها في ظل سيناريوهات محددة.
        </p>
        <div className="mt-5 overflow-x-auto pb-1">
          <FlowChain
            steps={[
              "Audience Signals",
              "Behavioural Attributes",
              "Context",
              "Message",
              "Scenario",
              "Predicted Response",
            ]}
          />
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="اختيار الشريحة" subtitle="Segment Selection">
          <div className="space-y-2">
            {data.segments.map((s) => (
              <button
                key={s.id}
                onClick={() => setSegmentId(s.id)}
                className={cn(
                  "w-full rounded-md border px-3 py-2 text-start text-[13px] transition-colors",
                  s.id === segment.id
                    ? "border-primary bg-primary/8 font-semibold text-foreground"
                    : "border-border text-muted-foreground hover:bg-muted/60",
                )}
              >
                {s.nameAr}
                <span className="ms-2 text-[10.5px] text-muted-foreground/80">{s.name}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel
          title="Behavioural Attributes"
          subtitle={`الشريحة المختارة: ${segment.nameAr}`}
          footnote="Synthetic Behavioral Segment — Prototype"
        >
          <div className="space-y-3">
            {attributes.map((a) => (
              <div key={a.label}>
                <MetricBar label={`${a.label} — ${a.level}`} value={levelValue[a.level]} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Behavioural Model Visualization"
          subtitle="تمثيل نظامي للنموذج — ليس صورة شخص"
          footnote="Demo Analytical Estimate"
        >
          <div className="relative mx-auto flex aspect-square w-full max-w-[240px] items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-primary/25" />
            <div className="absolute inset-[14%] rounded-full border border-primary/20" />
            <div className="absolute inset-[28%] rounded-full border border-primary/15" />
            {attributes.map((a, i) => {
              const angle = (i / attributes.length) * Math.PI * 2;
              const r = 38 + (levelValue[a.level] / 100) * 10;
              return (
                <span
                  key={a.label}
                  className="absolute size-3 rounded-full bg-primary"
                  style={{
                    left: `${50 + Math.cos(angle) * r}%`,
                    top: `${50 + Math.sin(angle) * r}%`,
                    opacity: levelValue[a.level] / 100,
                  }}
                />
              );
            })}
            <div className="z-10 text-center">
              <p className="text-2xl font-semibold text-foreground">{result.composite}</p>
              <p className="text-[10.5px] tracking-wide text-muted-foreground uppercase">
                Composite Index
              </p>
            </div>
          </div>
          <Button asChild className="mt-5 w-full">
            <Link href="/app/messages">Simulate Message</Link>
          </Button>
        </Panel>
      </div>
    </>
  );
}
