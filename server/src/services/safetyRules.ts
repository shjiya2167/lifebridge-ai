import { UrgencyLevel, ActionItem, PublicResource } from '../types/schema.js';

export interface SafetyEvaluationResult {
  isEmergencyDetected: boolean;
  forcedUrgency?: UrgencyLevel;
  emergencyActions: ActionItem[];
  emergencyResources: PublicResource[];
  safetyWarnings: string[];
  medicalDisclaimer?: string;
}

// Deterministic Emergency Trigger Patterns
const EMERGENCY_PATTERNS = [
  // Cardiac & Stroke
  /\b(heart attack|chest pain|stroke|cardiac arrest|shortness of breath|breathing difficulty|facial droop|slurred speech|unconscious|fainted|passed out)\b/i,
  // Bleeding & Trauma
  /\b(massive bleeding|uncontrolled bleeding|gushing blood|amputation|head trauma|fracture compound|crushed|severe burns)\b/i,
  // Accidents
  /\b(road accident|car crash|bus accident|bike collision|overturned|pinned under|hit and run|casualt(y|ies))\b/i,
  // Disasters & Drowning
  /\b(drowning|flash flood|submerged|trapped in flood|landslide|earthquake collapse|building collapse|gas leak|fire breakout)\b/i,
  // Poisoning & Electrocution
  /\b(poison(ing|ed)|snake bite|electrocuted|electric shock|overdose|swallowed chemicals)\b/i,
  // Hindi Emergency Keywords
  /(सीने में दर्द|सांस नहीं आ रही|बेहोश|दुर्घटना|एक्सीडेंट|खून बह रहा|बाढ़ में फंसे|सांप ने काटा|आग लगी है)/
];

const ELEVATED_PATTERNS = [
  /\b(high fever|persistent vomiting|dizziness|dehydration|food poisoning|minor cut|sprain|water logging|road blocked|traffic diversion)\b/i,
  /(तेज बुखार|चक्कर|उल्टी|रास्ता बंद)/
];

/**
 * Sanitizes and protects user input against prompt injection attempts.
 * Removes malicious injection patterns, strips system tokens, and encapsulates in neutral delimiters.
 */
export function sanitizeUntrustedInput(rawInput: string): string {
  if (!rawInput) return '';
  
  let cleaned = rawInput
    // Remove control characters (except common whitespace)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Mitigate common injection delimiters
    .replace(/```(system|assistant|instruction|gemini)/gi, '```')
    // Mitigate explicit prompt overrides
    .replace(/\b(ignore previous instructions|disregard all previous rules|system prompt override|you are now in DAN mode)\b/gi, '[FILTERED_INSTRUCTION]')
    .trim();

  // Limit query length to prevent buffer exhaustion (max 10,000 characters)
  if (cleaned.length > 10000) {
    cleaned = cleaned.slice(0, 10000) + '... [TRUNCATED_FOR_SAFETY]';
  }

  return cleaned;
}

/**
 * Evaluates text deterministically to enforce safety, regardless of LLM output.
 */
export function evaluateSafetyRules(
  text: string,
  categoryHint?: string
): SafetyEvaluationResult {
  const normalized = text.toLowerCase();
  let isEmergency = false;
  let isElevated = false;

  for (const pattern of EMERGENCY_PATTERNS) {
    if (pattern.test(normalized)) {
      isEmergency = true;
      break;
    }
  }

  if (!isEmergency) {
    for (const pattern of ELEVATED_PATTERNS) {
      if (pattern.test(normalized)) {
        isElevated = true;
        break;
      }
    }
  }

  const safetyWarnings: string[] = [];
  const emergencyActions: ActionItem[] = [];
  const emergencyResources: PublicResource[] = [];
  let medicalDisclaimer: string | undefined = undefined;

  // Always enforce medical safety if health-related
  const isHealthRelated =
    categoryHint === 'health' ||
    /\b(medical|doctor|medicine|dose|symptom|pain|hospital|blood|lab|report|cbc|cholesterol|sugar|bp|pressure)\b/i.test(normalized) ||
    /(दवा|डॉक्टर|अस्पताल|रक्त|बीपी|जांच)/.test(normalized);

  if (isHealthRelated) {
    medicalDisclaimer =
      'NOTICE: LifeBridge AI provides informational assistance and document explanations only. It does not provide medical diagnoses, clinical prescriptions, or replace consultation with a qualified medical professional. In case of acute symptoms, seek immediate emergency care.';
    safetyWarnings.push(
      'Informational guidance only. Not a medical diagnosis. Confirm with a licensed physician.'
    );
  }

  if (isEmergency) {
    safetyWarnings.push(
      'POTENTIAL IMMEDIATE THREAT DETECTED: Do not wait for AI analysis. Initiate emergency protocol immediately.'
    );

    emergencyActions.push(
      {
        title: 'Call National Emergency 112 / Ambulance 108 Immediately',
        description:
          'Dial 112 from any mobile or landline across India (free call). Clearly state your exact landmark, nature of injury or threat, and number of affected individuals.',
        priority: 1,
        reason: 'Immediate professional dispatcher activation is essential for survival during emergencies.',
        humanConfirmationRequired: true,
        relevantSourceUrl: 'https://112.gov.in/'
      },
      {
        title: 'Ensure Scene Safety & Conservative First Aid',
        description:
          'Do not put yourself in danger. In road trauma, do not move an injured person unless there is immediate fire/submersion risk (to avoid spinal cord damage). If severe bleeding occurs, apply firm, continuous direct pressure with a clean cloth.',
        priority: 1,
        reason: 'Prevents worsening of catastrophic injuries while trained paramedics are en route.',
        humanConfirmationRequired: false,
        limitation: 'Apply only basic conservative stabilization; avoid administering unverified oral medications to an unconscious person.'
      }
    );

    emergencyResources.push(
      {
        name: 'National Emergency Response Support System (ERSS)',
        category: 'Emergency Dispatch',
        contact: '112',
        url: 'https://112.gov.in/',
        isOfficial: true,
        notes: '24x7 Unified emergency helpline for Police, Ambulance, Fire, and Disaster Response.',
        coverage: 'Pan-India'
      },
      {
        name: 'National Ambulance Emergency Service',
        category: 'Medical Transport',
        contact: '108',
        url: 'https://mohfw.gov.in/',
        isOfficial: true,
        notes: 'Emergency medical technician response and hospital triage transport.',
        coverage: 'All Participating States'
      },
      {
        name: 'National Disaster Helpline',
        category: 'Disaster Management',
        contact: '1070 / 1077',
        url: 'https://ndma.gov.in/',
        isOfficial: true,
        notes: 'State (1070) & District (1077) disaster emergency control rooms.',
        coverage: 'State Specific'
      }
    );

    return {
      isEmergencyDetected: true,
      forcedUrgency: 'emergency',
      emergencyActions,
      emergencyResources,
      safetyWarnings,
      medicalDisclaimer
    };
  }

  if (isElevated) {
    return {
      isEmergencyDetected: false,
      forcedUrgency: 'elevated',
      emergencyActions: [],
      emergencyResources: [],
      safetyWarnings,
      medicalDisclaimer
    };
  }

  return {
    isEmergencyDetected: false,
    emergencyActions: [],
    emergencyResources: [],
    safetyWarnings,
    medicalDisclaimer
  };
}
