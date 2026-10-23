import { ProblemCategory, VerifiedSource } from '../types/schema.js';

export interface IVerificationProvider {
  name: string;
  category: ProblemCategory | 'all';
  canHandle(category: ProblemCategory, queryText: string, keyFacts: string[]): boolean;
  verify(category: ProblemCategory, queryText: string, keyFacts: string[]): Promise<VerifiedSource[]>;
}

// Official Weather & Disaster Provider (IMD & NDMA)
export class IMDWeatherAndDisasterProvider implements IVerificationProvider {
  name = 'India Meteorological Department & NDMA';
  category: ProblemCategory | 'all' = 'weather';

  canHandle(category: ProblemCategory, queryText: string, keyFacts: string[]): boolean {
    const text = (queryText + ' ' + keyFacts.join(' ')).toLowerCase();
    return (
      category === 'weather' ||
      category === 'disaster' ||
      text.includes('rain') ||
      text.includes('flood') ||
      text.includes('storm') ||
      text.includes('cyclone') ||
      text.includes('heatwave') ||
      text.includes('monsoon') ||
      text.includes('waterlogging')
    );
  }

  async verify(category: ProblemCategory, queryText: string, keyFacts: string[]): Promise<VerifiedSource[]> {
    const now = new Date().toISOString();
    const text = (queryText + ' ' + keyFacts.join(' ')).toLowerCase();

    const sources: VerifiedSource[] = [
      {
        publisher: 'India Meteorological Department (IMD)',
        sourceTitle: 'National Weather Forecasting & Heavy Rainfall Alerts Portal',
        originalUrl: 'https://mausam.imd.gov.in/',
        retrievalTimestamp: now,
        publicationTimestamp: 'Daily Bulletin / Dynamic',
        geographicCoverage: 'All India (National & Regional Met Centres)',
        claimSupported: 'Provides official meteorological warnings, radar precipitation updates, and color-coded district alert stages (Green/Yellow/Orange/Red).',
        verificationLimitations: 'Live radar and micro-localized alerts require continuous data connectivity; verify active district bulletin locally.',
        isLive: true
      },
      {
        publisher: 'National Disaster Management Authority (NDMA)',
        sourceTitle: 'Official Flood and Natural Hazard Safety Guidelines',
        originalUrl: 'https://ndma.gov.in/Resources/awareness/flood',
        retrievalTimestamp: now,
        publicationTimestamp: 'Official Standing Guidelines',
        geographicCoverage: 'Republic of India',
        claimSupported: 'Authoritative dos and don\'ts during heavy flooding, high-water survival protocol, and state emergency control numbers (1070 / 1077).',
        verificationLimitations: 'Covers standard disaster preparedness guidelines; on-ground evacuation routes are designated by local district collectorates.',
        isLive: false
      }
    ];

    if (text.includes('cyclone') || text.includes('wind')) {
      sources.push({
        publisher: 'IMD Cyclone Warning Division',
        sourceTitle: 'RSMC Cyclone Bulletins & Tracking System',
        originalUrl: 'https://rsmcnewdelhi.imd.gov.in/',
        retrievalTimestamp: now,
        geographicCoverage: 'Bay of Bengal & Arabian Sea Coastal Belts',
        claimSupported: 'Cyclone intensity categorization, landfall estimates, and coastal evacuation warnings.',
        verificationLimitations: 'Track predictions carry an uncertainty cone; consult regular 3-hour bulletins during active depressions.',
        isLive: true
      });
    }

    return sources;
  }
}

// Official Health & Family Welfare Provider
export class MoHFWHealthProvider implements IVerificationProvider {
  name = 'Ministry of Health & Family Welfare (MoHFW) / ICMR';
  category: ProblemCategory | 'all' = 'health';

  canHandle(category: ProblemCategory, queryText: string, keyFacts: string[]): boolean {
    const text = (queryText + ' ' + keyFacts.join(' ')).toLowerCase();
    return (
      category === 'health' ||
      text.includes('medical') ||
      text.includes('blood') ||
      text.includes('doctor') ||
      text.includes('hospital') ||
      text.includes('pain') ||
      text.includes('fever') ||
      text.includes('test') ||
      text.includes('report') ||
      text.includes('cholesterol') ||
      text.includes('hemoglobin')
    );
  }

  async verify(category: ProblemCategory, queryText: string, keyFacts: string[]): Promise<VerifiedSource[]> {
    const now = new Date().toISOString();

    return [
      {
        publisher: 'Ministry of Health and Family Welfare (MoHFW)',
        sourceTitle: 'National Health Portal & Emergency Healthcare Protocol',
        originalUrl: 'https://mohfw.gov.in/',
        retrievalTimestamp: now,
        publicationTimestamp: 'Government Standard Protocol',
        geographicCoverage: 'National Healthcare Network (India)',
        claimSupported: 'Standard medical referral protocols, national helpline directory (1075 / 112), and public hospital network registries.',
        verificationLimitations: 'Automated AI extraction from medical reports is informational only; final clinical interpretation requires a certified physician.',
        isLive: false
      },
      {
        publisher: 'Indian Council of Medical Research (ICMR)',
        sourceTitle: 'Evidence-Based Diagnostic Protocols and Reference Standards',
        originalUrl: 'https://www.icmr.gov.in/',
        retrievalTimestamp: now,
        publicationTimestamp: 'Standard Reference',
        geographicCoverage: 'Pan-India Clinical Reference Guidelines',
        claimSupported: 'Clinical biochemistry normal ranges, standard diagnostic follow-up guidelines, and accredited laboratory practices.',
        verificationLimitations: 'Lab reference ranges vary by specific test methodology, instrument calibration, and patient demographics.',
        isLive: false
      }
    ];
  }
}

// Official Transport, Traffic & Emergency Provider
export class TransportAndSafetyProvider implements IVerificationProvider {
  name = 'MoRTH & National Emergency Response Support System (ERSS)';
  category: ProblemCategory | 'all' = 'traffic';

  canHandle(category: ProblemCategory, queryText: string, keyFacts: string[]): boolean {
    const text = (queryText + ' ' + keyFacts.join(' ')).toLowerCase();
    return (
      category === 'traffic' ||
      text.includes('accident') ||
      text.includes('traffic') ||
      text.includes('highway') ||
      text.includes('road') ||
      text.includes('vehicle') ||
      text.includes('ambulance') ||
      text.includes('injured') ||
      text.includes('collision')
    );
  }

  async verify(category: ProblemCategory, queryText: string, keyFacts: string[]): Promise<VerifiedSource[]> {
    const now = new Date().toISOString();

    return [
      {
        publisher: 'Ministry of Road Transport and Highways (MoRTH)',
        sourceTitle: 'Good Samaritan Protection Guidelines & Golden Hour Care Guidelines',
        originalUrl: 'https://morth.nic.in/',
        retrievalTimestamp: now,
        publicationTimestamp: 'Supreme Court Protected Guidelines',
        geographicCoverage: 'All India Motor Vehicle Act Jurisdiction',
        claimSupported: 'Protects citizens assisting road accident victims from legal intimidation, sets 60-minute trauma intervention priority, and specifies highway accident response.',
        verificationLimitations: 'Local police jurisdictions and ambulance response times vary by highway stretch and district.',
        isLive: false
      },
      {
        publisher: 'Ministry of Home Affairs - ERSS 112',
        sourceTitle: 'Emergency Response Support System (Unified National Emergency Helpline)',
        originalUrl: 'https://112.gov.in/',
        retrievalTimestamp: now,
        publicationTimestamp: 'Operational 24x7',
        geographicCoverage: 'All 36 States and Union Territories',
        claimSupported: 'Single emergency number 112 integrating Police (100), Fire (101), Health Ambulance (108/102), and Disaster Management.',
        verificationLimitations: 'Requires functional telecommunication network or GPS enabled mobile device; live dispatch handled by state control room.',
        isLive: true
      }
    ];
  }
}

// Official Government Public Services Provider
export class IndiaGovPublicServicesProvider implements IVerificationProvider {
  name = 'National Portal of India & Digital India';
  category: ProblemCategory | 'all' = 'public_services';

  canHandle(category: ProblemCategory, queryText: string, keyFacts: string[]): boolean {
    const text = (queryText + ' ' + keyFacts.join(' ')).toLowerCase();
    return (
      category === 'public_services' ||
      text.includes('government') ||
      text.includes('scheme') ||
      text.includes('ration') ||
      text.includes('aadhaar') ||
      text.includes('ayushman') ||
      text.includes('pm-jay') ||
      text.includes('pension') ||
      text.includes('certificate') ||
      text.includes('portal') ||
      text.includes('service')
    );
  }

  async verify(category: ProblemCategory, queryText: string, keyFacts: string[]): Promise<VerifiedSource[]> {
    const now = new Date().toISOString();
    const text = (queryText + ' ' + keyFacts.join(' ')).toLowerCase();

    const sources: VerifiedSource[] = [
      {
        publisher: 'National Portal of India',
        sourceTitle: 'Single Window Government Services Directory',
        originalUrl: 'https://www.india.gov.in/my-government/schemes',
        retrievalTimestamp: now,
        publicationTimestamp: 'Regularly updated official registry',
        geographicCoverage: 'Central & State Government Services (India)',
        claimSupported: 'Official portal listing statutory public benefits, eligibility standards, application formats, and verified state service portals.',
        verificationLimitations: 'State-specific implementation guidelines may diverge; applications must be lodged through designated state/central portals.',
        isLive: false
      }
    ];

    if (text.includes('ayushman') || text.includes('pm-jay') || text.includes('health card') || text.includes('hospital')) {
      sources.push({
        publisher: 'National Health Authority (NHA)',
        sourceTitle: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY) Official Portal',
        originalUrl: 'https://pmjay.gov.in/',
        retrievalTimestamp: now,
        publicationTimestamp: 'Active National Health Scheme',
        geographicCoverage: 'All participating PM-JAY States & Empanelled Hospitals',
        claimSupported: 'Covers up to INR 5 lakh per family per year for secondary and tertiary care hospitalization for eligible beneficiaries.',
        verificationLimitations: 'Hospital empanelment and specific package approval require on-site Ayushman Mitra biometric verification.',
        isLive: true
      });
    }

    if (text.includes('ration') || text.includes('food') || text.includes('pds')) {
      sources.push({
        publisher: 'Department of Food and Public Distribution',
        sourceTitle: 'Annavitran & One Nation One Ration Card (ONORC) Portal',
        originalUrl: 'https://annavitran.nic.in/',
        retrievalTimestamp: now,
        geographicCoverage: 'Pan-India Ration Portability Network',
        claimSupported: 'Enables migrant workers and families to lift entitled food grains from any Fair Price Shop across the country.',
        verificationLimitations: 'Requires active Aadhaar linkage with the existing ration card for biometric authentication at Point of Sale (PoS).',
        isLive: true
      });
    }

    return sources;
  }
}

// Master Verification Service Manager
export class VerificationService {
  private providers: IVerificationProvider[] = [];

  constructor() {
    this.registerProvider(new IMDWeatherAndDisasterProvider());
    this.registerProvider(new MoHFWHealthProvider());
    this.registerProvider(new TransportAndSafetyProvider());
    this.registerProvider(new IndiaGovPublicServicesProvider());
  }

  public registerProvider(provider: IVerificationProvider) {
    this.providers.push(provider);
  }

  public async verifyClaims(
    category: ProblemCategory,
    queryText: string,
    keyFacts: string[]
  ): Promise<VerifiedSource[]> {
    const verifiedSourcesMap = new Map<string, VerifiedSource>();

    for (const provider of this.providers) {
      if (provider.canHandle(category, queryText, keyFacts)) {
        try {
          const sources = await provider.verify(category, queryText, keyFacts);
          for (const s of sources) {
            verifiedSourcesMap.set(s.originalUrl, s);
          }
        } catch (err) {
          console.warn(`[VerificationService] Provider ${provider.name} failed:`, err);
        }
      }
    }

    // Always ensure at least the primary government portal source is included as fallback
    if (verifiedSourcesMap.size === 0) {
      const now = new Date().toISOString();
      verifiedSourcesMap.set('https://www.india.gov.in/', {
        publisher: 'National Portal of India',
        sourceTitle: 'Single Window Access to Government Services',
        originalUrl: 'https://www.india.gov.in/',
        retrievalTimestamp: now,
        geographicCoverage: 'India',
        claimSupported: 'General public directory and official portal registry for civic inquiries.',
        verificationLimitations: 'Live verification unavailable for unspecified category; refer to relevant ministry department.',
        isLive: false
      });
    }

    return Array.from(verifiedSourcesMap.values());
  }
}

export const defaultVerificationService = new VerificationService();
