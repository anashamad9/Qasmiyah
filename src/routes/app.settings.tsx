"use client";

import { Chip, Panel, SectionTitle } from "@/components/sgc/primitives";
import { DataUploadPanel } from "@/components/sgc/DataUploadPanel";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useDemo } from "@/context/DemoContext";

const INTELLIGENCE_MODE = "Qasimyah ML Model";

export default function SettingsPage() {
  const { campaign, setCampaign, reset, language } = useDemo();
  const ar = language === "ar";

  return (
    <>
      <SectionTitle
        title="الإعدادات"
        titleEn="Settings"
        subtitle="إدارة مصدر البيانات والتحليل"
        subtitleEn="Manage data sources and analysis"
        right={<Chip tone="outline">AI DATA</Chip>}
      />

      <DataUploadPanel />

      <Panel title="نوع البيانات" titleEn="Data type">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-foreground">{ar ? "بيانات اصطناعية" : "Synthetic data"}</p>
            <p className="text-[11.5px] text-muted-foreground">
              {ar
                ? "فعّل هذا الخيار عند رفع بيانات مولّدة للاختبار."
                : "Enable this when uploading generated test data."}
            </p>
          </div>
          <Switch
            checked={campaign.useSyntheticData}
            onCheckedChange={(v) => setCampaign({ ...campaign, useSyntheticData: v })}
          />
        </div>
      </Panel>

      <Panel title="محرك الذكاء" titleEn="Intelligence engine">
        <p className="text-[12.5px] text-muted-foreground">
          {ar ? "وضع التحليل:" : "Intelligence mode:"}{" "}
          <span className="font-medium text-foreground" dir="ltr">
            {INTELLIGENCE_MODE}
          </span>{" "}
          —{" "}
          {ar
            ? "لا يوجد محرك بيانات بديل؛ يجب رفع البيانات وإكمال تحليل OpenAI لتشغيل النظام."
            : "There is no fallback data engine; an upload and completed OpenAI analysis are required to use the system."}
        </p>
      </Panel>

      <Panel title="إعادة تعيين العرض" titleEn="Reset application state">
        <p className="text-[12.5px] text-muted-foreground">
          {ar
            ? "يمسح اختيارات الجلسة والقرارات، ولا ينشئ أي بيانات بديلة."
            : "Clears session selections and decisions without creating replacement data."}
        </p>
        <Button variant="outline" className="mt-4" onClick={reset}>
          {ar ? "إعادة تعيين الحالة" : "Reset application state"}
        </Button>
      </Panel>
    </>
  );
}
