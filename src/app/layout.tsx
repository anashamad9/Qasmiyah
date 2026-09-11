import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/styles.css";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "مختبر الاتصال التنبؤي | الجامعة القاسمية",
  description: "مختبر تنبؤي لتحليل بيانات الجمهور واختبار الرسائل الاتصالية قبل إطلاق الحملة.",
  authors: [{ name: "الجامعة القاسمية | Al Qasimia University" }],
  openGraph: {
    type: "website",
    title: "مختبر الاتصال التنبؤي — الجامعة القاسمية",
    description:
      "اختبر الرسالة قبل أن تطلقها: تحليل بيانات الجمهور، تحسين الرسائل، وتنبؤ بالاستجابة.",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
