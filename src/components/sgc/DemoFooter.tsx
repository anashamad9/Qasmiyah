"use client";

import { useDemo } from "@/context/DemoContext";
import { useIntelligenceData } from "@/context/IntelligenceDataContext";

export function DemoFooter() {
  const { language } = useDemo();
  const { data, hasLiveData } = useIntelligenceData();
  const isArabic = language === "ar";

  return (
    <footer className="border-t border-border bg-card/60 px-6 py-5">
      <p className="mx-auto max-w-4xl text-center text-[11.5px] leading-relaxed text-muted-foreground">
        {hasLiveData && data
          ? isArabic
            ? `تعرض هذه الجلسة تحليلاً بواسطة OpenAI لـ ${data.recordCount} سجلاً من «${data.sourceName}». النتائج مؤشرات وتوصيات مولّدة آلياً وليست حقائق أو تنبؤات مُثبتة، ويجب مراجعتها بشرياً قبل اتخاذ القرار.`
            : `This session shows OpenAI analysis of ${data.recordCount} records from “${data.sourceName}”. Results are AI-generated indicators and recommendations, not verified facts or validated predictions, and require human review before decisions.`
          : isArabic
            ? "لم يتم رفع أو تحليل أي مجموعة بيانات بعد. لن يعرض النظام مؤشرات أو توصيات حتى يتم تفعيل بيانات من صفحة الإعدادات."
            : "No dataset has been uploaded or analyzed. The system will not display indicators or recommendations until data is activated from Settings."}
      </p>
      <p className="mt-2 text-center text-[10.5px] tracking-wide text-muted-foreground/80 uppercase">
        {hasLiveData && data
          ? isArabic
            ? "بيانات مرفوعة | تحليل بمساعدة الذكاء الاصطناعي"
            : "Uploaded Data | AI-Assisted Analysis"
          : isArabic
            ? "لا توجد بيانات"
            : "No Data"}
      </p>
    </footer>
  );
}
