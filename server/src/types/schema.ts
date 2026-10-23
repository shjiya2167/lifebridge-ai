import { z } from 'zod';

export const ProblemCategorySchema = z.enum([
  'health',
  'traffic',
  'weather',
  'disaster',
  'public_services',
  'general'
]);
export type ProblemCategory = z.infer<typeof ProblemCategorySchema>;

export const UrgencyLevelSchema = z.enum([
  'routine',
  'elevated',
  'urgent',
  'emergency',
  'unknown'
]);
export type UrgencyLevel = z.infer<typeof UrgencyLevelSchema>;

export const VerificationStatusSchema = z.enum([
  'verified',
  'partially_verified',
  'unverified'
]);
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

export const ActionItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.number().int().min(1),
  reason: z.string(),
  humanConfirmationRequired: z.boolean().default(false),
  relevantSourceUrl: z.string().optional(),
  limitation: z.string().optional()
});
export type ActionItem = z.infer<typeof ActionItemSchema>;

export const PublicResourceSchema = z.object({
  name: z.string(),
  category: z.string(),
  contact: z.string().optional(),
  url: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  isOfficial: z.boolean().default(true),
  coverage: z.string().optional()
});
export type PublicResource = z.infer<typeof PublicResourceSchema>;

export const VerifiedSourceSchema = z.object({
  publisher: z.string(),
  sourceTitle: z.string(),
  originalUrl: z.string(),
  retrievalTimestamp: z.string(),
  publicationTimestamp: z.string().optional(),
  geographicCoverage: z.string(),
  claimSupported: z.string(),
  verificationLimitations: z.string(),
  isLive: z.boolean().default(false)
});
export type VerifiedSource = z.infer<typeof VerifiedSourceSchema>;

export const GeminiStructuredResponseSchema = z.object({
  summary: z.string(),
  category: ProblemCategorySchema,
  urgency: UrgencyLevelSchema,
  keyFacts: z.array(z.string()),
  missingInformation: z.array(z.string()),
  actions: z.array(ActionItemSchema),
  resources: z.array(PublicResourceSchema),
  warnings: z.array(z.string()),
  verificationStatus: VerificationStatusSchema,
  language: z.string().default('en'),
  confidenceExplanation: z.string(),
  medicalDisclaimer: z.string().optional(),
  verifiedSources: z.array(VerifiedSourceSchema).optional().default([]),
  isSimulated: z.boolean().optional().default(false),
  timestamp: z.string().optional()
});
export type GeminiStructuredResponse = z.infer<typeof GeminiStructuredResponseSchema>;

export const VerificationRequestSchema = z.object({
  category: ProblemCategorySchema.default('general'),
  keyFacts: z.array(z.string()).default([]),
  queryText: z.string().default('')
});
export type VerificationRequest = z.infer<typeof VerificationRequestSchema>;

export const SupportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' }
] as const;

export type SupportedLanguageCode = typeof SupportedLanguages[number]['code'];
