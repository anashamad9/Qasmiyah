"use client";

import { Chip, KpiCard, Panel, SectionTitle } from "@/components/sgc/primitives";
import { useDemo } from "@/context/DemoContext";
import { useRequiredIntelligenceData } from "@/context/IntelligenceDataContext";

export default function Learning() {
  const { language } = useDemo();
  const { data } = useRequiredIntelligenceData();
  const ar = language === "ar";

  return (
    <>
      <SectionTitle
        title="التنبؤ مقابل النتيجة الفعلية"
        titleEn="Prediction vs Actual"
        subtitle="لا تُعرض نتائج فعلية ما لم تتوفر بيانات ما بعد الحملة"
        subtitleEn="Actual results require post-campaign outcome data"
        right={<Chip tone="gold">AI DATA</Chip>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="السجلات المحللة"
          labelEn="Analyzed Records"
          value={String(data.recordCount)}
        />
        <KpiCard label="ثقة التحليل" labelEn="Analysis Confidence" value={`${data.confidence}%`} />
        <KpiCard
          label="النتيجة الفعلية"
          labelEn="Actual Result"
          value={ar ? "غير متاحة" : "Not available"}
        />
      </div>

      <Panel title="متطلبات المعايرة" titleEn="Calibration requirement">
        <p className="text-[12.5px] leading-relaxed text-foreground/85">
          {ar
            ? "لا يخترع النظام نتيجة فعلية. لإجراء المعايرة، ارفع بعد انتهاء الحملة ملف أداء يتضمن مرات الظهور والتفاعل والنقرات والمشاركات وإجراءات التحقق الفعلية، ثم أعد التحليل."
            : "The system does not invent an actual result. After the campaign, upload a performance file containing impressions, engagements, clicks, shares, and observed verification actions, then run the analysis again."}
        </p>
      </Panel>
    </>
  );
}
