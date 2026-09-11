"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  Eye,
  EyeOff,
  Info,
  LockKeyhole,
  Mail,
  MessageSquare,
  Play,
  SlidersHorizontal,
  TrendingUp,
  Users,
} from "lucide-react";

import { useDemo } from "@/context/DemoContext";
import s from "./login.module.css";

const capabilities = [
  { icon: BarChart3, ar: "افهم جمهورك", en: "Understand" },
  { icon: MessageSquare, ar: "اختبر رسالتك", en: "Simulate" },
  { icon: SlidersHorizontal, ar: "حسّن الأثر", en: "Optimize" },
  { icon: TrendingUp, ar: "استكشف النتائج", en: "Predict" },
  { icon: Check, ar: "قرّر بثقة", en: "Decide" },
];

export default function LoginPage() {
  const { signIn, language, setLanguage } = useDemo();
  const router = useRouter();
  const [email, setEmail] = useState("demo@sgc-dt.ai");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);
  const [entering, setEntering] = useState(false);
  const ar = language === "ar";
  const DirectionArrow = ar ? ArrowLeft : ArrowRight;

  const enter = () => {
    if (entering) return;
    setEntering(true);
    signIn();
    router.push("/app");
  };

  return (
    <main className={s["page"]}>
      <div className={s["backdrop"]} aria-hidden="true">
        <Image
          src="/login-digital-twin.webp"
          alt=""
          fill
          sizes="(max-width: 900px) 100vw, 66vw"
          preload
          className={s["artwork"]}
        />
        <div className={s["storyShade"]} />
      </div>
      <section className={s["story"]} dir={ar ? "rtl" : "ltr"} aria-labelledby="login-story-title">
        <header className={s["storyHeader"]}>
          <Link
            href="/"
            className={s["universityBrand"]}
            aria-label={ar ? "الجامعة القاسمية — الرئيسية" : "Al Qasimia University — home"}
          >
            <Image
              src="/شعار-الجامعة-القاسمية.png"
              alt=""
              width={57}
              height={57}
              className={s["brandSeal"]}
            />
            <span>
              {ar ? "الجامعة القاسمية" : "Al Qasimia University"}
              <small>AL QASIMIA UNIVERSITY</small>
            </span>
          </Link>
          <span className={s["researchLabel"]}>
            {ar ? "المعرفة تُلهم القرار" : "Knowledge inspires decisions"}
            <small>{ar ? "مساحة للبحث والابتكار" : "A space for research and innovation"}</small>
          </span>
        </header>
        <div className={s["storyCopy"]}>
          <p className={s["eyebrow"]}>
            {ar ? "مختبر الاتصال التنبؤي" : "PREDICTIVE COMMUNICATION LAB"}
          </p>
          <h1 id="login-story-title">
            {ar ? "التوأم الرقمي للاتصال الحكومي" : "Government Communication Digital Twin"}
          </h1>
          <p className={s["projectSubtitle"]} lang={ar ? "en" : "ar"}>
            {ar ? "Government Communication Digital Twin" : "التوأم الرقمي للاتصال الحكومي"}
          </p>
          <h2 className={s["tagline"]}>
            {ar ? "اختبر الرسالة قبل أن تطلقها." : "Test the message before it goes live."}
          </h2>
          <p className={s["storyDescription"]}>
            {ar
              ? "افهم جمهورك، حاكِ السيناريوهات، واستكشف أثر رسالتك. التوأم الرقمي للاتصال الحكومي يمنحك مساحة لاتخاذ قرار أكثر وعيًا."
              : "Understand your audience, simulate scenarios, and explore your message’s impact. The government communication digital twin creates space for more informed decisions."}
          </p>
        </div>
        <div className={s["sceneNotes"]}>
          <p className={s["sceneQuote"]}>
            {ar ? "فهم أعمق." : "Deeper understanding."}
            <br />
            <span>{ar ? "اتصال أكثر أثرًا." : "More meaningful communication."}</span>
          </p>
          <div
            className={s["signalCards"]}
            aria-label={ar ? "إمكانات المختبر" : "Lab capabilities"}
          >
            <div>
              <Users size={20} />
              <span>
                {ar ? "تحليل الجمهور" : "Audience analysis"}
                <small>Audience analysis</small>
              </span>
            </div>
            <div>
              <MessageSquare size={20} />
              <span>
                {ar ? "محاكاة الرسائل" : "Message simulation"}
                <small>Message simulation</small>
              </span>
            </div>
            <div>
              <TrendingUp size={20} />
              <span>
                {ar ? "توقّع النتائج" : "Predict outcomes"}
                <small>Predicted outcomes</small>
              </span>
            </div>
            <div>
              <Check size={20} />
              <span>
                {ar ? "دعم القرار" : "Decision support"}
                <small>Qasimyah ML Model</small>
              </span>
            </div>
          </div>
        </div>
        <footer className={s["storyFooter"]}>
          <div className={s["capabilities"]}>
            {capabilities.map(({ icon: Icon, ar: labelAr, en }) => (
              <div key={en}>
                <Icon size={22} strokeWidth={1.5} />
                <span>{ar ? labelAr : en}</span>
              </div>
            ))}
          </div>
          <div className={s["storyFootnote"]}>
            <span>
              {ar ? "الذكاء الاصطناعي يساعد، والإنسان يقرر." : "AI assists. People decide."}
            </span>
            <span>{ar ? "تصوّر فني للتوأم الرقمي" : "Conceptual digital twin illustration"}</span>
          </div>
        </footer>
      </section>
      <section className={s["formSide"]} dir={ar ? "rtl" : "ltr"} aria-labelledby="login-title">
        <div className={s["formCard"]}>
          <div className={s["cardTop"]}>
            <div
              className={s["languages"]}
              role="group"
              aria-label={ar ? "لغة الواجهة" : "Interface language"}
            >
              <button type="button" lang="ar" aria-pressed={ar} onClick={() => setLanguage("ar")}>
                العربية
              </button>
              <span aria-hidden="true" />
              <button type="button" lang="en" aria-pressed={!ar} onClick={() => setLanguage("en")}>
                EN
              </button>
            </div>
            <Link href="/" className={s["backLink"]}>
              {ar ? "الرئيسية" : "Home"}
              <DirectionArrow size={15} />
            </Link>
          </div>
          <div className={s["welcome"]}>
            <Image
              src="/شعار-الجامعة-القاسمية.png"
              alt={ar ? "شعار الجامعة القاسمية" : "Al Qasimia University seal"}
              width={108}
              height={108}
              className={s["formLogo"]}
            />
            <span className={s["demoBadge"]}>
              {ar ? "منصة تجريبية بحثية" : "RESEARCH DEMONSTRATION"}
            </span>
            <h2 id="login-title">{ar ? "مرحبًا بك" : "Welcome back"}</h2>
            <p>
              {ar
                ? "في مختبر التوأم الرقمي للاتصال الحكومي"
                : "To the government communication digital twin lab"}
            </p>
            <small>
              {ar
                ? "ابدأ رحلتك نحو اتصال أكثر وعيًا وتأثيرًا."
                : "Your next informed communication decision starts here."}
            </small>
          </div>
          <form
            className={s["form"]}
            onSubmit={(event) => {
              event.preventDefault();
              enter();
            }}
          >
            <div className={s["field"]}>
              <label htmlFor="email">{ar ? "البريد الإلكتروني" : "Email address"}</label>
              <div className={s["inputWrap"]}>
                <Mail size={19} className={s["fieldIcon"]} aria-hidden="true" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  dir="ltr"
                  value={email}
                  required
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>
            <div className={s["field"]}>
              <label htmlFor="password">{ar ? "كلمة المرور" : "Password"}</label>
              <div className={`${s["inputWrap"]} ${s["passwordWrap"]}`}>
                <LockKeyhole size={19} className={s["fieldIcon"]} aria-hidden="true" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  dir="ltr"
                  value={password}
                  required
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className={s["passwordToggle"]}
                  aria-label={
                    showPassword
                      ? ar
                        ? "إخفاء كلمة المرور"
                        : "Hide password"
                      : ar
                        ? "إظهار كلمة المرور"
                        : "Show password"
                  }
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <details className={s["credentials"]}>
              <summary>{ar ? "بيانات الدخول التجريبية" : "Demo sign-in details"}</summary>
              <p dir="ltr">demo@sgc-dt.ai / demo123</p>
              <p>
                {ar
                  ? "يمكنك أيضًا استخدام زر الدخول المباشر أدناه."
                  : "You can also use the direct demo button below."}
              </p>
            </details>
            <button type="submit" className={s["signIn"]} disabled={entering}>
              {entering ? (ar ? "جارٍ الدخول…" : "Entering…") : ar ? "تسجيل الدخول" : "Sign in"}
              <DirectionArrow size={19} />
            </button>
            <div className={s["divider"]}>
              <span />
              {ar ? "أو استكشف مباشرة" : "or explore directly"}
              <span />
            </div>
            <button type="button" className={s["demoButton"]} onClick={enter} disabled={entering}>
              <Play size={18} />
              <span>{ar ? "الدخول إلى النسخة التجريبية" : "Enter the demonstration"}</span>
            </button>
          </form>
          <div className={s["demoNotice"]}>
            <Info size={18} />
            <p>
              {ar
                ? "هذه بيئة عرض تجريبية دون مصادقة فعلية. استخدم بيانات الدخول التجريبية فقط، ولا تدخل كلمة مرور شخصية."
                : "This is a demonstration without real authentication. Use the demo details only, never a personal password."}
            </p>
          </div>
          <footer className={s["cardFooter"]}>
            <span>{ar ? "الجامعة القاسمية" : "Al Qasimia University"}</span>
            <span>Qasimyah ML Model</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
