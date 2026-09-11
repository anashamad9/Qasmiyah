import type { Metadata } from "next";

import AudienceIntelligence from "@/routes/app.audience";

export const metadata: Metadata = {
  title: "ذكاء الجمهور | SGC Digital Twin",
  description:
    "إشارات الجمهور واتجاهات الموضوعات والشرائح السلوكية الاصطناعية قبل إطلاق الحملة الاتصالية.",
  openGraph: {
    title: "Audience Intelligence — SGC Digital Twin",
    description: "فهم بيئة الاتصال: إشارات، اتجاهات، مخاوف الجمهور، ومصادر بيانات النموذج الأولي.",
  },
};

export default AudienceIntelligence;
