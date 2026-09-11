/**
 * Deterministic demonstration simulation engine.
 *
 * This is NOT a trained machine-learning model. It applies transparent,
 * rule-based weighting to synthetic attributes so the same inputs always
 * produce the same outputs. Each function is isolated so it can later be
 * replaced by a real analytics / ML service during a Pilot.
 */
import type {
  AudienceSegment,
  CommunicationMessage,
  Level,
  Scenario,
  SimulationResult,
} from "@/data/types";

const levelValue: Record<Level, number> = { LOW: 0.35, MEDIUM: 0.65, HIGH: 0.95 };

const clamp = (n: number, min = 1, max = 99) => Math.max(min, Math.min(max, Math.round(n)));

export function simulateMessage(
  segment: AudienceSegment,
  message: CommunicationMessage,
  scenario: Scenario,
): SimulationResult {
  const verify = levelValue[segment.verificationTendency];
  const share = levelValue[segment.sharingTendency];
  const source = levelValue[segment.sourceSensitivity];
  const trust = levelValue[segment.officialTrust];
  const fatigue = levelValue[segment.messageFatigue];

  const clarity = clamp(
    message.clarity * (1 - (1 - scenario.formality) * 0.05) + (1 - fatigue) * 6,
  );

  const audienceFit = clamp(
    message.audienceFit * (0.82 + scenario.amplification * 0.16) +
      (1 - scenario.formality) * share * 10 -
      fatigue * 6,
  );

  const interaction = clamp(
    message.expectedInteraction * scenario.amplification + share * 12 - fatigue * 8,
  );

  const risk = clamp(
    message.risk + scenario.riskModifier + (1 - trust) * 9 + (1 - verify) * 6 - source * 4,
    1,
    60,
  );

  const verificationIntent = clamp(
    message.verificationIntent * (0.9 + scenario.amplification * 0.1) +
      verify * 10 +
      source * 6 +
      trust * scenario.formality * 5 -
      share * 7,
  );

  const composite = clamp(
    clarity * 0.2 +
      audienceFit * 0.2 +
      interaction * 0.2 +
      verificationIntent * 0.3 +
      (100 - risk) * 0.1,
  );

  return {
    segmentId: segment.id,
    messageId: message.id,
    scenarioId: scenario.id,
    clarity,
    audienceFit,
    interaction,
    risk,
    verificationIntent,
    composite,
  };
}

export function compareScenarios(
  segment: AudienceSegment,
  message: CommunicationMessage,
  list: Scenario[],
): SimulationResult[] {
  return list.map((s) => simulateMessage(segment, message, s));
}

export function generateRecommendation(
  segment: AudienceSegment,
  results: SimulationResult[],
  scenarioList: Scenario[],
) {
  const best = [...results].sort((a, b) => b.composite - a.composite)[0]!;
  const scenario = scenarioList.find((s) => s.id === best.scenarioId)!;
  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    scenarioNameAr: scenario.nameAr,
    score: best.composite,
    reasonsAr: [
      `أعلى ملاءمة متوقعة لشريحة «${segment.nameAr}» في بيئة المحاكاة.`,
      `نية تحقق تقديرية ${best.verificationIntent}% مع مخاطرة اتصالية منخفضة (${best.risk}%).`,
      "قناة تسمح بدعوة سلوكية قصيرة وواضحة.",
    ],
  };
}

export function optimizeMessage(message: CommunicationMessage) {
  return {
    originalText: message.text,
    optimizedText: "قبل ما تشارك… خذ 10 ثواني وتأكد من المصدر.",
    rationaleAr: [
      "أكثر قابلية للتنفيذ",
      "أقصر وأسهل للتذكر",
      "أسلوب محاوري قريب من الجمهور",
      "خطوة تحقق صريحة",
      "مقاومة إدراكية أقل",
    ],
    before: 76,
    after: 87,
  };
}

export function generatePrediction(result: SimulationResult) {
  const end = result.verificationIntent;
  return {
    expectedEngagement: result.interaction,
    expectedVerificationIntent: result.verificationIntent,
    expectedAudienceFit: result.audienceFit,
    communicationRisk: result.risk < 15 ? "Low" : "Medium",
    confidence: `${result.composite}% model score`,
    curve: [
      { day: "يوم 1", predicted: clamp(end * 0.4), baseline: clamp(end * 0.28) },
      { day: "يوم 7", predicted: clamp(end * 0.62), baseline: clamp(end * 0.38) },
      { day: "يوم 14", predicted: clamp(end * 0.8), baseline: clamp(end * 0.49) },
      { day: "يوم 21", predicted: clamp(end * 0.92), baseline: clamp(end * 0.57) },
      { day: "يوم 30", predicted: end, baseline: clamp(end * 0.63) },
    ],
  };
}

export function generateLearning() {
  return {
    predicted: 84,
    actual: 79,
    error: 5,
    calibrated: 81,
    series: [
      { label: "التنبؤ السابق", value: 84 },
      { label: "النتيجة الفعلية", value: 79 },
      { label: "التنبؤ المُعاير", value: 81 },
    ],
  };
}
