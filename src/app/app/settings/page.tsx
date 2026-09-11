import type { Metadata } from "next";

import SettingsPage from "@/routes/app.settings";

export const metadata: Metadata = {
  title: "الإعدادات | SGC Digital Twin",
  description: "إعدادات بيئة العرض التجريبية: بيانات المحاكاة، وضع الذكاء، وإعادة تعيين الجلسة.",
  openGraph: {
    title: "Settings — SGC Digital Twin",
    description: "إدارة بيئة العرض التجريبية وإعادة تعيين مسار المحاكاة.",
  },
};

export default SettingsPage;
