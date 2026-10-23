import { GoogleGenAI } from '@google/genai';
import { GeminiStructuredResponse, GeminiStructuredResponseSchema } from '../types/schema.js';
import { sanitizeUntrustedInput } from './safetyRules.js';

export class FollowUpService {
  private client: GoogleGenAI | null = null;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    this.modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
    if (apiKey) {
      try { this.client = new GoogleGenAI({ apiKey }); } catch {}
    }
  }

  /**
   * Process a follow-up question using the original session context
   */
  async processFollowUp(
    originalAnalysis: GeminiStructuredResponse,
    followUpQuestion: string,
    language: string
  ): Promise<GeminiStructuredResponse> {
    const sanitized = sanitizeUntrustedInput(followUpQuestion);

    if (!this.client) {
      // Simulation: return a modified version of original with follow-up context
      return this.simulatedFollowUp(originalAnalysis, sanitized, language);
    }

    const systemInstruction = `You are LifeBridge AI processing a follow-up question about a previous analysis.
Use the original analysis context to answer the follow-up question accurately.
Keep the same JSON schema structure. Update actions and summary relevant to the new question.
Respond in language: ${language}.
Return ONLY valid JSON, no markdown.`;

    const originalContext = JSON.stringify({
      summary: originalAnalysis.summary,
      category: originalAnalysis.category,
      urgency: originalAnalysis.urgency,
      keyFacts: originalAnalysis.keyFacts,
      actions: originalAnalysis.actions.slice(0, 3)
    });

    const prompt = `<<<ORIGINAL_ANALYSIS_CONTEXT>>>
${originalContext}
<<<END_CONTEXT>>>

<<<FOLLOW_UP_QUESTION>>>
${sanitized}
<<<END_FOLLOW_UP_QUESTION>>>`;

    try {
      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: { systemInstruction, responseMimeType: 'application/json', temperature: 0.2 }
      });

      const raw = response.text?.trim() || '';
      const parsed = JSON.parse(raw);
      const validated = GeminiStructuredResponseSchema.parse(parsed);
      validated.isSimulated = false;
      return validated;
    } catch {
      return this.simulatedFollowUp(originalAnalysis, sanitized, language);
    }
  }

  private simulatedFollowUp(
    original: GeminiStructuredResponse,
    question: string,
    language: string
  ): GeminiStructuredResponse {
    return {
      ...original,
      summary: `Follow-up to your earlier ${original.category} inquiry: "${question.slice(0, 100)}". Based on your previous analysis context, here are updated insights.`,
      keyFacts: [
        `Follow-up question: ${question.slice(0, 120)}`,
        ...original.keyFacts.slice(0, 2),
        'Context from your original inquiry has been incorporated into this response.'
      ],
      actions: [
        {
          title: 'Review the follow-up information carefully',
          description: `Your question "${question.slice(0, 80)}..." relates to the existing ${original.category} analysis. The original actions remain valid. Consult an appropriate specialist for personalized guidance.`,
          priority: 1,
          reason: 'Follow-up questions often require nuanced professional input beyond AI-assisted summarization.',
          humanConfirmationRequired: true
        },
        ...original.actions.slice(0, 2)
      ],
      warnings: [
        'Follow-up context is based on your earlier session; new information may change recommendations.',
        ...original.warnings.slice(0, 1)
      ],
      confidenceExplanation: 'Follow-up response generated using original session context. Simulation mode active — provide GEMINI_API_KEY for live contextual reasoning.',
      isSimulated: true,
      timestamp: new Date().toISOString(),
      language
    };
  }

  /**
   * Simplify a response to a requested reading level
   */
  async simplify(text: string, level: 'basic' | 'intermediate' | 'detailed', language: string): Promise<string> {
    const levelDesc = {
      basic: 'Use very simple words. Short sentences. Grade 5 reading level. Avoid technical jargon entirely.',
      intermediate: 'Use plain language accessible to a general adult. Explain technical terms when used.',
      detailed: 'Maintain technical accuracy. Include reasoning. Suitable for professionals.'
    }[level];

    if (!this.client) {
      // Simulation
      if (level === 'basic') {
        return `Simple explanation: ${text.slice(0, 200).replace(/technical|clinical|biochemistry|protocol/gi, 'health-related')}... (Connect GEMINI_API_KEY for full simplification)`;
      }
      return text;
    }

    try {
      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: `Rewrite the following text at the requested level. ${levelDesc}\nRespond in language: ${language}.\n\n<<<TEXT>>>\n${sanitizeUntrustedInput(text)}\n<<<END_TEXT>>>`,
        config: { temperature: 0.3 }
      });
      return response.text?.trim() || text;
    } catch {
      return text;
    }
  }
}

export const defaultFollowUpService = new FollowUpService();
