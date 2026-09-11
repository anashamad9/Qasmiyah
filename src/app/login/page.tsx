import type { Metadata } from "next";

import LoginPage from "@/routes/login";

export const metadata: Metadata = {
  title: "تسجيل الدخول | الجامعة القاسمية — مختبر الاتصال التنبؤي",
  description: "بيئة عرض تجريبية للتوأم الرقمي للاتصال الحكومي — دخول ببيانات تجريبية.",
  openGraph: {
    title: "الجامعة القاسمية — الدخول إلى مختبر الاتصال التنبؤي",
    description: "بيئة عرض تجريبية للتوأم الرقمي للاتصال الحكومي.",
  },
};

export default LoginPage;
