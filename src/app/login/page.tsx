import type { Metadata } from "next";

import LoginPage from "@/routes/login";

export const metadata: Metadata = {
  title: "تسجيل الدخول التجريبي | SGC Digital Twin",
  description: "بيئة عرض تجريبية للتوأم الرقمي للاتصال الحكومي — دخول ببيانات تجريبية.",
  openGraph: {
    title: "Demo Sign In — SGC Digital Twin",
    description: "بيئة عرض تجريبية للتوأم الرقمي للاتصال الحكومي.",
  },
};

export default LoginPage;
