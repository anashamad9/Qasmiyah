"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpLeft,
  ArrowDown,
  AudioLines,
  Check,
  ChevronDown,
  Fingerprint,
  FlaskConical,
  Layers3,
  Menu,
  MessageSquareText,
  MoveUpLeft,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import s from "./landing.module.css";

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(0);
  const capabilities = [
    {
      icon: Users,
      title: "افهم من تخاطب",
      text: "حوّل البيانات المجمّعة إلى فهم أوضح لشرائح الجمهور، واهتماماتها، والعوامل التي قد تؤثر في استجابتها.",
      label: "نموذج الجمهور",
      tags: ["الاهتمامات", "القنوات المفضلة", "السياق السلوكي"],
      bars: [68, 88, 51, 76, 61, 93, 73],
    },
    {
      icon: MessageSquareText,
      title: "امنح رسالتك مساحة للتجربة",
      text: "استكشف كيف يمكن أن تتغير الاستجابة عند تغيير الصياغة أو النبرة أو قناة النشر، قبل اعتماد الرسالة النهائية.",
      label: "محاكاة الرسالة",
      tags: ["وضوح الرسالة", "ملاءمة النبرة", "المخاطر المحتملة"],
      bars: [45, 65, 83, 58, 89, 70, 94],
    },
    {
      icon: Layers3,
      title: "قارن، ثم اختر بثقة",
      text: "ضع السيناريوهات جنبًا إلى جنب، وراجع المؤشرات التقديرية والمفاضلات لتدعم قرار فريقك الاتصالي.",
      label: "مقارنة السيناريوهات",
      tags: ["السيناريو الأول", "السيناريو الثاني", "مراجعة بشرية"],
      bars: [85, 55, 74, 91, 65, 82, 96],
    },
  ];
  const selected = capabilities[active] ?? capabilities[0]!;
  return (
    <div className={s["landing"]}>
      <a className={s["skip"]} href="#main">
        انتقل إلى المحتوى
      </a>
      <header className={s["header"]}>
        <Link className={s["brand"]} href="/" aria-label="الجامعة القاسمية — الرئيسية">
          <span className={s["brandIcon"]}>
            <Image src="/شعار-الجامعة-القاسمية.png" alt="" width={44} height={44} priority />
          </span>
          <span>
            الجامعة القاسمية<small>AL QASIMIA UNIVERSITY</small>
          </span>
        </Link>
        <nav className={`${s["nav"]} ${menuOpen ? s["navOpen"] : ""}`} aria-label="التنقل الرئيسي">
          {[
            ["الفكرة", "about"],
            ["إمكانات المختبر", "capabilities"],
            ["كيف يعمل؟", "workflow"],
            ["أسئلة شائعة", "faq"],
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <Link href="/login" className={s["headerCta"]}>
          دخول المختبر <ArrowUpLeft size={17} />
        </Link>
        <button
          className={s["menuButton"]}
          aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>
      <main id="main">
        <section className={s["hero"]}>
          <div className={s["heroArtwork"]} aria-hidden="true">
            <div className={s["lightField"]} />
            <div className={s["sculpture"]}>
              <i />
              <i />
              <i />
            </div>
            <div className={s["glass"]} />
          </div>
          <div className={`${s["container"]} ${s["heroInner"]}`}>
            <div className={s["heroCopy"]}>
              <span className={s["eyebrow"]}>
                <i /> مستقبل الاتصال يبدأ بفهم أعمق
              </span>
              <h1>
                قبل أن تصل رسالتك،
                <br />
                اكتشف <span>أثرها.</span>
              </h1>
              <p>
                مساحة جديدة للتفكير في الاتصال الحكومي. افهم جمهورك، اختبر رسالتك، واستكشف الاستجابة
                المحتملة — قبل إطلاق حملتك.
              </p>
              <div className={s["actions"]}>
                <Link className={s["primary"]} href="/login">
                  استكشف التوأم الرقمي <ArrowUpLeft size={20} />
                </Link>
                <a className={s["textLink"]} href="#workflow">
                  شاهد كيف يعمل{" "}
                  <span>
                    <ArrowDown size={17} />
                  </span>
                </a>
              </div>
              <div className={s["heroNote"]}>
                <span>
                  <FlaskConical size={15} /> نموذج تجريبي
                </span>
                <span>بيانات اصطناعية · قرار بشري</span>
              </div>
            </div>
          </div>
          <div className={`${s["container"]} ${s["heroBottom"]}`}>
            <span lang="en" dir="ltr">
              SHARJAH PREDICTIVE COMMUNICATION DECISION LAB
            </span>
            <a href="#about">
              اكتشف ما وراء الرسالة <ArrowDown size={15} />
            </a>
          </div>
        </section>
        <div className={s["principles"]}>
          <div className={s["container"]}>
            <span>اتصال مدروس. أثر أفضل.</span>
            <span>
              <Fingerprint /> فهم الجمهور
            </span>
            <span>
              <Layers3 /> اختبار الاحتمالات
            </span>
            <span>
              <ShieldCheck /> الإنسان يقرر
            </span>
            <span className={s["english"]}>BUILT FOR BETTER COMMUNICATION</span>
          </div>
        </div>
        <section id="about" className={`${s["container"]} ${s["about"]} ${s["section"]}`}>
          <div>
            <span className={s["kicker"]}>01 — الفكرة</span>
            <h2>
              رسالة واحدة.
              <br />
              <span>احتمالات كثيرة.</span>
            </h2>
          </div>
          <div className={s["aboutCopy"]}>
            <p>
              كل جمهور يرى الرسالة من زاوية مختلفة. ماذا لو استطعت استكشاف هذه الزوايا قبل أن تضغط
              «نشر»؟
            </p>
            <p>
              التوأم الرقمي نموذج سلوكي مجمّع يساعدك على فهم الاستجابات المحتملة. مساحة لاختبار
              الأفكار ومراجعة الافتراضات، ليصبح قرارك القادم أكثر وعيًا.
            </p>
            <a className={s["inlineLink"]} href="#capabilities">
              تعرّف على إمكانات المختبر <ArrowUpLeft size={19} />
            </a>
          </div>
        </section>
        <section id="capabilities" className={`${s["capabilities"]} ${s["section"]}`}>
          <div className={s["container"]}>
            <div className={s["sectionHeading"]}>
              <div>
                <span className={s["kicker"]}>02 — إمكانات المختبر</span>
                <h2>
                  من إشارات متفرقة،
                  <br />
                  إلى رؤية متكاملة.
                </h2>
              </div>
              <p>
                ثلاث زوايا متكاملة تساعدك على بناء
                <br />
                اتصال أقرب لجمهورك.
              </p>
            </div>
            <div className={s["capGrid"]}>
              <div className={s["capOptions"]} role="tablist" aria-label="إمكانات المختبر">
                {capabilities.map((cap, i) => (
                  <button
                    key={cap.title}
                    id={`cap-tab-${i}`}
                    role="tab"
                    aria-selected={active === i}
                    aria-controls="cap-panel"
                    tabIndex={active === i ? 0 : -1}
                    className={active === i ? s["activeOption"] : ""}
                    onClick={() => setActive(i)}
                    onKeyDown={(event) => {
                      if (
                        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(
                          event.key,
                        )
                      ) {
                        event.preventDefault();
                        const next =
                          event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? 2
                              : (i + (["ArrowDown", "ArrowLeft"].includes(event.key) ? 1 : 2)) % 3;
                        setActive(next);
                        document.getElementById(`cap-tab-${next}`)?.focus();
                      }
                    }}
                  >
                    <span className={s["optionNumber"]}>0{i + 1}</span>
                    <span>
                      <strong>{cap.title}</strong>
                      <span>{cap.text}</span>
                    </span>
                    <ArrowUpLeft size={19} />
                  </button>
                ))}
              </div>
              <div
                className={s["capPanel"]}
                id="cap-panel"
                role="tabpanel"
                aria-labelledby={`cap-tab-${active}`}
                tabIndex={0}
              >
                <div className={s["panelTop"]}>
                  <span>
                    <selected.icon size={18} /> {selected.label}
                  </span>
                  <span>عرض توضيحي</span>
                </div>
                <div className={s["chart"]} key={active} aria-hidden="true">
                  {selected.bars.map((height, i) => (
                    <div key={i} style={{ height: `${height}%`, animationDelay: `${i * 0.06}s` }}>
                      <span />
                    </div>
                  ))}
                </div>
                <div className={s["chartCaption"]}>
                  <span>استكشاف الإشارات والأنماط</span>
                  <AudioLines size={20} />
                </div>
                <div className={s["tags"]}>
                  {selected.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <p className={s["panelNote"]}>
                  تمثيل بصري ببيانات اصطناعية، وليس نتيجة تحليل فعلية.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="workflow" className={`${s["container"]} ${s["section"]}`}>
          <div className={s["sectionHeading"]}>
            <div>
              <span className={s["kicker"]}>03 — رحلة العمل</span>
              <h2>
                من السؤال الأول،
                <br />
                <span>إلى قرار مدروس.</span>
              </h2>
            </div>
            <a href="/login" className={s["inlineLink"]}>
              ابدأ رحلتك في المختبر <ArrowUpLeft size={19} />
            </a>
          </div>
          <div className={s["steps"]}>
            {[
              [
                "01",
                "ابدأ بالسياق",
                "حدّد هدف حملتك والجمهور الذي تريد الوصول إليه، وأضف البيانات ذات الصلة.",
              ],
              [
                "02",
                "اختبر الاحتمالات",
                "جرّب صيغًا ورسائل وسيناريوهات مختلفة داخل بيئة المحاكاة.",
              ],
              ["03", "اقرأ المؤشرات", "قارن الوضوح والملاءمة والمخاطر المحتملة بين السيناريوهات."],
              [
                "04",
                "اتخذ القرار",
                "راجع التوصيات مع فريقك، واعتمد الرسالة، ثم تعلّم من النتائج الفعلية.",
              ],
            ].map(([number, title, text]) => (
              <article key={number}>
                <span className={s["stepNumber"]}>
                  {number}
                  <MoveUpLeft size={20} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className={s["responsibility"]}>
          <div className={`${s["container"]} ${s["responsibilityGrid"]}`}>
            <div>
              <span className={s["kicker"]}>04 — ذكاء اصطناعي مسؤول</span>
              <h2>
                التقنية توسّع رؤيتك.
                <br />
                <span>والقرار يبقى لك.</span>
              </h2>
              <p>
                صُمّم المختبر لدعم التفكير البشري. التنبؤات مؤشرات تقديرية تُراجع في سياقها، وليست
                وعودًا بنتائج مؤكدة.
              </p>
              <div className={s["responsibilityTags"]}>
                <span>
                  <Check size={16} /> بيانات مجمّعة
                </span>
                <span>
                  <Check size={16} /> إشراف بشري
                </span>
                <span>
                  <Check size={16} /> سجل قرارات
                </span>
              </div>
            </div>
            <div className={s["humanCard"]}>
              <ShieldCheck size={32} strokeWidth={1.3} />
              <div>
                <span>الذكاء الاصطناعي</span>
                <p>يحلّل · يحاكي · يقترح</p>
              </div>
              <div className={s["humanDivider"]}>
                <ArrowDown size={18} />
              </div>
              <div>
                <span>الإنسان</span>
                <p>يراجع · يقيّم · يقرّر</p>
              </div>
              <small>لا نمذجة فردية ولا تصنيف نفسي للأفراد</small>
            </div>
          </div>
        </section>
        <section id="faq" className={`${s["container"]} ${s["section"]} ${s["faq"]}`}>
          <div>
            <span className={s["kicker"]}>05 — أسئلة شائعة</span>
            <h2>قبل أن تبدأ.</h2>
            <p>تعرّف على المختبر وحدود المحاكاة.</p>
          </div>
          <div>
            {[
              [
                "ما المقصود بالتوأم الرقمي للاتصال؟",
                "هو نموذج سلوكي مجمّع يمثل كيف قد تفهم شرائح الجمهور رسالة معينة وتستجيب لها في سياق محدد. لا يمثل نسخة رقمية من شخص بعينه.",
              ],
              [
                "هل النتائج تنبؤات مؤكدة؟",
                "لا. النتائج مؤشرات تقديرية تعتمد على البيانات والافتراضات والسيناريوهات المستخدمة. ينبغي مراجعتها بشريًا ومقارنتها بنتائج الحملات الفعلية.",
              ],
              [
                "هل أحتاج إلى بيانات حقيقية لتجربة المختبر؟",
                "يمكنك استكشاف النموذج التجريبي باستخدام البيانات الاصطناعية وأمثلة البيانات المتاحة داخل المنصة، لفهم سير العمل قبل تطبيقه على سياق حملتك.",
              ],
              [
                "لمن صُمّم هذا المختبر؟",
                "لفرق الاتصال الحكومي والباحثين والمهتمين بفهم الجمهور وتحسين الرسائل ومقارنة السيناريوهات الاتصالية قبل التنفيذ.",
              ],
            ].map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <ChevronDown size={18} />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className={`${s["container"]} ${s["finalCta"]}`}>
          <span className={s["kicker"]}>خطوتك التالية</span>
          <h2>
            امنح رسالتك القادمة
            <br />
            <span>بداية أكثر وضوحًا.</span>
          </h2>
          <Link href="/login" className={s["primary"]}>
            ادخل المختبر وابدأ الاستكشاف <ArrowUpLeft size={20} />
          </Link>
          <p>نموذج تجريبي · بيانات اصطناعية · رؤية استكشافية</p>
          <span className={s["ctaOrbit"]} aria-hidden="true" />
        </section>
      </main>
      <footer className={`${s["container"]} ${s["footer"]}`}>
        <Link className={s["brand"]} href="/">
          <span className={s["brandIcon"]}>
            <Image src="/شعار-الجامعة-القاسمية.png" alt="" width={44} height={44} />
          </span>
          <span>
            الجامعة القاسمية<small>AL QASIMIA UNIVERSITY</small>
          </span>
        </Link>
        <p>التوأم الرقمي للاتصال الحكومي — نموذج تجريبي بحثي</p>
        <a href="#main">العودة إلى الأعلى ↑</a>
      </footer>
    </div>
  );
}
