"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AiBrain01Icon,
  AiLearningIcon,
  AiSparklesIcon,
  BeakerIcon,
  BookOpen01Icon,
  ChartRadarIcon,
  Database01Icon,
  FileUploadIcon,
  GaugeIcon,
  LayoutDashboardIcon,
  Menu01Icon,
  MicroscopeIcon,
  SecurityCheckIcon,
  Settings01Icon,
  Target02Icon,
  TranslateIcon,
  UserCheck01Icon,
  XIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type { ReactNode } from "react";
import { useState } from "react";

import { DemoFooter } from "@/components/sgc/DemoFooter";
import { HugeIcon } from "@/components/sgc/HugeIcon";
import { PageModelRunner } from "@/components/sgc/PageModelRunner";
import { BrandMark, Chip } from "@/components/sgc/primitives";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/context/DemoContext";
import { useIntelligenceData } from "@/context/IntelligenceDataContext";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/app", labelAr: "نظرة عامة", labelEn: "Overview", icon: LayoutDashboardIcon },
  { to: "/app/campaign", labelAr: "إعداد الحملة", labelEn: "Campaign Setup", icon: Target02Icon },
  {
    to: "/app/audience",
    labelAr: "ذكاء الجمهور",
    labelEn: "Audience Intelligence",
    icon: ChartRadarIcon,
  },
  { to: "/app/twin", labelAr: "التوأم الرقمي", labelEn: "Digital Twin", icon: AiBrain01Icon },
  { to: "/app/messages", labelAr: "مختبر الرسائل", labelEn: "Message Lab", icon: BeakerIcon },
  {
    to: "/app/simulator",
    labelAr: "محاكي السيناريوهات",
    labelEn: "Scenario Simulator",
    icon: MicroscopeIcon,
  },
  {
    to: "/app/optimization",
    labelAr: "تحسين بالذكاء",
    labelEn: "AI Optimization",
    icon: AiSparklesIcon,
  },
  { to: "/app/prediction", labelAr: "التنبؤ", labelEn: "Prediction", icon: GaugeIcon },
  {
    to: "/app/decision",
    labelAr: "القرار البشري",
    labelEn: "Human Decision",
    icon: UserCheck01Icon,
  },
  { to: "/app/learning", labelAr: "التعلّم", labelEn: "Learning", icon: AiLearningIcon },
  {
    to: "/app/knowledge",
    labelAr: "قاعدة المعرفة",
    labelEn: "Knowledge Base",
    icon: BookOpen01Icon,
  },
  {
    to: "/app/governance",
    labelAr: "حوكمة البيانات",
    labelEn: "Data Governance",
    icon: SecurityCheckIcon,
  },
  { to: "/app/settings", labelAr: "الإعدادات", labelEn: "Settings", icon: Settings01Icon },
] satisfies { to: string; labelAr: string; labelEn: string; icon: IconSvgElement }[];

export default function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { language, toggleLanguage } = useDemo();
  const { data, hasLiveData, ready } = useIntelligenceData();
  const isArabic = language === "ar";
  const dataRequired = pathname !== "/app/settings" && !hasLiveData;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {open ? (
          <button
            aria-label="إغلاق القائمة"
            className="fixed inset-0 z-30 bg-foreground/30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <aside
          className={cn(
            "fixed inset-y-0 z-40 h-screen w-64 shrink-0 overflow-y-auto border-e border-sidebar-border bg-sidebar transition-transform lg:sticky lg:top-0 lg:translate-x-0",
            open ? "translate-x-0" : "translate-x-full lg:translate-x-0",
          )}
        >
          <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4">
            <BrandMark size={38} />
            <div className="leading-tight">
              <p className="text-[12.5px] font-semibold text-sidebar-foreground">
                SGC Digital Twin
              </p>
              <p className="text-[10.5px] text-muted-foreground">Decision Lab</p>
            </div>
            <button className="ms-auto lg:hidden" aria-label="إغلاق" onClick={() => setOpen(false)}>
              <HugeIcon icon={XIcon} className="text-muted-foreground" size={16} />
            </button>
          </div>
          <nav className="p-2">
            {nav.map((item) => {
              const active =
                item.to === "/app" ? pathname === item.to : pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  href={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent",
                    active && "bg-sidebar-accent font-semibold text-sidebar-accent-foreground",
                  )}
                >
                  <HugeIcon icon={item.icon} className="text-primary" size={17} />
                  <span className="flex-1">{isArabic ? item.labelAr : item.labelEn}</span>
                  <span className="text-[9.5px] text-muted-foreground/70">
                    {isArabic ? item.labelEn : item.labelAr}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 md:px-6">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="القائمة"
                onClick={() => setOpen(true)}
              >
                <HugeIcon icon={Menu01Icon} size={18} />
              </Button>
              <div className="leading-tight">
                <p className="text-[12.5px] text-muted-foreground">
                  {isArabic ? "المشروع" : "Project"}
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {data?.sourceName ?? (isArabic ? "لم يتم رفع بيانات" : "No data uploaded")}
                </p>
              </div>
              <div className="ms-auto flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 px-2.5 text-[11px]"
                  onClick={toggleLanguage}
                >
                  <HugeIcon icon={TranslateIcon} size={14} />
                  {isArabic ? "English" : "العربية"}
                </Button>
                <Chip tone="outline">
                  {hasLiveData
                    ? isArabic
                      ? "تحليل OpenAI"
                      : "OpenAI Analysis"
                    : isArabic
                      ? "يلزم رفع البيانات"
                      : "Upload Required"}
                </Chip>
                <Chip tone="gold">
                  {hasLiveData
                    ? isArabic
                      ? "بيانات مرفوعة"
                      : "Uploaded Data"
                    : isArabic
                      ? "لا توجد بيانات"
                      : "No Data"}
                </Chip>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 space-y-6 p-4 md:p-6">
            {!ready ? (
              <div className="flex min-h-[55vh] items-center justify-center">
                <div className="size-7 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
              </div>
            ) : dataRequired ? (
              <div className="flex min-h-[55vh] items-center justify-center">
                <section className="w-full max-w-xl border border-border bg-card p-8 text-center">
                  <HugeIcon icon={Database01Icon} className="mx-auto text-primary" size={34} />
                  <h1 className="mt-4 text-xl font-semibold text-foreground">
                    {isArabic ? "يلزم رفع البيانات أولاً" : "Upload data to continue"}
                  </h1>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {isArabic
                      ? "لا يحتوي النظام على بيانات افتراضية. ارفع ملف CSV أو JSON وحلله لتفعيل لوحات المعلومات والمحاكاة والتوصيات."
                      : "The system contains no default dataset. Upload and analyze a CSV or JSON file to activate dashboards, simulations, and recommendations."}
                  </p>
                  <Button asChild className="mt-5">
                    <Link href="/app/settings">
                      <HugeIcon icon={FileUploadIcon} size={17} />
                      {isArabic ? "الانتقال إلى رفع البيانات" : "Go to data upload"}
                    </Link>
                  </Button>
                </section>
              </div>
            ) : (
              <>
                <PageModelRunner />
                {children}
              </>
            )}
          </main>

          <DemoFooter />
        </div>
      </div>
    </div>
  );
}
