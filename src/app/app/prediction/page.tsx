import type { Metadata } from "next";

import Prediction from "@/routes/app.prediction";

export const metadata: Metadata = {
  title: "الاستجابة المتوقعة للحملة | SGC Digital Twin",
  description: "تنبؤ توضيحي بالتفاعل ونية التحقق والمخاطرة الاتصالية بناءً على بيانات اصطناعية.",
  openGraph: {
    title: "Predicted Campaign Outcome — SGC Digital Twin",
    description: "تنبؤ توضيحي على بيانات اصطناعية، مع شرح ما يحتاجه التنبؤ الحقيقي.",
  },
};

export default Prediction;
