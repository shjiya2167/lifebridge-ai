import { GoogleGenAI } from '@google/genai';
import { IntentRouting, IntentRoutingSchema } from '../types/advanced.js';
import { sanitizeUntrustedInput } from './safetyRules.js';

// Keyword-based fast-path routing (deterministic, no LLM needed)
const INTENT_PATTERNS: { intent: IntentRouting['primaryIntent']; patterns: RegExp[] }[] = [
  {
    intent: 'emergency_safety',
    patterns: [
      /\b(accident|crash|collision|fire|burning|explosion|drowning|unconscious|cardiac arrest|heart attack|stroke|bleeding|trapped|flood|earthquake|building collapse)\b/i,
      /(एक्सीडेंट|दुर्घटना|आग|बेहोश|डूब|भूकंप|बाढ़)/
    ]
  },
  {
    intent: 'health_medical',
    patterns: [
      /\b(medical|doctor|hospital|blood|lab|report|CBC|hemoglobin|cholesterol|blood pressure|BP|fever|pain|medicine|dose|prescription|test result|MRI|X-ray|scan|diagnosis)\b/i,
      /(डॉक्टर|अस्पताल|दवा|रिपोर्ट|खून|बुखार|दर्द)/
    ]
  },
  {
    intent: 'weather_disaster',
    patterns: [
      /\b(rain|flood|cyclone|storm|heatwave|drought|snowfall|weather|alert|warning|IMD|monsoon|waterlogging|landslide)\b/i,
      /(बारिश|तूफान|बाढ़|मौसम|चक्रवात)/
    ]
  },
  {
    intent: 'traffic_transport',
    patterns: [
      /\b(traffic|road|highway|vehicle|bus|train|metro|accident|pothole|diversion|transport|commute|route|blocked|jam|NHAI)\b/i,
      /(ट्रैफिक|सड़क|बस|ट्रेन|रास्ता)/
    ]
  },
  {
    intent: 'public_services',
    patterns: [
      /\b(government|scheme|ration|aadhaar|ayushman|pension|certificate|portal|service|welfare|subsidy|PM-JAY|CSC|panchayat|municipality)\b/i,
      /(सरकार|योजना|राशन|आधार|पेंशन|प्रमाण|सब्सिडी)/
    ]
  }
];

function detectIntentFromPatterns(text: string): IntentRouting['primaryIntent'] | null {
  for (const { intent, patterns } of INTENT_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(text)) return intent;
    }
  }
  return null;
}

function detectEntities(text: string): IntentRouting['entities'] {
  const entities: IntentRouting['entities'] = [];

  // Emergency numbers
  const phoneMatch = text.match(/\b(112|108|1075|1070|14555|1033)\b/g);
  if (phoneMatch) {
    for (const num of [...new Set(phoneMatch)]) {
      entities.push({ type: 'emergency_number', value: num, confidence: 0.95 });
    }
  }

  // Numeric medical values
  const medMatch = text.match(/\b(\d+\.?\d*)\s*(g\/dL|mg\/dL|mmHg|bpm|°C|mcL|IU\/L|mg\/L)\b/gi);
  if (medMatch) {
    for (const m of medMatch.slice(0, 5)) {
      entities.push({ type: 'medical_measurement', value: m, confidence: 0.9 });
    }
  }

  // Location hints
  const cityMatch = text.match(/\b(Mumbai|Delhi|Bangalore|Bengaluru|Chennai|Kolkata|Hyderabad|Pune|Ahmedabad|Jaipur|Lucknow|Surat)\b/i);
  if (cityMatch) {
    entities.push({ type: 'location', value: cityMatch[0], confidence: 0.85 });
  }

  return entities;
}

export class IntentRouterService {
  private client: GoogleGenAI | null = null;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    this.modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
    if (apiKey) {
      try {
        this.client = new GoogleGenAI({ apiKey });
      } catch {}
    }
  }

  async route(rawText: string, files?: { mimetype: string }[]): Promise<IntentRouting> {
    const text = sanitizeUntrustedInput(rawText);
    const entities = detectEntities(text);
    const hasFiles = files && files.length > 0;

    // Fast deterministic path
    const fastIntent = detectIntentFromPatterns(text);

    // Time sensitivity detection
    const timeSensitivity: IntentRouting['timeSensitivity'] = /\b(now|immediately|right now|urgent|emergency|तुरंत|अभी)\b/i.test(text)
      ? 'immediate'
      : /\b(today|tonight|this morning|this evening|आज)\b/i.test(text)
      ? 'today'
      : /\b(soon|this week|tomorrow|कल|जल्दी)\b/i.test(text)
      ? 'soon'
      : 'general';

    // If we have a confident fast-path match, skip LLM for routing
    if (fastIntent) {
      return this.buildRoutingResult(fastIntent, text, entities, timeSensitivity, hasFiles);
    }

    // Try LLM routing if configured
    if (this.client && text.length > 10) {
      try {
        return await this.routeWithLLM(text, entities, timeSensitivity, hasFiles);
      } catch {
        // Fall through to heuristic
      }
    }

    return this.buildRoutingResult('unknown_mixed', text, entities, timeSensitivity, hasFiles);
  }

  private buildRoutingResult(
    primaryIntent: IntentRouting['primaryIntent'],
    text: string,
    entities: IntentRouting['entities'],
    timeSensitivity: IntentRouting['timeSensitivity'],
    hasFiles: boolean
  ): IntentRouting {
    const missing: string[] = [];
    const riskIndicators: string[] = [];
    let clarifyingQuestion: string | undefined;

    if (primaryIntent === 'health_medical' && !hasFiles && !text.match(/\d/)) {
      missing.push('Specific lab values or document for analysis');
      clarifyingQuestion = 'Could you share the specific test values (e.g., hemoglobin: 11.2 g/dL) or upload the report?';
    }
    if (primaryIntent === 'weather_disaster' && !entities.find(e => e.type === 'location')) {
      missing.push('Geographic location to check active alerts');
    }
    if (primaryIntent === 'emergency_safety') {
      riskIndicators.push('Potential life-threatening situation detected');
    }

    const requiredDataSources: string[] = {
      health_medical: ['MoHFW / ICMR Guidelines', 'National Health Portal'],
      weather_disaster: ['IMD Live Radar', 'NDMA Safety Bulletins'],
      traffic_transport: ['MoRTH Highway Safety', 'ERSS 112 Dispatch'],
      emergency_safety: ['ERSS 112', 'State Disaster Control Room 1070'],
      public_services: ['india.gov.in', 'Ayushman Bharat Portal'],
      education_general: ['Official Government Portals'],
      accessibility_community: ['Local Community Resources'],
      unknown_mixed: ['General Government Directory']
    }[primaryIntent] || [];

    return IntentRoutingSchema.parse({
      primaryIntent,
      secondaryIntents: [],
      entities,
      timeSensitivity,
      requiredDataSources,
      missingInfo: missing,
      recommendedWorkflow: `${primaryIntent} → structured analysis → source verification → action plan`,
      riskIndicators,
      clarifyingQuestion,
      confidence: 0.8
    });
  }

  private async routeWithLLM(
    text: string,
    entities: IntentRouting['entities'],
    timeSensitivity: IntentRouting['timeSensitivity'],
    hasFiles: boolean
  ): Promise<IntentRouting> {
    const prompt = `Classify the following user inquiry. Return ONLY valid JSON matching the schema exactly.

Schema:
{
  "primaryIntent": "health_medical"|"weather_disaster"|"traffic_transport"|"emergency_safety"|"public_services"|"education_general"|"accessibility_community"|"unknown_mixed",
  "secondaryIntents": [],
  "entities": [{"type": string, "value": string, "confidence": number}],
  "timeSensitivity": "immediate"|"today"|"soon"|"general",
  "requiredDataSources": [string],
  "missingInfo": [string],
  "recommendedWorkflow": string,
  "riskIndicators": [string],
  "clarifyingQuestion": string or omit,
  "confidence": number 0-1
}

<<<USER_INQUIRY>>>
${text}
<<<END_USER_INQUIRY>>>`;

    const response = await this.client!.models.generateContent({
      model: this.modelName,
      contents: prompt,
      config: { responseMimeType: 'application/json', temperature: 0.1 }
    });

    const raw = response.text?.trim() || '{}';
    const json = JSON.parse(raw);
    return IntentRoutingSchema.parse({ ...json, entities, timeSensitivity });
  }
}

export const defaultIntentRouter = new IntentRouterService();
