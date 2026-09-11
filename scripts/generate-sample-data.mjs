import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const outputDir = resolve("public/data-examples");
mkdirSync(outputDir, { recursive: true });

let seed = 20260911;
function random() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

const pick = (items) => items[Math.floor(random() * items.length)];
const integer = (min, max) => Math.floor(random() * (max - min + 1)) + min;
const date = (offset) => {
  const value = new Date(Date.UTC(2026, 0, 1 + offset));
  return value.toISOString().slice(0, 10);
};

function csv(rows) {
  const headers = Object.keys(rows[0]);
  const cell = (value) => {
    const text = value == null ? "" : String(value);
    return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  return `${headers.map(cell).join(",")}\n${rows
    .map((row) => headers.map((header) => cell(row[header])).join(","))
    .join("\n")}\n`;
}

const socialTopics = [
  ["source_verification", "كيف أتأكد من المصدر الأصلي قبل المشاركة؟", "How can I verify the original source before sharing?", 0.42],
  ["misinformation", "هذه الصورة صحيحة لكن الوصف المرفق بها مضلل", "The image is real but its caption is misleading", -0.64],
  ["official_sources", "التوضيح الرسمي وصل بسرعة وذكر تفاصيل واضحة", "The official clarification arrived quickly and included clear details", 0.76],
  ["ai_content", "هل هذا الفيديو حقيقي أم مولد بالذكاء الاصطناعي؟", "Is this video authentic or AI-generated?", -0.22],
  ["breaking_news", "الخبر عاجل لكن لا يوجد رابط لمصدر موثوق", "The news is urgent but has no link to a trusted source", -0.55],
  ["trust", "ذكر التاريخ والمصدر زاد ثقتي بالمعلومة", "Including the date and source increased my trust", 0.69],
  ["digital_literacy", "خطوات التحقق المختصرة مفيدة وسهلة التطبيق", "The short verification steps are useful and actionable", 0.81],
  ["rumor_control", "يجب توضيح الإشاعة والرد عليها دون إعادة نشرها", "The rumor should be clarified without amplifying it", 0.18],
];
const socialChannels = ["Instagram", "TikTok", "X", "YouTube", "Facebook", "Public forum"];
const segments = ["Youth", "Parents", "Professionals", "Students", "Residents", "Content creators"];
const regions = ["Sharjah", "Al Dhaid", "Khor Fakkan", "Kalba", "UAE"];

const socialRows = Array.from({ length: 320 }, (_, index) => {
  const [topic, arText, enText, baseSentiment] = pick(socialTopics);
  const language = random() < 0.72 ? "ar" : "en";
  const impressions = integer(900, 68000);
  const engagements = Math.round(impressions * (integer(2, 18) / 100));
  return {
    post_id: `SOC-${String(index + 1).padStart(4, "0")}`,
    captured_at: date(index % 180),
    platform: pick(socialChannels),
    topic,
    public_text: language === "ar" ? arText : enText,
    language,
    location: pick(regions),
    inferred_audience: pick(segments),
    impressions,
    engagements,
    shares: Math.round(engagements * (integer(8, 42) / 100)),
    comments: Math.round(engagements * (integer(5, 28) / 100)),
    sentiment_score: Math.max(-1, Math.min(1, baseSentiment + (random() - 0.5) * 0.3)).toFixed(2),
    source_verified: topic === "official_sources" || topic === "digital_literacy" ? true : random() > 0.48,
  };
});

const messages = [
  ["MSG-A", "تأكد من صحة الخبر قبل مشاركته", "Verify the news before sharing it"],
  ["MSG-B", "قبل ما تشارك اسأل: من المصدر؟", "Before sharing, ask: who is the source?"],
  ["MSG-C", "خذ عشر ثوان وتأكد من المصدر", "Take ten seconds to check the source"],
  ["MSG-D", "مش كل شيء تشوفه حقيقة", "Not everything you see is true"],
  ["MSG-E", "المصدر والتاريخ أول خطوتين للتحقق", "Source and date are the first two verification checks"],
];
const campaignChannels = ["Instagram", "TikTok", "X", "YouTube", "Government portal"];
const placements = ["Feed", "Stories", "Reels", "Pre-roll", "Promoted post"];

const campaignRows = Array.from({ length: 260 }, (_, index) => {
  const [messageId, textAr, textEn] = pick(messages);
  const impressions = integer(8000, 180000);
  const reach = Math.round(impressions * (integer(62, 91) / 100));
  const engagements = Math.round(reach * (integer(3, 17) / 100));
  const clicks = Math.round(engagements * (integer(10, 46) / 100));
  return {
    result_id: `PERF-${String(index + 1).padStart(4, "0")}`,
    report_date: date(index % 180),
    campaign_name: index < 130 ? "Ask Before You Share" : "Check the Source",
    creative_id: messageId,
    message_ar: textAr,
    message_en: textEn,
    media_channel: pick(campaignChannels),
    placement: pick(placements),
    audience_cohort: pick(segments),
    impressions,
    unique_reach: reach,
    engagements,
    shares: Math.round(engagements * (integer(6, 31) / 100)),
    link_clicks: clicks,
    completed_views: Math.round(reach * (integer(8, 56) / 100)),
    observed_verification_actions: Math.round(clicks * (integer(18, 72) / 100)),
    negative_feedback: Math.round(engagements * (integer(0, 4) / 100)),
    spend_aed: integer(350, 6200),
  };
});

const concerns = [
  "كيف أعرف الحساب الرسمي؟",
  "هل الصورة حديثة أم قديمة؟",
  "How do I find the original source?",
  "هل يمكن التحقق من الفيديو بسرعة؟",
  "Which official channel should I follow?",
  "كيف أميز المحتوى المولد بالذكاء الاصطناعي؟",
];
const formats = ["Short video", "Infographic", "Source card", "Official statement", "Q&A", "Explainer video"];
const ageGroups = ["18-24", "25-34", "35-44", "45-54", "55+"];

const surveyRows = Array.from({ length: 300 }, (_, index) => ({
  anonymous_response_id: `SUR-${String(index + 1).padStart(4, "0")}`,
  survey_date: date(index % 180),
  age_band: pick(ageGroups),
  emirate_or_city: pick(regions),
  preferred_platform: pick([...campaignChannels, "WhatsApp"]),
  shares_news_frequency_1_to_5: integer(1, 5),
  verifies_before_sharing_1_to_5: integer(1, 5),
  trust_in_official_sources_1_to_5: integer(2, 5),
  notices_source_name_1_to_5: integer(1, 5),
  communication_fatigue_1_to_5: integer(1, 5),
  preferred_content_format: pick(formats),
  primary_question_or_concern: pick(concerns),
  preferred_language: random() < 0.74 ? "Arabic" : "English",
  consent_for_aggregate_analysis: true,
}));

writeFileSync(resolve(outputDir, "01-social-listening.csv"), csv(socialRows));
writeFileSync(resolve(outputDir, "02-campaign-performance.csv"), csv(campaignRows));
writeFileSync(resolve(outputDir, "03-audience-survey.csv"), csv(surveyRows));

console.log(`Generated ${socialRows.length + campaignRows.length + surveyRows.length} sample records.`);
