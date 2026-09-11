import type { Metadata } from "next";

import MessageLab from "@/routes/app.messages";

export const metadata: Metadata = {
  title: "مختبر الرسائل | SGC Digital Twin",
  description: "اختبار أربع صياغات للرسالة الاتصالية ومقارنة الوضوح والملاءمة والمخاطرة تقديرياً.",
  openGraph: {
    title: "Message Lab — SGC Digital Twin",
    description: "مقارنة صياغات الرسالة وتقدير نية التحقق لدى الشريحة المختارة.",
  },
};

export default MessageLab;
