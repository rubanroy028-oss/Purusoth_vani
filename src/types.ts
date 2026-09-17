export interface ClonedVoiceProfile {
  id: string;
  name: string;
  speakerGender: "male" | "female";
  estimatedAgeGroup: string;
  vocalPitch: string;
  vocalTimbre: string;
  speakingPace: string;
  detectedAccent: string;
  recommendedPrebuiltVoice: "Puck" | "Charon" | "Fenrir" | "Kore" | "Zephyr";
  recommendedSpeed: number;
  vocalReplicationPrompt: string;
  voiceTitle: string;
  referenceAudioUrl?: string;
  referenceAudioBase64?: string;
  createdAt: number;
  pitchHz?: number;
  isPreset?: boolean;
  bassBoostDb?: number;
  trebleBoostDb?: number;
  formantShift?: number;
}
