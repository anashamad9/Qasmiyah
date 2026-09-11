import type { Metadata } from "next";

import HumanDecision from "@/routes/app.decision";

export const metadata: Metadata = {
  title: "القرار البشري | SGC Digital Twin",
  description: "اعتماد أو تعديل أو رفض توصية الذكاء الاصطناعي مع تسجيل مبرر القرار في سجل التتبع.",
  openGraph: {
    title: "Human Decision — SGC Digital Twin",
    description: "الذكاء الاصطناعي يساعد، والإنسان يقرر: سجل قرارات كامل قابل للتتبع.",
  },
};

export default HumanDecision;
