import type { Metadata } from "next";

import KnowledgeBase from "@/routes/app.knowledge";

export const metadata: Metadata = {
  title: "قاعدة المعرفة | SGC Digital Twin",
  description: "سجل توضيحي للحملة والشريحة والرسالة والسيناريو والتوصية والقرار والدروس المستفادة.",
  openGraph: {
    title: "Knowledge Base — SGC Digital Twin",
    description: "معرفة توضيحية متراكمة من دورات المحاكاة التجريبية.",
  },
};

export default KnowledgeBase;
