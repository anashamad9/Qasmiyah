"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { BrandMark, Chip } from "@/components/sgc/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDemo } from "@/context/DemoContext";

export default function LoginPage() {
  const { signIn } = useDemo();
  const router = useRouter();
  const [email, setEmail] = useState("demo@sgc-dt.ai");
  const [password, setPassword] = useState("demo123");

  const enter = () => {
    signIn();
    router.push("/app");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8">
        <div className="flex flex-col items-center text-center">
          <BrandMark size={72} />
          <h1 className="mt-4 text-lg font-semibold text-foreground">توأم رقمي للاتصال الحكومي</h1>
          <p className="mt-1 text-[11.5px] text-muted-foreground">
            Sharjah Predictive Communication Decision Lab
          </p>
          <div className="mt-3">
            <Chip tone="gold">Demo Environment</Chip>
          </div>
        </div>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            enter();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={enter}>
            Enter Demo
          </Button>
        </form>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
          بيانات الدخول التجريبية: demo@sgc-dt.ai / demo123 — لا توجد مصادقة حقيقية في هذا النموذج
          الأولي.
        </p>
      </div>
    </div>
  );
}
