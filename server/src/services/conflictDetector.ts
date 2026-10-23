import { GoogleGenAI } from '@google/genai';
import { Conflict } from '../types/advanced.js';
import { GeminiStructuredResponse } from '../types/schema.js';

// Demo fixture for conflict detection (Demo 5)
export const CONFLICT_DEMO: Conflict[] = [
  {
    claimA: 'The current weather forecast for the coastal district indicates ORANGE alert with moderate flood risk through Thursday evening.',
    sourceA: 'India Meteorological Department (IMD) — Regional Forecast Centre',
    urlA: 'https://mausam.imd.gov.in/',
    timestampA: new Date().toISOString(),
    claimB: 'No active flood warning has been issued for this district. Water levels in reservoirs are within safe limits.',
    sourceB: 'State Water Resources Department — Press Release (2 days prior)',
    urlB: 'https://ndma.gov.in/',
    timestampB: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    explanation: 'The IMD forecast was issued after the State Water Resources press release. Rapidly deteriorating weather conditions over 48 hours changed the risk assessment. The IMD is the primary authoritative body for meteorological warnings, and their more recent data supersedes the earlier state assessment.',
    moreAuthoritativeSource: 'India Meteorological Department (IMD) — published more recently and is the statutory meteorological authority',
    resolved: false
  }
];

export class ConflictDetectorService {
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

  /**
   * Detects conflicts across verified sources in an analysis response.
   * Returns an array of detected conflicts (may be empty).
   */
  async detectConflicts(analysis: GeminiStructuredResponse): Promise<Conflict[]> {
    const sources = analysis.verifiedSources || [];
    if (sources.length < 2) return [];

    // Build a comparison prompt
    if (this.client) {
      try {
        const sourceSummaries = sources.map((s, i) =>
          `Source ${i + 1}: "${s.publisher}" — "${s.claimSupported}" (${s.isLive ? 'Live' : 'Static'}, Retrieved: ${s.retrievalTimestamp})`
        ).join('\n');

        const prompt = `You are a fact-checker comparing information sources for a public assistance platform.

Analyze these sources for conflicting claims. Return a JSON array of conflicts (empty array [] if none found).

Schema for each conflict:
{
  "claimA": string,
  "sourceA": string,
  "urlA": string,
  "timestampA": string,
  "claimB": string,
  "sourceB": string,
  "urlB": string,
  "timestampB": string,
  "explanation": string,
  "moreAuthoritativeSource": string or null,
  "resolved": boolean
}

<<<SOURCES>>>
${sourceSummaries}
<<<END_SOURCES>>>

Context: ${analysis.summary}`;

        const response = await this.client.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: { responseMimeType: 'application/json', temperature: 0.1 }
        });

        const raw = response.text?.trim() || '[]';
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as Conflict[];
        }
      } catch {
        // Fall through
      }
    }

    return [];
  }

  /**
   * Returns demo conflict data for Demo Scenario 5
   */
  getDemoConflicts(): Conflict[] {
    return CONFLICT_DEMO;
  }
}

export const defaultConflictDetector = new ConflictDetectorService();
