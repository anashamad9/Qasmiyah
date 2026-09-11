import type { CampaignConfig } from "./types";

export const defaultCampaign: CampaignConfig = {
  nameEn: "",
  nameAr: "",
  objectiveEn: "",
  objectiveAr: "",
  audience: "",
  topic: "",
  channels: [],
  durationDays: 30,
  launchDate: "",
  useSyntheticData: false,
};

export const availableChannels = [
  "Instagram",
  "TikTok",
  "X",
  "YouTube",
  "Government Digital Channels",
];
