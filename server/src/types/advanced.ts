import { z } from 'zod';

export const IntentSchema = z.enum([
  'health_medical',
  'weather_disaster',
  'traffic_transport',
  'emergency_safety',
  'public_services',
  'education_general',
  'accessibility_community',
  'unknown_mixed'
]);
export type Intent = z.infer<typeof IntentSchema>;

export const IntentRoutingSchema = z.object({
  primaryIntent: IntentSchema,
  secondaryIntents: z.array(IntentSchema).default([]),
  entities: z.array(z.object({
    type: z.string(),
    value: z.string(),
    confidence: z.number().min(0).max(1)
  })).default([]),
  timeSensitivity: z.enum(['immediate', 'today', 'soon', 'general']).default('general'),
  requiredDataSources: z.array(z.string()).default([]),
  missingInfo: z.array(z.string()).default([]),
  recommendedWorkflow: z.string().default(''),
  riskIndicators: z.array(z.string()).default([]),
  clarifyingQuestion: z.string().optional(),
  confidence: z.number().min(0).max(1).default(0.8)
});
export type IntentRouting = z.infer<typeof IntentRoutingSchema>;

export const ConflictSchema = z.object({
  claimA: z.string(),
  sourceA: z.string(),
  urlA: z.string(),
  timestampA: z.string().optional(),
  claimB: z.string(),
  sourceB: z.string(),
  urlB: z.string(),
  timestampB: z.string().optional(),
  explanation: z.string(),
  moreAuthoritativeSource: z.string().optional(),
  resolved: z.boolean().default(false)
});
export type Conflict = z.infer<typeof ConflictSchema>;

export const FollowUpSchema = z.object({
  sessionId: z.string(),
  question: z.string(),
  language: z.string().default('en')
});
export type FollowUp = z.infer<typeof FollowUpSchema>;

export const SimplifyRequestSchema = z.object({
  text: z.string(),
  level: z.enum(['basic', 'intermediate', 'detailed']).default('basic'),
  language: z.string().default('en')
});
export type SimplifyRequest = z.infer<typeof SimplifyRequestSchema>;

export const FeedbackSchema = z.object({
  sessionId: z.string(),
  type: z.enum(['incorrect_fact', 'outdated_resource', 'unhelpful', 'other']),
  details: z.string().optional(),
  factIndex: z.number().optional(),
  actionIndex: z.number().optional()
});
export type Feedback = z.infer<typeof FeedbackSchema>;
