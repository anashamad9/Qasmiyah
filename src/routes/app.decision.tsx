"use client";

import Link from "next/link";
import { useState } from "react";

import { Chip, Panel, SectionTitle } from "@/components/sgc/primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDemo } from "@/context/DemoContext";
import { useRequiredIntelligenceData } from "@/context/IntelligenceDataContext";
import { compareScenarios, generateRecommendation } from "@/lib/simulation/engine";
import { cn } from "@/lib/utils";
import type { DecisionRecord } from "@/data/types";

const options: { key: DecisionRecord["decision"]; labelAr: string; labelEn: string }[] = [
  { key: "APPROVE", labelAr: "اعتماد", labelEn: "Approve" },
  { key: "MODIFY", labelAr: "تعديل", labelEn: "Modify" },
  { key: "REJECT", labelAr: "رفض", labelEn: "Reject" },
];

export default function HumanDecision() {
  const { segmentId, messageId, scenarioId, decisions, addDecision } = useDemo();
  const { data, hasLiveData } = useRequiredIntelligenceData();
  const segment = data.segments.find((item) => item.id === segmentId) ?? data.segments[0]!;
  const message = data.messages.find((item) => item.id === messageId) ?? data.messages[0]!;
  const selectedScenario =
    data.scenarios.find((item) => item.id === scenarioId) ?? data.scenarios[0]!;
  const recommendation = generateRecommendation(
    segment,
    compareScenarios(segment, message, data.scenarios),
    data.scenarios,
  );
  const [choice, setChoice] = useState<DecisionRecord["decision"]>("APPROVE");
  const [rationale, setRationale] = useState("");

  const submit = () => {
    addDecision({
      id: `dec-${Date.now()}`,
      decisionMaker: "Demo User — demo@sgc-dt.ai",
      timestamp: new Date().toISOString(),
      decision: choice,
      selectedScenario: selectedScenario.nameAr,
      aiRecommendation: recommendation.scenarioNameAr,
      campaignVersion: hasLiveData ? `AI / ${data.sourceName}` : "v1.0 (Sample)",
      rationale: rationale || "—",
    });
    setRationale("");
  };

  return (
    <>
      <SectionTitle
        title="القرار البشري"
        titleEn="Human Decision"
        subtitle="الذكاء الاصطناعي يساعد، والإنسان يقرر."
        subtitleEn="AI assists — Human decides."
        right={<Chip tone="gold">HUMAN DECISION</Chip>}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="AI Recommendation" subtitle="توصية الذكاء الاصطناعي">
          <p className="text-sm font-semibold text-foreground">
            Launch: {recommendation.scenarioName} — {recommendation.scenarioNameAr}
          </p>
          <ul className="mt-3 space-y-1.5 text-[12.5px] text-foreground/80">
            {recommendation.reasonsAr.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
          <p className="mt-4 text-[10.5px] tracking-wide text-muted-foreground uppercase">
            Demo Analytical Estimate
          </p>
        </Panel>

        <Panel title="القرار" subtitle="Decision">
          <div className="flex flex-wrap gap-2">
            {options.map((o) => (
              <button
                key={o.key}
                onClick={() => setChoice(o.key)}
                className={cn(
                  "rounded-md border px-4 py-2 text-[13px] transition-colors",
                  choice === o.key
                    ? "border-primary bg-primary/10 font-semibold text-primary"
                    : "border-border text-muted-foreground hover:bg-muted/60",
                )}
              >
                {o.labelAr} / {o.labelEn}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <p className="mb-1.5 text-xs text-muted-foreground">Decision Rationale</p>
            <Textarea
              rows={4}
              value={rationale}
              placeholder="سبب القرار…"
              onChange={(e) => setRationale(e.target.value)}
            />
          </div>
          <p className="mt-3 text-[11.5px] text-muted-foreground">
            السيناريو المختار حالياً: {selectedScenario.nameAr} — الشريحة: {segment.nameAr}
          </p>
          <Button className="mt-4" onClick={submit}>
            تسجيل القرار
          </Button>
        </Panel>
      </div>

      <Panel title="Audit Trail" subtitle="سجل القرارات">
        {decisions.length === 0 ? (
          <p className="text-[12.5px] text-muted-foreground">لا توجد قرارات مسجلة بعد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-2 py-2 text-start font-medium">Timestamp</th>
                  <th className="px-2 py-2 text-start font-medium">Decision Maker</th>
                  <th className="px-2 py-2 text-start font-medium">Decision</th>
                  <th className="px-2 py-2 text-start font-medium">Selected Scenario</th>
                  <th className="px-2 py-2 text-start font-medium">AI Recommendation</th>
                  <th className="px-2 py-2 text-start font-medium">Version</th>
                  <th className="px-2 py-2 text-start font-medium">Rationale</th>
                </tr>
              </thead>
              <tbody>
                {decisions.map((d) => (
                  <tr key={d.id} className="border-b border-border/60">
                    <td className="px-2 py-2 whitespace-nowrap" dir="ltr">
                      {new Date(d.timestamp).toLocaleString("en-GB")}
                    </td>
                    <td className="px-2 py-2">{d.decisionMaker}</td>
                    <td className="px-2 py-2 font-semibold text-primary">{d.decision}</td>
                    <td className="px-2 py-2">{d.selectedScenario}</td>
                    <td className="px-2 py-2">{d.aiRecommendation}</td>
                    <td className="px-2 py-2">{d.campaignVersion}</td>
                    <td className="px-2 py-2">{d.rationale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Button asChild variant="outline" className="mt-5">
          <Link href="/app/learning">Prediction vs Actual</Link>
        </Button>
        <p className="mt-3 text-[11px] text-muted-foreground">
          السيناريوهات المتاحة: {data.scenarios.map((s) => s.nameAr).join(" · ")}
        </p>
      </Panel>
    </>
  );
}
