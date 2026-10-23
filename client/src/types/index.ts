import { z } from 'zod';

export type ProblemCategory =
  | 'health'
  | 'traffic'
  | 'weather'
  | 'disaster'
  | 'public_services'
  | 'general';

export const SupportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' }
] as const;

export type UrgencyLevel = 'routine' | 'elevated' | 'urgent' | 'emergency' | 'unknown';

export type VerificationStatus = 'verified' | 'partially_verified' | 'unverified';

export interface ActionItem {
  title: string;
  description: string;
  priority: number;
  reason: string;
  humanConfirmationRequired?: boolean;
  relevantSourceUrl?: string;
  limitation?: string;
}

export interface PublicResource {
  name: string;
  category: string;
  contact?: string;
  url?: string;
  address?: string;
  notes?: string;
  isOfficial: boolean;
  coverage?: string;
}

export interface VerifiedSource {
  publisher: string;
  sourceTitle: string;
  originalUrl: string;
  retrievalTimestamp: string;
  publicationTimestamp?: string;
  geographicCoverage: string;
  claimSupported: string;
  verificationLimitations: string;
  isLive: boolean;
}

export interface GeminiStructuredResponse {
  summary: string;
  category: ProblemCategory;
  urgency: UrgencyLevel;
  keyFacts: string[];
  missingInformation: string[];
  actions: ActionItem[];
  resources: PublicResource[];
  warnings: string[];
  verificationStatus: VerificationStatus;
  language: string;
  confidenceExplanation: string;
  medicalDisclaimer?: string;
  verifiedSources?: VerifiedSource[];
  isSimulated?: boolean;
  timestamp?: string;
}

export interface DemoScenarioMeta {
  id: string;
  name: string;
  badge: string;
  category: string;
  language: string;
  suggestedPrompt: string;
  hasAttachmentPreview: boolean;
  attachmentName?: string;
  attachmentType?: string;
}

export interface AppConfig {
  isGeminiConfigured: boolean;
  model: string;
  supportedLanguages: Array<{ code: string; name: string; nativeName: string }>;
  categories: ProblemCategory[];
  urgencyLevels: UrgencyLevel[];
  demoScenarios: DemoScenarioMeta[];
}

export interface SessionHistoryItem {
  id: string;
  createdAt: string;
  inputExcerpt: string;
  category: string;
  urgency: UrgencyLevel;
  language: string;
  analysis?: GeminiStructuredResponse;
}

export interface AttachedFileItem {
  id: string;
  file: File;
  previewUrl?: string;
  name: string;
  size: number;
  type: string;
}
