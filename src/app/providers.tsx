"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { DemoProvider } from "@/context/DemoContext";
import { IntelligenceDataProvider } from "@/context/IntelligenceDataContext";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <DemoProvider>
        <IntelligenceDataProvider>
          <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
        </IntelligenceDataProvider>
      </DemoProvider>
    </QueryClientProvider>
  );
}
