import type { ReactNode } from "react";

import AppLayout from "@/routes/app";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
