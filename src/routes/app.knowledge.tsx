"use client";

import { Chip, Panel, SectionTitle } from "@/components/sgc/primitives";
import { useDemo } from "@/context/DemoContext";
import { useRequiredIntelligenceData } from "@/context/IntelligenceDataContext";

export default function KnowledgeBase() {
  const { campaign, segmentId, messageId, scenarioId, decisions } = useDemo();
  const { data, hasLiveData } = useRequiredIntelligenceData();
  const segment = data.segments.find((item) => item.id === segmentId) ?? data.segments[0]!;
  const message = data.messages.find((item) => item.id === messageId) ?? data.messages[0]!;
  const scenario = data.scenarios.find((item) => item.id === scenarioId) ?? data.scenarios[0]!;

  const rows = [
    { label: "Campaign", value: `${campaign.nameAr} — ${campaign.nameEn}` },
    { label: "Audience", value: `${segment.nameAr} (${segment.name})` },
    { label: "Message", value: `${message.label}: ${message.text}` },
    { label: "Scenario", value: `${scenario.nameAr} — ${scenario.channel}` },
    { label: "AI Recommendation", value: data.recommendation.ar },
    {
      label: "Human Decision",
      value: decisions[0]
        ? `${decisions[0].decision} — ${decisions[0].rationale}`
        : "لم يُسجَّل قرار بعد",
    },
    { label: "Analysis Confidence", value: hasLiveData ? `${data.confidence}%` : "Sample data" },
    { label: "Source", value: data.sourceName },
  ];

  return (
    <>
      <SectionTitle
        title="قاعدة المعرفة"
        titleEn="Knowledge Base"
        subtitle={hasLiveData ? "معرفة مستخلصة من البيانات المرفوعة" : "معرفة توضيحية"}
        subtitleEn={
          hasLiveData ? "Knowledge derived from uploaded data" : "Demonstration Knowledge"
        }
        right={<Chip tone="gold">{hasLiveData ? "AI DATA" : "SAMPLE"}</Chip>}
      />

      <Panel title="سجل الدورة الحالية" footnote="Demonstration Knowledge">
        <dl className="divide-y divide-border">
          {rows.map((r) => (
            <div key={r.label} className="grid gap-1 py-3 sm:grid-cols-[200px_1fr]">
              <dt className="text-[12px] text-muted-foreground">{r.label}</dt>
              <dd className="text-[13px] text-foreground/85">{r.value}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title="Lessons Learned" subtitle="الدروس المستفادة" footnote="Demonstration Knowledge">
        <ul className="space-y-2 text-[12.5px] text-foreground/85">
          <li>• {data.summary.ar}</li>
          <li>• {data.recommendation.ar}</li>
          {data.emergingTopics.map((topic) => (
            <li key={topic.en}>• موضوع ناشئ: {topic.ar}</li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
