"use client";

import Link from "next/link";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Chip, KpiCard, Panel, SectionTitle } from "@/components/sgc/primitives";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/context/DemoContext";
import { useRequiredIntelligenceData } from "@/context/IntelligenceDataContext";
import { generatePrediction, simulateMessage } from "@/lib/simulation/engine";

const axis = { fontSize: 11, fill: "var(--color-muted-foreground)" };

export default function Prediction() {
  const { segmentId, messageId, scenarioId } = useDemo();
  const { data, hasLiveData } = useRequiredIntelligenceData();
  const result = simulateMessage(
    data.segments.find((item) => item.id === segmentId) ?? data.segments[0]!,
    data.messages.find((item) => item.id === messageId) ?? data.messages[0]!,
    data.scenarios.find((item) => item.id === scenarioId) ?? data.scenarios[0]!,
  );
  const prediction = generatePrediction(result);

  return (
    <>
      <SectionTitle
        title="الاستجابة المتوقعة للحملة"
        titleEn="Predicted Campaign Outcome"
        subtitle={
          hasLiveData
            ? "تقدير نموذجي مبني على البيانات المرفوعة"
            : "تنبؤ توضيحي على بيانات اصطناعية"
        }
        subtitleEn={
          hasLiveData
            ? "Model estimate based on uploaded data"
            : "Illustrative prediction using synthetic data"
        }
        right={<Chip tone="gold">{hasLiveData ? "AI DATA" : "Prototype Simulation"}</Chip>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="التفاعل المتوقع"
          labelEn="Expected Engagement"
          value={`${prediction.expectedEngagement}%`}
          note="Illustrative prediction"
        />
        <KpiCard
          label="نية التحقق المتوقعة"
          labelEn="Expected Verification Intent"
          value={`${prediction.expectedVerificationIntent}%`}
          note="Illustrative prediction"
        />
        <KpiCard
          label="ملاءمة الجمهور المتوقعة"
          labelEn="Expected Audience Fit"
          value={`${prediction.expectedAudienceFit}%`}
          note="Illustrative prediction"
        />
        <KpiCard
          label="المخاطرة الاتصالية"
          labelEn="Communication Risk"
          value={prediction.communicationRisk}
          note="Prototype estimate"
        />
      </div>

      <Panel
        title="منحنى التنبؤ"
        subtitle="Predicted verification intent over the campaign period"
        footnote="Demo Analytical Estimate — Prototype Simulation"
      >
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={prediction.curve}>
            <CartesianGrid stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="day" tick={axis} />
            <YAxis tick={axis} domain={[0, 100]} />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line
              type="monotone"
              dataKey="predicted"
              name="Predicted"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="baseline"
              name="Baseline"
              stroke="var(--color-chart-5)"
              strokeDasharray="4 4"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Prediction Confidence">
          <p className="text-lg font-semibold text-foreground">{prediction.confidence}</p>
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
            {hasLiveData
              ? "This estimate uses the uploaded dataset and AI-derived attributes. Predictive accuracy still requires validation against actual campaign outcomes."
              : "This prototype uses synthetic data and demonstration scoring. Real predictive accuracy requires historical campaign data and validation against actual audience outcomes."}
          </p>
        </Panel>
        <Panel title="What would improve the prediction?" subtitle="ما الذي يحسّن دقة التنبؤ؟">
          <ul className="grid gap-1.5 text-[12.5px] text-foreground/85 sm:grid-cols-2">
            <li>• Historical campaign data</li>
            <li>• Real audience research</li>
            <li>• Real engagement data</li>
            <li>• Social listening</li>
            <li>• Arabic NLP</li>
            <li>• Validated ML models</li>
          </ul>
          <Button asChild className="mt-5">
            <Link href="/app/decision">Human Decision</Link>
          </Button>
        </Panel>
      </div>
    </>
  );
}
