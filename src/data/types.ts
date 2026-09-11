export type Level = "LOW" | "MEDIUM" | "HIGH";

export interface AudienceSegment {
  id: string;
  name: string;
  nameAr: string;
  sharingTendency: Level;
  verificationTendency: Level;
  sourceSensitivity: Level;
  officialTrust: Level;
  messageFatigue: Level;
  profileAr: string;
  profileEn?: string;
  motivationAr: string;
  motivationEn?: string;
  barriersAr: string[];
  barriersEn?: string[];
  communicationPreferenceAr: string;
  communicationPreferenceEn?: string;
  expectedResponseAr: string;
  expectedResponseEn?: string;
  riskFactorsAr: string[];
  riskFactorsEn?: string[];
  share: number;
}

export interface CommunicationMessage {
  id: string;
  label: string;
  text: string;
  textEn?: string;
  clarity: number;
  audienceFit: number;
  trust: number;
  expectedInteraction: number;
  risk: number;
  verificationIntent: number;
}

export interface Scenario {
  id: string;
  name: string;
  nameAr: string;
  channel: string;
  contextAr: string;
  contextEn?: string;
  expectedResponseAr: string;
  expectedResponseEn?: string;
  amplification: number;
  formality: number;
  riskModifier: number;
}

export interface SimulationResult {
  segmentId: string;
  messageId: string;
  scenarioId: string;
  clarity: number;
  audienceFit: number;
  interaction: number;
  risk: number;
  verificationIntent: number;
  composite: number;
}

export interface CampaignConfig {
  nameEn: string;
  nameAr: string;
  objectiveEn: string;
  objectiveAr: string;
  audience: string;
  topic: string;
  channels: string[];
  durationDays: number;
  launchDate: string;
  useSyntheticData: boolean;
}

export interface DecisionRecord {
  id: string;
  decisionMaker: string;
  timestamp: string;
  decision: "APPROVE" | "MODIFY" | "REJECT";
  selectedScenario: string;
  aiRecommendation: string;
  campaignVersion: string;
  rationale: string;
}

export interface TopicTrendPoint {
  week: string;
  weekEn?: string;
  misinformation: number;
  fakeNews: number;
  sourceVerification: number;
  officialSources: number;
  trust: number;
}

export interface AudienceSignal {
  key: string;
  labelAr: string;
  labelEn: string;
  volume: number;
  sentiment: number;
}

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface IntelligenceDataset {
  sourceName: string;
  generatedAt: string;
  recordCount: number;
  summary: LocalizedText;
  concerns: LocalizedText[];
  emergingTopics: LocalizedText[];
  signals: AudienceSignal[];
  trends: TopicTrendPoint[];
  segments: AudienceSegment[];
  messages: CommunicationMessage[];
  scenarios: Scenario[];
  recommendation: LocalizedText;
  confidence: number;
}
