import type { Metadata } from "next";

import Governance from "@/routes/app.governance";

export const metadata: Metadata = {
  title: "حوكمة البيانات والذكاء الاصطناعي المسؤول | SGC Digital Twin",
  description: "تصنيف البيانات ومبادئ الخصوصية والذكاء الاصطناعي المسؤول في النموذج الأولي.",
  openGraph: {
    title: "Data Governance & Responsible AI — SGC Digital Twin",
    description: "بيانات مجمّعة، إشراف بشري، وسجل تتبع: لا تصنيف للأفراد ولا مراقبة.",
  },
};

export default Governance;
