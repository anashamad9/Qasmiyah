import type { Metadata } from "next";

import Learning from "@/routes/app.learning";

export const metadata: Metadata = {
  title: "التنبؤ مقابل النتيجة الفعلية | SGC Digital Twin",
  description: "مقارنة القيم المتنبأ بها بالنتائج الفعلية التوضيحية ومعايرة النموذج للتحسين.",
  openGraph: {
    title: "Prediction vs Actual — SGC Digital Twin",
    description: "حلقة التعلّم: تنبؤ، نتيجة، تحليل خطأ، معايرة، محاكاة أفضل.",
  },
};

export default Learning;
