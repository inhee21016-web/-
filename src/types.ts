export interface ScoreBreakdown {
  experienceScore: number; // 30 max
  physicalScore: number;   // 25 max
  conditionScore: number;  // 20 max
  qualificationScore: number; // 15 max
  commuteScore: number;    // 10 max
}

export interface MatchItem {
  rank: number;
  companyName: string;
  jobTitle: string;
  suitabilityScore: number;
  scoreBreakdown: ScoreBreakdown;
  keyReason: string;
  recommendPoint: string;
  strengths: string[];
  risks: string[];
  workHours: string;
  salary: string;
}

export interface SeekerSummary {
  name: string;
  age: string;
  experience: string;
  qualifications: string[];
  preferences: string;
}

export interface GeneralSummary {
  analyzedCount: number;
  topPick: string;
  summaryText: string;
}

export interface MatchData {
  seekerSummary: SeekerSummary;
  generalSummary: GeneralSummary;
  matches: MatchItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  isStepMarker?: boolean;
  step?: number;
}
