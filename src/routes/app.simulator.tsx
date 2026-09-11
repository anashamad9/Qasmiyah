"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ProcessingOverlay } from "@/components/sgc/ProcessingOverlay";
import { Chip, Panel, SectionTitle } from "@/components/sgc/primitives";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/context/DemoContext";
import { useRequiredIntelligenceData } from "@/context/IntelligenceDataContext";
import { compareScenarios, generateRecommendation } from "@/lib/simulation/engine";
import { cn } from "@/lib/utils";

const axis = { fontSize: 11, fill: "var(--color-muted-foreground)" };

export default function ScenarioSimulator() {
  const { segmentId, messageId, scenarioId, setScenarioId } = useDemo();
  const { data, hasLiveData } = useRequiredIntelligenceData();
  const segment = data.segments.find((item) => item.id === segmentId) ?? data.segments[0]!;
  const message = data.messages.find((item) => item.id === messageId) ?? data.messages[0]!;
  const [simulated, setSimulated] = useState(false);
  const [running, setRunning] = useState(false);

  const results = compareScenarios(segment, message, data.scenarios);
  const recommendation = generateRecommendation(segment, results, data.scenarios);

  const chartData = results.map((r, i) => ({
    name: data.scenarios[i]?.nameAr ?? `Scenario ${i + 1}`,
    Clarity: r.clarity,
    "Audience Fit": r.audienceFit,
    Interaction: r.interaction,
    "Verification Intent": r.verificationIntent,
    Risk: r.risk,
  }));

  const rows = [
    { label: "Clarity", key: "clarity" as const },
    { label: "Audience Fit", key: "audienceFit" as const },
    { label: "Expected Interaction", key: "interaction" as const },
    { label: "Communication Risk", key: "risk" as const },
    { label: "Verification Intent", key: "verificationIntent" as const },
  ];

  return (
    <>
      <SectionTitle
        title="محاكي السيناريوهات"
        titleEn="Scenario Simulator"
        subtitle={`الرسالة المختارة: ${message.label} — ${message.text}`}
        subtitleEn={`Selected message: ${message.label} — ${message.text}`}
        right={<Chip tone="gold">{hasLiveData ? "AI DATA" : "SIMULATION"}</Chip>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {data.scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => setScenarioId(s.id)}
            className={cn(
              "rounded-lg border p-5 text-start transition-colors",
              s.id === scenarioId
                ? "border-primary bg-primary/6"
                : "border-border bg-card hover:bg-muted/50",
            )}
          >
            <p className="text-sm font-semibold text-foreground">{s.nameAr}</p>
            <p className="text-[11px] text-muted-foreground">{s.name}</p>
            <p className="mt-2 text-[11.5px] text-muted-foreground">{s.channel}</p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-foreground/80">{s.contextAr}</p>
            <p className="mt-2 text-[11.5px] text-muted-foreground">{s.expectedResponseAr}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setRunning(true)}>Simulate</Button>
        {simulated ? <Chip tone="outline">تمت المحاكاة</Chip> : null}
      </div>

      {simulated ? (
        <>
          <Panel
            title="Scenario Comparison"
            subtitle="جدول مقارنة المؤشرات"
            footnote="Demo Analytical Estimate — Prototype Simulation"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="px-2 py-2 text-start font-medium">Indicator</th>
                    {data.scenarios.map((s) => (
                      <th key={s.id} className="px-2 py-2 text-start font-medium">
                        {s.nameAr}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key} className="border-b border-border/60">
                      <td className="px-2 py-2 text-foreground">{row.label}</td>
                      {results.map((r) => (
                        <td
                          key={r.scenarioId}
                          className={cn(
                            "px-2 py-2",
                            row.key === "risk" ? "text-destructive" : "text-foreground",
                          )}
                        >
                          {r[row.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Visual Comparison" footnote="Demo Analytical Estimate">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" tick={axis} />
                <YAxis tick={axis} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Clarity" fill="var(--color-chart-1)" radius={2} />
                <Bar dataKey="Audience Fit" fill="var(--color-chart-2)" radius={2} />
                <Bar dataKey="Interaction" fill="var(--color-chart-4)" radius={2} />
                <Bar dataKey="Verification Intent" fill="var(--color-chart-3)" radius={2} />
                <Bar dataKey="Risk" fill="var(--color-destructive)" radius={2} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Recommended Scenario" subtitle="السيناريو الموصى به">
            <p className="text-sm font-semibold text-foreground">
              {recommendation.scenarioNameAr} — {recommendation.scenarioName}
            </p>
            <p className="mt-2 text-[12.5px] text-muted-foreground">
              Best predicted fit for high-sharing digital audiences while maintaining low
              communication risk.
            </p>
            <ul className="mt-3 space-y-1.5 text-[12.5px] text-foreground/80">
              {recommendation.reasonsAr.map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setScenarioId(recommendation.scenarioId)}>
                اعتماد السيناريو الموصى به
              </Button>
              <Button asChild>
                <Link href="/app/optimization">AI Optimization</Link>
              </Button>
            </div>
          </Panel>
        </>
      ) : (
        <Panel title="لم تُشغّل المحاكاة بعد">
          <p className="text-[12.5px] text-muted-foreground">
            اختر سيناريو ثم اضغط Simulate لعرض المقارنة التقديرية بين السيناريوهات الثلاثة.
          </p>
        </Panel>
      )}

      {running ? (
        <ProcessingOverlay
          steps={[
            "Simulating message response...",
            "Comparing scenarios...",
            "Generating recommendation...",
          ]}
          onDone={() => {
            setRunning(false);
            setSimulated(true);
          }}
        />
      ) : null}
    </>
  );
}
