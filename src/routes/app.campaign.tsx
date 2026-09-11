"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProcessingOverlay } from "@/components/sgc/ProcessingOverlay";
import { Chip, Panel, SectionTitle } from "@/components/sgc/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useDemo } from "@/context/DemoContext";
import { useRequiredIntelligenceData } from "@/context/IntelligenceDataContext";
import { availableChannels } from "@/data/campaigns";
import { cn } from "@/lib/utils";

export default function CampaignSetup() {
  const { campaign, setCampaign, language } = useDemo();
  const { data, hasLiveData } = useRequiredIntelligenceData();
  const ar = language === "ar";
  const [draft, setDraft] = useState(campaign);
  const [running, setRunning] = useState(false);
  const router = useRouter();

  const toggleChannel = (channel: string) =>
    setDraft((d) => ({
      ...d,
      channels: d.channels.includes(channel)
        ? d.channels.filter((c) => c !== channel)
        : [...d.channels, channel],
    }));

  return (
    <>
      <SectionTitle
        title="إعداد الحملة"
        titleEn="Campaign Setup"
        subtitle="تهيئة معايير الحملة قبل تشغيل المحاكاة"
        subtitleEn="Configure campaign parameters before running the simulation"
        right={<Chip tone="gold">AI DATA</Chip>}
      />

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="بيانات الحملة" className="xl:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Campaign Name</Label>
              <Input
                dir="ltr"
                value={draft.nameEn}
                onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>اسم الحملة بالعربية</Label>
              <Input
                value={draft.nameAr}
                onChange={(e) => setDraft({ ...draft, nameAr: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>Objective</Label>
              <Textarea
                dir="ltr"
                rows={2}
                value={draft.objectiveEn}
                onChange={(e) => setDraft({ ...draft, objectiveEn: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>الهدف الاتصالي</Label>
              <Textarea
                rows={2}
                value={draft.objectiveAr}
                onChange={(e) => setDraft({ ...draft, objectiveAr: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Target Audience</Label>
              <Input
                dir="ltr"
                value={draft.audience}
                onChange={(e) => setDraft({ ...draft, audience: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Topic</Label>
              <Input
                dir="ltr"
                value={draft.topic}
                onChange={(e) => setDraft({ ...draft, topic: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Campaign Duration (days)</Label>
              <Input
                dir="ltr"
                type="number"
                value={draft.durationDays}
                onChange={(e) => setDraft({ ...draft, durationDays: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Proposed Launch</Label>
              <Input
                dir="ltr"
                value={draft.launchDate}
                onChange={(e) => setDraft({ ...draft, launchDate: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-5">
            <Label className="mb-2 block">Channels</Label>
            <div className="flex flex-wrap gap-2">
              {availableChannels.map((c) => {
                const active = draft.channels.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleChannel(c)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition-colors",
                      active
                        ? "border-primary bg-primary/12 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="بيانات التحليل" titleEn="Analysis data">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-foreground">
                  {ar ? "بيانات اصطناعية" : "Synthetic data"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {hasLiveData
                    ? `${ar ? "المصدر" : "Source"}: ${data.sourceName} (${data.recordCount})`
                    : ar
                      ? "لا توجد بيانات مرفوعة؛ يستخدم النظام العينة المدمجة."
                      : "No uploaded data; the built-in sample is active."}
                </p>
              </div>
              <Switch
                checked={draft.useSyntheticData}
                onCheckedChange={(v) => setDraft({ ...draft, useSyntheticData: v })}
              />
            </div>
          </Panel>

          <Panel title="تشغيل التوأم الرقمي">
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              {hasLiveData
                ? ar
                  ? "سيستخدم النظام الشرائح والرسائل والسيناريوهات المستخرجة من تحليل OpenAI للبيانات المرفوعة."
                  : "The system will use the segments, messages, and scenarios derived from the OpenAI analysis of your uploaded data."
                : ar
                  ? "ارفع ملف بيانات من الإعدادات لتشغيل تحليل OpenAI، أو تابع بالعينة التوضيحية."
                  : "Upload data in Settings to run OpenAI analysis, or continue with the illustrative sample."}
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() => {
                setCampaign(draft);
                setRunning(true);
              }}
            >
              {ar ? "تشغيل التوأم الرقمي" : "Run Digital Twin Simulation"}
            </Button>
          </Panel>
        </div>
      </div>

      {running ? (
        <ProcessingOverlay
          steps={[
            "Analyzing audience signals...",
            "Building behavioural segments...",
            "Testing communication scenarios...",
          ]}
          onDone={() => router.push("/app/audience")}
        />
      ) : null}
    </>
  );
}
