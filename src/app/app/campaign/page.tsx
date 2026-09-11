import type { Metadata } from "next";

import CampaignSetup from "@/routes/app.campaign";

export const metadata: Metadata = {
  title: "إعداد الحملة | SGC Digital Twin",
  description: "تهيئة حملة اتصالية تجريبية وتشغيل محاكاة التوأم الرقمي على بيانات اصطناعية.",
  openGraph: {
    title: "Campaign Setup — SGC Digital Twin",
    description: "تهيئة الحملة والقنوات والمدة قبل تشغيل المحاكاة التجريبية.",
  },
};

export default CampaignSetup;
