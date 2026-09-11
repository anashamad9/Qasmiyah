"use client";

import Link from "next/link";
import { HelpCircleIcon, RadioIcon } from "@hugeicons/core-free-icons";

import { HugeIcon } from "@/components/sgc/HugeIcon";
import { Chip, MetricBar, Panel, SectionTitle } from "@/components/sgc/primitives";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/context/DemoContext";
import { useRequiredIntelligenceData } from "@/context/IntelligenceDataContext";
import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axis = { fontSize: 11, fill: "var(--color-muted-foreground)" };
const levelValue = { LOW: 30, MEDIUM: 60, HIGH: 92 } as const;

export default function AudienceIntelligence() {
  const { segmentId, setSegmentId, language } = useDemo();
  const { data, hasLiveData } = useRequiredIntelligenceData();
  const ar = language === "ar";
  const selected = data.segments.find((s) => s.id === segmentId) ?? data.segments[0]!;
  const topicTrends = data.trends.map((point) => ({
    ...point,
    week: ar ? point.week : (point.weekEn ?? point.week),
  }));

  return (
    <>
      <SectionTitle
        title="ذكاء الجمهور"
        titleEn="Audience Intelligence"
        subtitle="فهم بيئة الاتصال قبل إطلاق الحملة"
        subtitleEn="Understanding the communication environment before campaign launch."
        right={<Chip tone="gold">AI DATA</Chip>}
      />

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel
          title="Audience Signals"
          subtitle="إشارات الجمهور"
          footnote="Demo Analytical Estimate"
        >
          <div className="space-y-3">
            {data.signals.map((s) => (
              <div key={s.key}>
                <MetricBar label={ar ? s.labelAr : s.labelEn} value={s.volume} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Topic Trends"
          subtitle="اتجاه الموضوعات خلال 6 أسابيع"
          className="xl:col-span-2"
          footnote="Demo Analytical Estimate"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={topicTrends}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="week" tick={axis} />
              <YAxis tick={axis} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area
                type="monotone"
                dataKey="misinformation"
                stroke="var(--color-chart-1)"
                fill="var(--color-chart-1)"
                fillOpacity={0.16}
              />
              <Area
                type="monotone"
                dataKey="fakeNews"
                stroke="var(--color-chart-4)"
                fill="var(--color-chart-4)"
                fillOpacity={0.14}
              />
              <Area
                type="monotone"
                dataKey="sourceVerification"
                stroke="var(--color-chart-2)"
                fill="var(--color-chart-2)"
                fillOpacity={0.14}
              />
              <Area
                type="monotone"
                dataKey="officialSources"
                stroke="var(--color-chart-3)"
                fill="var(--color-chart-3)"
                fillOpacity={0.12}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Audience Concerns" subtitle="أسئلة الجمهور المتكررة">
          <ul className="space-y-2.5 text-sm text-foreground/85">
            {data.concerns.map((c) => (
              <li key={c.en} className="flex gap-2">
                <HugeIcon
                  icon={HelpCircleIcon}
                  className="mt-0.5 shrink-0 text-primary"
                  size={16}
                />
                {ar ? c.ar : c.en}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Social Listening Layer"
          subtitle="Synthetic Social Listening Dataset"
          className="xl:col-span-2"
          footnote="Synthetic Social Listening Dataset — Demo Analytical Estimate"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-2 py-2 text-start font-medium">Topic</th>
                  <th className="px-2 py-2 text-start font-medium">Volume</th>
                  <th className="px-2 py-2 text-start font-medium">Sentiment</th>
                  <th className="px-2 py-2 text-start font-medium">Engagement</th>
                  <th className="px-2 py-2 text-start font-medium">Questions</th>
                </tr>
              </thead>
              <tbody>
                {data.signals.map((row) => (
                  <tr key={row.key} className="border-b border-border/60">
                    <td className="px-2 py-2 text-foreground">{ar ? row.labelAr : row.labelEn}</td>
                    <td className="px-2 py-2">{row.volume}</td>
                    <td
                      className={cn(
                        "px-2 py-2",
                        row.sentiment < 0 ? "text-destructive" : "text-foreground",
                      )}
                    >
                      {row.sentiment > 0
                        ? `+${Math.round(row.sentiment * 100)}`
                        : Math.round(row.sentiment * 100)}
                    </td>
                    <td className="px-2 py-2">—</td>
                    <td className="px-2 py-2">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-foreground">Emerging Topics</p>
            <div className="flex flex-wrap gap-2">
              {data.emergingTopics.map((t) => (
                <Chip key={t.en} tone="outline">
                  {ar ? t.ar : t.en}
                </Chip>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Prototype Data Sources" subtitle="مصادر البيانات في مرحلة التجريب">
        <div className="flex flex-wrap gap-2">
          {[data.sourceName, "Uploaded CSV / JSON", "OpenAI structured analysis"].map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 rounded border border-border px-2.5 py-1 text-[11.5px] text-muted-foreground"
            >
              <HugeIcon icon={RadioIcon} className="text-primary" size={12} />
              {s}
            </span>
          ))}
        </div>
        <p className="mt-4 rounded border border-primary/25 bg-primary/6 p-3 text-[12px] leading-relaxed text-foreground/80">
          {ar
            ? hasLiveData
              ? `هذه المؤشرات مستخرجة من ${data.recordCount} سجلاً في الملف المرفوع. مخرجات الذكاء الاصطناعي تحليلية ويجب مراجعتها بشرياً.`
              : "هذه بيانات توضيحية. ارفع ملفاً من الإعدادات لتشغيل التحليل الفعلي."
            : hasLiveData
              ? `These indicators were derived from ${data.recordCount} uploaded records. AI outputs are analytical and require human review.`
              : "This is illustrative data. Upload a file in Settings to run live analysis."}
        </p>
      </Panel>

      <Panel
        title="Behavioural Segmentation"
        subtitle="Synthetic Behavioral Segments — Prototype"
        footnote="Synthetic Behavioral Segments — Prototype"
      >
        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {data.segments.map((s) => (
              <button
                key={s.id}
                onClick={() => setSegmentId(s.id)}
                className={cn(
                  "rounded-md border p-4 text-start transition-colors",
                  s.id === selected.id
                    ? "border-primary bg-primary/6"
                    : "border-border hover:bg-muted/60",
                )}
              >
                <p className="text-sm font-semibold text-foreground">{ar ? s.nameAr : s.name}</p>
                <p className="text-[11px] text-muted-foreground">{ar ? s.name : s.nameAr}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {ar ? "الحصة التقديرية" : "Estimated share"}: {s.share}%
                </p>
                <div className="mt-3 space-y-2">
                  <MetricBar label="نزعة المشاركة" value={levelValue[s.sharingTendency]} />
                  <MetricBar label="نزعة التحقق" value={levelValue[s.verificationTendency]} />
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-md border border-border bg-muted/40 p-5">
            <p className="text-sm font-semibold text-foreground">
              {ar ? selected.nameAr : selected.name}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {ar ? selected.name : selected.nameAr}
            </p>
            <dl className="mt-4 space-y-3 text-[12.5px]">
              <div>
                <dt className="text-muted-foreground">Behavioural Profile</dt>
                <dd className="text-foreground/85">
                  {ar ? selected.profileAr : (selected.profileEn ?? selected.profileAr)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Primary Motivation</dt>
                <dd className="text-foreground/85">
                  {ar ? selected.motivationAr : (selected.motivationEn ?? selected.motivationAr)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Barriers</dt>
                <dd className="text-foreground/85">
                  {(ar ? selected.barriersAr : (selected.barriersEn ?? selected.barriersAr)).join(
                    " · ",
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Communication Preference</dt>
                <dd className="text-foreground/85">
                  {ar
                    ? selected.communicationPreferenceAr
                    : (selected.communicationPreferenceEn ?? selected.communicationPreferenceAr)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Expected Response</dt>
                <dd className="text-foreground/85">
                  {ar
                    ? selected.expectedResponseAr
                    : (selected.expectedResponseEn ?? selected.expectedResponseAr)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Risk Factors</dt>
                <dd className="text-foreground/85">
                  {(ar
                    ? selected.riskFactorsAr
                    : (selected.riskFactorsEn ?? selected.riskFactorsAr)
                  ).join(" · ")}
                </dd>
              </div>
            </dl>
            <Button asChild className="mt-5 w-full">
              <Link href="/app/twin">الانتقال إلى التوأم الرقمي</Link>
            </Button>
          </div>
        </div>
      </Panel>
    </>
  );
}
