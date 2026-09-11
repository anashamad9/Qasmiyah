import type { Metadata } from "next";

import ScenarioSimulator from "@/routes/app.simulator";

export const metadata: Metadata = {
  title: "محاكي السيناريوهات | SGC Digital Twin",
  description: "مقارنة ثلاثة سيناريوهات اتصالية لنفس الرسالة عبر مؤشرات تقديرية في بيئة محاكاة.",
  openGraph: {
    title: "Scenario Simulator — SGC Digital Twin",
    description: "منشور رسمي، فيديو اجتماعي قصير، أو رسالة عبر صانع محتوى: أي سيناريو أفضل؟",
  },
};

export default ScenarioSimulator;
