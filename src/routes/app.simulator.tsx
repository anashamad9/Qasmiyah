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
import { Chip, MetricBar, Panel, SectionTitle } from "@/components/sgc/primitives";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/context/DemoContext";
import { useRequiredIntelligenceData } from "@/context/IntelligenceDataContext";
import { compareScenarios, generateRecommendation } from "@/lib/simulation/engine";
import { cn } from "@/lib/utils";

const axis = { fontSize: 11, fill: "var(--color-muted-foreground)" };

export default function ScenarioSimulator() {
  const { language, segmentId, messageId, scenarioId, setScenarioId } = useDemo();
  const { data, hasLiveData } = useRequiredIntelligenceData();
  const segment = data.segments.find((item) => item.id === segmentId) ?? data.segments[0]!;
  const message = data.messages.find((item) => item.id === messageId) ?? data.messages[0]!;
  const [simulated, setSimulated] = useState(false);
  const [running, setRunning] = useState(false);

  const results = compareScenarios(segment, message, data.scenarios);
  const recommendation = generateRecommendation(segment, results, data.scenarios);
  const recommendedScenario =
    data.scenarios.find((item) => item.id === recommendation.scenarioId) ?? data.scenarios[0]!;
  const recommendedResult =
    results.find((item) => item.scenarioId === recommendation.scenarioId) ?? results[0]!;
  const ar = language === "ar";

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

          <Panel
            title="السيناريو الموصى به — التفاصيل الكاملة"
            titleEn="Recommended Scenario — Full Brief"
            subtitle="ملخص تنفيذي متكامل لمراجعة السيناريو قبل اعتماده"
            subtitleEn="A complete decision brief for reviewing the scenario before approval"
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
              <div>
                <p className="text-xl font-semibold text-foreground">
                  {ar ? recommendation.scenarioNameAr : recommendation.scenarioName}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {ar ? recommendation.scenarioName : recommendation.scenarioNameAr}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Chip tone="gold">
                  {ar
                    ? `درجة التوصية ${recommendation.score}%`
                    : `Recommendation ${recommendation.score}%`}
                </Chip>
                <Chip tone="outline">{recommendedScenario.channel}</Chip>
              </div>
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
              <div className="space-y-5">
                <section className="rounded-lg border border-border bg-muted/25 p-4">
                  <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
                    {ar ? "فكرة السيناريو وسياقه" : "Scenario concept and context"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-foreground/85">
                    {ar
                      ? recommendedScenario.contextAr
                      : (recommendedScenario.contextEn ?? recommendedScenario.contextAr)}
                  </p>
                </section>

                <section>
                  <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
                    {ar ? "الرسالة التي ستصل إلى الجمهور" : "Audience-facing message"}
                  </p>
                  <blockquote className="mt-2 rounded-lg border-s-4 border-primary bg-primary/6 px-5 py-4 text-[15px] leading-8 text-foreground">
                    {ar ? message.text : (message.textEn ?? message.text)}
                  </blockquote>
                </section>

                <section>
                  <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
                    {ar ? "الاستجابة المتوقعة" : "Expected response"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-foreground/80">
                    {ar
                      ? recommendedScenario.expectedResponseAr
                      : (recommendedScenario.expectedResponseEn ??
                        recommendedScenario.expectedResponseAr)}
                  </p>
                </section>
              </div>

              <aside className="rounded-lg border border-border bg-secondary/45 p-5">
                <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
                  {ar ? "الجمهور المستهدف" : "Target audience"}
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {ar ? segment.nameAr : segment.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {ar ? `الحصة التقديرية: ${segment.share}%` : `Estimated share: ${segment.share}%`}
                </p>
                <p className="mt-4 text-[12.5px] leading-6 text-foreground/75">
                  {ar ? segment.profileAr : (segment.profileEn ?? segment.profileAr)}
                </p>

                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-[11px] font-semibold text-foreground">
                    {ar ? "عوامل يجب مراقبتها" : "Factors to monitor"}
                  </p>
                  <ul className="mt-2 space-y-2 text-xs leading-5 text-muted-foreground">
                    {(ar
                      ? segment.riskFactorsAr
                      : (segment.riskFactorsEn ?? segment.riskFactorsAr)
                    ).map((factor) => (
                      <li key={factor} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>

            <section className="mt-6 border-t border-border pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">
                  {ar ? "المؤشرات المتوقعة" : "Predicted indicators"}
                </p>
                <span className="text-[10px] text-muted-foreground">
                  {ar
                    ? "قيم تقديرية من بيئة المحاكاة"
                    : "Estimates from the simulation environment"}
                </span>
              </div>
              <div className="mt-4 grid gap-x-7 gap-y-4 sm:grid-cols-2 xl:grid-cols-5">
                <MetricBar
                  label={ar ? "وضوح الرسالة" : "Clarity"}
                  value={recommendedResult.clarity}
                />
                <MetricBar
                  label={ar ? "ملاءمة الجمهور" : "Audience fit"}
                  value={recommendedResult.audienceFit}
                />
                <MetricBar
                  label={ar ? "التفاعل المتوقع" : "Expected interaction"}
                  value={recommendedResult.interaction}
                />
                <MetricBar
                  label={ar ? "نية التحقق" : "Verification intent"}
                  value={recommendedResult.verificationIntent}
                />
                <MetricBar
                  label={ar ? "المخاطرة الاتصالية" : "Communication risk"}
                  value={recommendedResult.risk}
                  invert
                />
              </div>
            </section>

            <div className="mt-6 grid gap-5 border-t border-border pt-5 lg:grid-cols-2">
              <section>
                <p className="text-sm font-semibold text-foreground">
                  {ar ? "لماذا أوصى النموذج بهذا السيناريو؟" : "Why this scenario was recommended"}
                </p>
                <ul className="mt-3 space-y-2 text-[12.5px] leading-6 text-foreground/80">
                  {recommendation.reasonsAr.map((reason) => (
                    <li key={reason} className="flex gap-2">
                      <span className="font-semibold text-primary">✓</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="rounded-lg bg-muted/35 p-4">
                <p className="text-sm font-semibold text-foreground">
                  {ar ? "إعدادات التنفيذ" : "Execution settings"}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                  <div>
                    <dt className="text-muted-foreground">{ar ? "القناة" : "Channel"}</dt>
                    <dd className="mt-1 font-medium text-foreground">
                      {recommendedScenario.channel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{ar ? "التضخيم" : "Amplification"}</dt>
                    <dd className="mt-1 font-medium text-foreground">
                      {Math.round(recommendedScenario.amplification * 100)}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{ar ? "مستوى الرسمية" : "Formality"}</dt>
                    <dd className="mt-1 font-medium text-foreground">
                      {Math.round(recommendedScenario.formality * 100)}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">
                      {ar ? "تعديل المخاطر" : "Risk adjustment"}
                    </dt>
                    <dd className="mt-1 font-medium text-foreground">
                      {recommendedScenario.riskModifier > 0 ? "+" : ""}
                      {recommendedScenario.riskModifier}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <p className="max-w-xl text-[11px] leading-5 text-muted-foreground">
                {ar
                  ? "راجع الرسالة والمؤشرات وعوامل المخاطر مع الفريق المختص قبل الاعتماد النهائي. القرار النهائي يبقى بشرياً."
                  : "Review the message, indicators, and risk factors with the responsible team before final approval. The final decision remains human."}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setScenarioId(recommendation.scenarioId)}>
                  {ar ? "اعتماد السيناريو الموصى به" : "Select recommended scenario"}
                </Button>
                <Button asChild>
                  <Link href="/app/optimization">{ar ? "تحسين الرسالة" : "AI Optimization"}</Link>
                </Button>
              </div>
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
