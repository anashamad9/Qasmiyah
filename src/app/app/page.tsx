import type { Metadata } from "next";

import Overview from "@/routes/app.index";

export const metadata: Metadata = {
  title: "لوحة القيادة التنفيذية | SGC Digital Twin",
  description: "مؤشرات تجريبية لحملة الاتصال: اتجاهات الجمهور، أداء الرسائل، ومقارنة السيناريوهات.",
  openGraph: {
    title: "Executive Dashboard — SGC Digital Twin",
    description: "مؤشرات ورسوم بيانية اصطناعية لعرض منهجية التوأم الرقمي.",
  },
};

export default Overview;
