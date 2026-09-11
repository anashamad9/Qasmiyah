"use client";

import { Chip, Panel, SectionTitle } from "@/components/sgc/primitives";

const privacy = [
  "Data minimization — تقليل البيانات",
  "Aggregation — التجميع",
  "Anonymization — إخفاء الهوية",
  "Authorized access — وصول مُصرّح",
  "API compliance — الالتزام بشروط الواجهات",
  "No individual profiling — لا تصنيف للأفراد",
  "Human oversight — إشراف بشري",
  "Audit trail — سجل تتبع",
];

const responsibleAi = [
  "Human-in-the-loop",
  "Explainable recommendations",
  "No automated sensitive decisions",
  "No individual psychological diagnosis",
  "No claims about real population behavior from synthetic data",
];

export default function Governance() {
  return (
    <>
      <SectionTitle
        title="حوكمة البيانات والذكاء الاصطناعي المسؤول"
        titleEn="Data Governance & Responsible AI"
        subtitle="مبادئ البيانات والخصوصية والإشراف البشري"
        subtitleEn="Data, privacy, and human oversight principles"
        right={<Chip tone="gold">SYNTHETIC</Chip>}
      />

      <Panel title="Data Classification" subtitle="تصنيف البيانات">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "REAL", note: "بيانات حقيقية — غير مستخدمة في النموذج الأولي" },
            { label: "DERIVED", note: "بيانات مشتقة — غير مستخدمة في النموذج الأولي" },
            { label: "SYNTHETIC", note: "التصنيف المطبق حالياً على كامل النموذج الأولي" },
          ].map((c) => (
            <div
              key={c.label}
              className={
                c.label === "SYNTHETIC"
                  ? "rounded-md border border-primary bg-primary/8 p-4"
                  : "rounded-md border border-border p-4"
              }
            >
              <p className="text-sm font-semibold text-foreground">{c.label}</p>
              <p className="mt-1 text-[11.5px] text-muted-foreground">{c.note}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Privacy Principles" subtitle="مبادئ الخصوصية">
          <ul className="space-y-1.5 text-[12.5px] text-foreground/85">
            {privacy.map((p) => (
              <li key={p}>• {p}</li>
            ))}
          </ul>
        </Panel>
        <Panel title="Responsible AI" subtitle="الذكاء الاصطناعي المسؤول">
          <ul className="space-y-1.5 text-[12.5px] text-foreground/85">
            {responsibleAi.map((p) => (
              <li key={p}>• {p}</li>
            ))}
          </ul>
          <p className="mt-4 rounded border border-border bg-muted/50 p-3 text-[11.5px] leading-relaxed text-muted-foreground">
            التوأم الرقمي ليس نسخة رقمية من المواطنين، ولا ملفاً نفسياً فردياً، ولا تنبؤاً بسلوك شخص
            محدد، ولا أداة مراقبة، ولا بديلاً عن أخصائيي الاتصال. هو نموذج سلوكي مجمّع لمحاكاة
            الاستجابة على مستوى الشرائح.
          </p>
        </Panel>
      </div>
    </>
  );
}
