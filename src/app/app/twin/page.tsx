import type { Metadata } from "next";

import DigitalTwin from "@/routes/app.twin";

export const metadata: Metadata = {
  title: "التوأم الرقمي للجمهور | SGC Digital Twin",
  description:
    "نموذج سلوكي مجمّع يمثل كيف قد تستجيب شرائح الجمهور للرسائل الاتصالية في سياقات محددة.",
  openGraph: {
    title: "Audience Digital Twin — Aggregated Behavioural Model",
    description: "سمات سلوكية مجمّعة وسياق ورسالة وسيناريو تُنتج استجابة متوقعة تقديرية.",
  },
};

export default DigitalTwin;
