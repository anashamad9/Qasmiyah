"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { FlowChain, KpiCard, Panel, SectionTitle } from "@/components/sgc/primitives";
import { useDemo } from "@/context/DemoContext";
import { useRequiredIntelligenceData } from "@/context/IntelligenceDataContext";
import { compareScenarios } from "@/lib/simulation/engine";

const axis = { fontSize: 11, fill: "var(--color-muted-foreground)" };

export default function Overview() {
  const { segmentId, messageId, language } = useDemo();
  const { data, hasLiveData } = useRequiredIntelligenceData();
  const isArabic = language === "ar";
  const segment = data.segments.find((item) => item.id === segmentId) ?? data.segments[0]!;
  const message = data.messages.find((item) => item.id === messageId) ?? data.messages[0]!;
  const results = compareScenarios(segment, message, data.scenarios);
  const dashboardKpis = [
    { labelAr: "السجلات المحللة", labelEn: "Analyzed Records", value: String(data.recordCount) },
    { labelAr: "شرائح الجمهور", labelEn: "Audience Segments", value: String(data.segments.length) },
    { labelAr: "رسائل مُختبرة", labelEn: "Messages Tested", value: String(data.messages.length) },
    {
      labelAr: "سيناريوهات محاكاة",
      labelEn: "Scenarios Simulated",
      value: String(data.scenarios.length),
    },
    {
      labelAr: "توصيات الذكاء الاصطناعي",
      labelEn: "AI Recommendations",
      value: hasLiveData ? "1" : "0",
    },
    {
      labelAr: "ثقة التحليل",
      labelEn: "Analysis Confidence",
      value: hasLiveData ? `${data.confidence}%` : "Sample",
    },
  ];
  const scenarioKeys = {
    fit: isArabic ? "ملاءمة" : "Audience Fit",
    interaction: isArabic ? "تفاعل" : "Interaction",
    risk: isArabic ? "مخاطرة" : "Risk",
  };
  const messageKeys = {
    clarity: isArabic ? "وضوح" : "Clarity",
    fit: isArabic ? "ملاءمة" : "Audience Fit",
    verification: isArabic ? "نية تحقق" : "Verification Intent",
  };
  const verificationKey = isArabic ? "نية التحقق" : "Verification Intent";

  const scenarioData = results.map((r, i) => ({
    name: isArabic
      ? (data.scenarios[i]?.nameAr ?? `سيناريو ${i + 1}`)
      : (data.scenarios[i]?.name ?? `Scenario ${i + 1}`),
    [scenarioKeys.fit]: r.audienceFit,
    [scenarioKeys.interaction]: r.interaction,
    [scenarioKeys.risk]: r.risk,
  }));

  const messageData = data.messages.map((m) => ({
    name: m.label,
    [messageKeys.clarity]: m.clarity,
    [messageKeys.fit]: m.audienceFit,
    [messageKeys.verification]: m.verificationIntent,
  }));

  const verificationBySegment = data.segments.map((s) => ({
    name: isArabic ? s.nameAr : s.name,
    [verificationKey]: compareScenarios(s, message, data.scenarios)[1]?.verificationIntent ?? 0,
  }));
  const trendData = data.trends.map((point) => ({
    ...point,
    week: isArabic ? point.week : (point.weekEn ?? point.week),
  }));

  return (
    <>
      <SectionTitle
        title="نظرة عامة"
        titleEn="Overview"
        subtitle="لوحة تنفيذية لبيئة المحاكاة التجريبية"
        subtitleEn="Executive Overview — Prototype Simulation Environment"
      />

      <div className="rounded-xl border-s-2 border-primary bg-card px-4 py-3 text-xs text-foreground/80">
        <span className="font-semibold text-foreground">
          {hasLiveData
            ? isArabic
              ? "بيانات محللة فعلياً"
              : "Live analyzed data"
            : isArabic
              ? "بيانات توضيحية"
              : "Illustrative data"}
        </span>
        {" · "}
        {isArabic ? data.summary.ar : data.summary.en}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {dashboardKpis.map((k) => (
          <KpiCard key={k.labelEn} label={k.labelAr} labelEn={k.labelEn} value={k.value} />
        ))}
      </div>

      <Panel
        title="مسار العمل"
        titleEn="Workflow"
        subtitle="قبل الإطلاق ← فهم ← محاكاة ← تحسين ← تنبؤ ← قرار ← تعلّم"
        subtitleEn="Before Launch → Understand → Simulate → Optimize → Predict → Decide → Learn"
      >
        <div className="overflow-x-auto pb-1">
          <FlowChain
            dense
            steps={
              isArabic
                ? ["فهم", "محاكاة", "تحسين", "تنبؤ", "قرار", "تعلّم"]
                : ["Understand", "Simulate", "Optimize", "Predict", "Decide", "Learn"]
            }
          />
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel
          title="اتجاهات موضوعات الجمهور"
          titleEn="Audience Topic Trends"
          subtitle="إشارات الجمهور خلال 6 أسابيع"
          subtitleEn="Six-week audience signal movement"
          footnote="Demo Analytical Estimate"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
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
                fillOpacity={0.18}
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
                dataKey="trust"
                stroke="var(--color-chart-3)"
                fill="var(--color-chart-3)"
                fillOpacity={0.12}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel
          title="أداء الرسائل"
          titleEn="Message Performance"
          subtitle="أداء الرسائل المُختبرة"
          subtitleEn="Performance of tested messages"
          footnote="Demo Analytical Estimate"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={messageData}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" tick={axis} />
              <YAxis tick={axis} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey={messageKeys.clarity} fill="var(--color-chart-1)" radius={2} />
              <Bar dataKey={messageKeys.fit} fill="var(--color-chart-2)" radius={2} />
              <Bar dataKey={messageKeys.verification} fill="var(--color-chart-3)" radius={2} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel
          title="مقارنة السيناريوهات"
          titleEn="Scenario Comparison"
          subtitle="مقارنة السيناريوهات للرسالة المختارة"
          subtitleEn="Scenario comparison for the selected message"
          footnote="Demo Analytical Estimate"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={scenarioData}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" tick={axis} />
              <YAxis tick={axis} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey={scenarioKeys.fit} fill="var(--color-chart-1)" radius={2} />
              <Bar dataKey={scenarioKeys.interaction} fill="var(--color-chart-4)" radius={2} />
              <Bar dataKey={scenarioKeys.risk} fill="var(--color-destructive)" radius={2} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel
          title="نية التحقق المتوقعة"
          titleEn="Predicted Verification Intent"
          subtitle="نية التحقق المتوقعة حسب الشريحة (سيناريو الفيديو القصير)"
          subtitleEn="Predicted verification intent by segment (short-video scenario)"
          footnote="Demo Analytical Estimate"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={verificationBySegment}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" tick={axis} />
              <YAxis tick={axis} domain={[0, 100]} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey={verificationKey}
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </>
  );
}
