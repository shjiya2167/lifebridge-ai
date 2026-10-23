import { GeminiStructuredResponse } from '../types/schema.js';

export interface DemoScenario {
  id: string;
  name: string;
  badge: string;
  category: string;
  language: string;
  sampleInput: string;
  suggestedPrompt: string;
  hasAttachmentPreview: boolean;
  attachmentName?: string;
  attachmentType?: string;
  sampleResponse: GeminiStructuredResponse;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'scenario-a-medical',
    name: 'Scenario A: Medical Lab Report Explanation',
    badge: 'Health & Diagnostics',
    category: 'health',
    language: 'en',
    suggestedPrompt: 'Please explain this routine Complete Blood Count (CBC) and Lipid Profile report in plain English. What do these values mean, and what should I ask my doctor?',
    sampleInput: 'Fictional CBC & Lipid Report: Patient Age 48, Male. Haemoglobin: 11.2 g/dL (Ref: 13.5-17.5), Total Cholesterol: 242 mg/dL (Desirable < 200), LDL Cholesterol: 162 mg/dL (Optimal < 100), HDL: 38 mg/dL (Normal > 40), Platelet Count: 210,000 /mcL (Ref: 150k-450k). Notes: Patient reports mild afternoon fatigue.',
    hasAttachmentPreview: true,
    attachmentName: 'fictional_cbc_lipid_report.pdf',
    attachmentType: 'application/pdf',
    sampleResponse: {
      summary: 'Explanation of routine Complete Blood Count and Lipid Profile test values. Identified slightly low hemoglobin and elevated LDL/Total Cholesterol levels. This explanation is educational only and requires review by a licensed physician.',
      category: 'health',
      urgency: 'elevated',
      keyFacts: [
        'Patient reports mild fatigue; values are from a routine outpatient lab test.',
        'Haemoglobin is 11.2 g/dL, which is slightly below the standard adult male reference range (13.5 - 17.5 g/dL), indicating mild anemia.',
        'Total Cholesterol (242 mg/dL) and LDL "bad" cholesterol (162 mg/dL) are moderately elevated above recommended desirable limits.',
        'HDL "good" cholesterol (38 mg/dL) is marginally low.',
        'Platelet count (210,000 /mcL) is within normal reference limits (150,000 - 450,000 /mcL).'
      ],
      missingInformation: [
        'Previous baseline blood test reports for longitudinal comparison.',
        'Current medications or nutritional supplements (e.g., iron, statins).',
        'Fasting duration before blood collection (standard lipid test requires 10-12 hours fasting).'
      ],
      actions: [
        {
          title: 'Schedule In-Person Consultation with Primary Physician',
          description: 'Share these results with your general physician or internist to evaluate causes of mild anemia (such as dietary iron, vitamin B12, or occult loss) and discuss cholesterol management.',
          priority: 1,
          reason: 'Only a licensed physician who knows your clinical history can correlate blood markers with physical symptoms.',
          humanConfirmationRequired: true,
          relevantSourceUrl: 'https://mohfw.gov.in/'
        },
        {
          title: 'Prepare Target Questions for the Doctor Visit',
          description: 'Write down questions: "Does my mild anemia require dietary iron or oral supplementation?", "Do I need a repeat fasting lipid test or dietary modifications before considering medication?", "Could my fatigue relate to these markers?"',
          priority: 2,
          reason: 'Helps focus the clinical consultation and ensures clear mutual decisions.',
          humanConfirmationRequired: false
        },
        {
          title: 'Adopt Heart-Healthy Dietary Adjustments Pending Doctor Advice',
          description: 'Gradually increase fiber-rich foods (oats, legumes, green leafy vegetables), reduce saturated oils and fried items, and stay adequately hydrated.',
          priority: 3,
          reason: 'Non-pharmacological lifestyle interventions align with standard cardiovascular guidance.',
          humanConfirmationRequired: false
        }
      ],
      resources: [
        {
          name: 'Ministry of Health and Family Welfare (MoHFW) - National Health Portal',
          category: 'Health Information & Hospital Registry',
          contact: '1075 (National Health Helpline)',
          url: 'https://mohfw.gov.in/',
          isOfficial: true,
          notes: 'Provides verified health education articles, public hospital listings, and wellness initiatives.'
        },
        {
          name: 'AIIMS & ICMR Clinical Guidelines Portal',
          category: 'Medical Guidelines',
          url: 'https://www.icmr.gov.in/',
          isOfficial: true,
          notes: 'Standard evidence-based diagnostic reference standards for India.'
        }
      ],
      warnings: [
        'Non-Clinical AI Interpretation: This output does not constitute a medical diagnosis or prescription.',
        'Do not start, stop, or adjust prescription medications (e.g., statins or iron pills) without direct clinical supervision.'
      ],
      verificationStatus: 'verified',
      language: 'en',
      confidenceExplanation: 'High confidence on mathematical comparison of extracted numerical values against published ICMR/WHO standard reference brackets. Low clinical certainty on underlying etiology, requiring human physician evaluation.',
      medicalDisclaimer: 'IMPORTANT NOTICE: LifeBridge AI provides structured informational summaries only and is not a medical provider. No doctor-patient relationship is established. Always consult a certified healthcare professional.',
      verifiedSources: [
        {
          publisher: 'Indian Council of Medical Research (ICMR)',
          sourceTitle: 'Evidence-Based Diagnostic Protocols and Reference Standards',
          originalUrl: 'https://www.icmr.gov.in/',
          retrievalTimestamp: new Date().toISOString(),
          geographicCoverage: 'Pan-India Clinical Reference Guidelines',
          claimSupported: 'Reference brackets for adult hemoglobin and lipid profiles align with national standards.',
          verificationLimitations: 'Individual clinical significance depends on age, gender, cardiovascular risk history, and fasting state.',
          isLive: false
        }
      ],
      isSimulated: true
    }
  },
  {
    id: 'scenario-b-weather',
    name: 'Scenario B: Severe Rain & Urban Flood Emergency',
    badge: 'Weather & Disasters',
    category: 'weather',
    language: 'en',
    suggestedPrompt: 'I am stuck in heavy rain near low-lying waterlogged roads in Mumbai. Water is rising above knee level and traffic is stopped. What should I do right now to reach safety?',
    sampleInput: 'Heavy rain warning in low-lying area. Water level rising rapidly to knee height (approx 2 feet) on main arterial road. Ground floor shops closing. Power supply flickering. Several vehicles stalled in water.',
    hasAttachmentPreview: false,
    sampleResponse: {
      summary: 'Immediate guidance for urban waterlogging and rising floodwaters. Prioritizes pedestrian safety away from hidden drains and live electrical hazards, safe elevation, and official disaster control contacts.',
      category: 'weather',
      urgency: 'urgent',
      keyFacts: [
        'Rapidly rising water above knee level (2+ feet) makes walking hazardous and stalls motor vehicles.',
        'High risk of open manholes, submerged storm drains, and electrical leakage from roadside transformers or submerged poles.',
        'Vehicles trapped in deep water risk engine stall and rapid submergence.'
      ],
      missingInformation: [
        'Exact geographic coordinates or street junction name.',
        'Whether any individuals in the group have mobility limitations or medical conditions.',
        'Battery level of mobile phone.'
      ],
      actions: [
        {
          title: 'Seek Immediate High Ground Inside a Sturdy Multi-Storey Building',
          description: 'Move to the first floor or higher of a permanent concrete structure (e.g., railway station, commercial complex, public school). Do not attempt to wade across deep, moving water.',
          priority: 1,
          reason: 'Moving water of only 6 inches can knock down an adult; 2 feet can float vehicles and conceals open sewer hazards.',
          humanConfirmationRequired: false,
          relevantSourceUrl: 'https://ndma.gov.in/Resources/awareness/flood'
        },
        {
          title: 'Maintain Strict Distance from Electric Poles and Submerged Cables',
          description: 'Stay at least 15 feet away from street light posts, transformers, and sagging wires. If you feel a tingling sensation in water, immediately stop and move in the opposite direction.',
          priority: 1,
          reason: 'Electrocution is one of the leading causes of fatality during urban flooding.',
          humanConfirmationRequired: false
        },
        {
          title: 'Do Not Attempt to Drive or Restart Stalled Vehicles in Water',
          description: 'If your car stalls in rising water, abandon the vehicle immediately and walk to higher ground. Do not crank the engine (causes hydrostatic engine lock).',
          priority: 2,
          reason: 'Vehicles can become buoyant traps if water levels rise suddenly.',
          humanConfirmationRequired: false
        },
        {
          title: 'Call Municipal Disaster Control Room & Share GPS Location with Family',
          description: 'Contact 1916 (BMC Disaster Control Room for Mumbai) or State Disaster Management (1070 / 1077). Send a brief WhatsApp/SMS live location pin to immediate relatives.',
          priority: 2,
          reason: 'Enables rescue teams to log distress coordinates before mobile battery depletes.',
          humanConfirmationRequired: true,
          relevantSourceUrl: 'https://ndma.gov.in/'
        }
      ],
      resources: [
        {
          name: 'State Disaster Management Control Room',
          category: 'Disaster Emergency',
          contact: '1070 (State) / 1077 (District)',
          url: 'https://ndma.gov.in/',
          isOfficial: true,
          notes: 'Toll-free disaster assistance and water rescue deployment coordination.',
          coverage: 'All Districts'
        },
        {
          name: 'National Emergency Response Support System',
          category: 'Emergency Dispatch',
          contact: '112',
          url: 'https://112.gov.in/',
          isOfficial: true,
          notes: 'Unified 24x7 emergency helpline for Police, Fire, and Ambulance.',
          coverage: 'National'
        },
        {
          name: 'India Meteorological Department (IMD) Live Radar',
          category: 'Weather Alerts',
          url: 'https://mausam.imd.gov.in/',
          isOfficial: true,
          notes: 'Real-time rainfall nowcasts and color-coded district alert updates.',
          coverage: 'All India'
        }
      ],
      warnings: [
        'Do not walk through moving floodwater unless necessary for immediate life preservation.',
        'Never touch electrical switches, submerged power boxes, or fallen wires.',
        'Boil or purify tap water once safe, as floodwaters contaminate municipal pipelines.'
      ],
      verificationStatus: 'verified',
      language: 'en',
      confidenceExplanation: 'High confidence on safety protocols corroborated by NDMA and IMD standard operating procedures. Real-time water depth and local drainage status must be visually confirmed on-site.',
      verifiedSources: [
        {
          publisher: 'India Meteorological Department (IMD)',
          sourceTitle: 'National Weather Forecasting & Heavy Rainfall Alerts Portal',
          originalUrl: 'https://mausam.imd.gov.in/',
          retrievalTimestamp: new Date().toISOString(),
          geographicCoverage: 'All India',
          claimSupported: 'Official meteorological rainfall advisories and flood warnings.',
          verificationLimitations: 'Micro-localized drainage blockage requires ground confirmation by municipal corporations.',
          isLive: true
        },
        {
          publisher: 'National Disaster Management Authority (NDMA)',
          sourceTitle: 'Official Flood and Urban Deluge Safety Guidelines',
          originalUrl: 'https://ndma.gov.in/Resources/awareness/flood',
          retrievalTimestamp: new Date().toISOString(),
          geographicCoverage: 'India',
          claimSupported: 'Authoritative dos and don\'ts during heavy urban flooding and electrical hazards.',
          verificationLimitations: 'Evacuation centers are designated locally by district authorities.',
          isLive: false
        }
      ],
      isSimulated: true
    }
  },
  {
    id: 'scenario-c-accident',
    name: 'Scenario C: Highway Road Accident Triage',
    badge: 'Immediate Safety',
    category: 'traffic',
    language: 'en',
    suggestedPrompt: 'Two vehicles collided on the highway near milestone 42. One passenger has head injury and bleeding from leg, driver is trapped. What do we do before ambulance arrives?',
    sampleInput: 'Highway collision between passenger car and utility truck. Two victims: 1 driver trapped by crushed door but conscious; 1 passenger on roadside with bleeding leg laceration and head bump. Traffic moving fast around the wreck. No police or ambulance on scene yet.',
    hasAttachmentPreview: false,
    sampleResponse: {
      summary: 'Emergency trauma and scene safety response for highway collision. Focuses on immediate 112/108 dispatch, hazard warning protection to prevent secondary pile-up, and conservative bleeding control without moving suspected spinal trauma.',
      category: 'traffic',
      urgency: 'emergency',
      keyFacts: [
        'Multi-vehicle collision on active highway with trapped driver and bleeding passenger.',
        'High risk of secondary collision from oncoming fast-moving traffic.',
        'Golden Hour care priority: Professional trauma dispatch is required within the first 60 minutes.',
        'Good Samaritan Protection: Under MoRTH and Supreme Court guidelines, citizens aiding accident victims are legally protected from police harassment or medical liability.'
      ],
      missingInformation: [
        'Exact highway number, kilometer stone marker, or nearest toll plaza.',
        'Whether there is fuel leakage or risk of fire from ruptured tanks.',
        'Breathing rate and conscious orientation of both victims.'
      ],
      actions: [
        {
          title: 'Dial 112 / 108 Immediately for Highway Ambulance & Police Patrol',
          description: 'Call 112 (or 1033 for National Highway Helpline). State: "Highway accident with 2 casualties and 1 trapped person". Give nearest milestone or highway name.',
          priority: 1,
          reason: 'Trauma team dispatch is the single most vital determinant of survival in high-velocity crashes.',
          humanConfirmationRequired: true,
          relevantSourceUrl: 'https://112.gov.in/'
        },
        {
          title: 'Secure the Crash Scene to Prevent Secondary Accidents',
          description: 'Turn on vehicle hazard warning blinkers. Place reflective emergency triangles or visible markers at least 50 meters back up the highway. Do not stand in active traffic lanes.',
          priority: 1,
          reason: 'Secondary impacts into stationary crash scenes cause up to 30% of highway fatalities.',
          humanConfirmationRequired: false,
          relevantSourceUrl: 'https://morth.nic.in/'
        },
        {
          title: 'Control Severe Bleeding with Direct Pressure',
          description: 'Press firmly on the bleeding leg wound using a clean cloth or sterile dressing. Maintain continuous pressure without lifting the cloth to check. Elevate the leg slightly if no fracture is suspected.',
          priority: 1,
          reason: 'Rapid arterial or venous blood loss can lead to hypovolemic shock within minutes.',
          humanConfirmationRequired: false
        },
        {
          title: 'DO NOT Move the Trapped Driver Unless Imminent Fire Threatens',
          description: 'Keep the driver calm, still, and supported in place. Do not yank or wrench the neck or back, as unstable cervical spine fractures can lead to permanent paralysis.',
          priority: 1,
          reason: 'Suspected spinal injuries require professional cervical collar and backboard extrication.',
          humanConfirmationRequired: false,
          limitation: 'Move only if vehicle catches fire or fuel leak poses imminent explosion risk.'
        }
      ],
      resources: [
        {
          name: 'National Emergency Helpline (ERSS)',
          category: 'Emergency Dispatch',
          contact: '112',
          url: 'https://112.gov.in/',
          isOfficial: true,
          notes: 'Immediate dispatch for highway police patrol and emergency ambulance.'
        },
        {
          name: 'NHAI National Highway Emergency Helpline',
          category: 'Highway Patrol',
          contact: '1033',
          url: 'https://morth.nic.in/',
          isOfficial: true,
          notes: 'Toll-free emergency helpline for assistance on National Highways across India.'
        },
        {
          name: 'Emergency Medical Ambulance Service',
          category: 'Trauma Transport',
          contact: '108',
          isOfficial: true,
          notes: 'Advanced Life Support (ALS) and Basic Life Support (BLS) ambulances.'
        }
      ],
      warnings: [
        'EMERGENCY TRAUMA PROTOCOL ACTIVE: Call 112 immediately.',
        'Never remove a helmet from an unconscious motorcyclist unless trained in two-person spinal immobilization.',
        'Good Samaritan Law applies: You will not be detained, pressured for money, or forced to become a police witness.'
      ],
      verificationStatus: 'verified',
      language: 'en',
      confidenceExplanation: 'High certainty on statutory Good Samaritan rights and conservative trauma first-aid steps based on MoRTH regulations and WHO Emergency Care guidelines.',
      verifiedSources: [
        {
          publisher: 'Ministry of Road Transport and Highways (MoRTH)',
          sourceTitle: 'Good Samaritan Protection Guidelines & Golden Hour Care Guidelines',
          originalUrl: 'https://morth.nic.in/',
          retrievalTimestamp: new Date().toISOString(),
          geographicCoverage: 'All India Motor Vehicle Act Jurisdiction',
          claimSupported: 'Protects citizens aiding victims; mandates emergency care without police delay.',
          verificationLimitations: 'Response times depend on distance from nearest highway patrol base.',
          isLive: false
        },
        {
          publisher: 'Ministry of Home Affairs - ERSS 112',
          sourceTitle: 'Unified National Emergency Helpline',
          originalUrl: 'https://112.gov.in/',
          retrievalTimestamp: new Date().toISOString(),
          geographicCoverage: 'All 36 States and UTs',
          claimSupported: 'Integrates Police and Ambulance dispatch.',
          verificationLimitations: 'Requires network coverage to connect call.',
          isLive: true
        }
      ],
      isSimulated: true
    }
  },
  {
    id: 'scenario-d-public-services',
    name: 'Scenario D: Ayushman Bharat & Government Welfare Services',
    badge: 'Public Services',
    category: 'public_services',
    language: 'en',
    suggestedPrompt: 'How can an elderly low-income relative find out if they are eligible for the Ayushman Bharat PM-JAY 5 lakh health card, and what documents are required?',
    sampleInput: 'Query regarding Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB PM-JAY). Relative is 68 years old, rural household, holds an active NFSA ration card and Aadhaar card. Wants to know eligibility check steps, required documentation, and nearest enrollment center.',
    hasAttachmentPreview: false,
    sampleResponse: {
      summary: 'Comprehensive eligibility verification and application pathway for Ayushman Bharat (AB PM-JAY) health insurance and Senior Citizen expansion (70+ years universal coverage). Identifies online check portals, documentation requirements, and local CSC enrollment.',
      category: 'public_services',
      urgency: 'routine',
      keyFacts: [
        'AB PM-JAY provides cashless secondary and tertiary hospitalization cover up to ₹5 lakh per eligible family per year.',
        'Eligibility is primarily based on SECC 2011 deprivation criteria or active NFSA ration card listing.',
        'Recent Union Government expansion provides universal ₹5 lakh top-up health coverage for all senior citizens aged 70 and above, regardless of income.',
        'Enrollment is free through designated Common Service Centers (CSC) and Ayushman Mitra desks at empanelled public/private hospitals.'
      ],
      missingInformation: [
        'Exact age verification (whether 70+ years or between 60-69).',
        'State of residence (some states operate unified state health schemes like PM-JAY Mukhyamantri Amrutam, Mahatma Jyotirao Phule Jan Arogya Yojana, etc.).'
      ],
      actions: [
        {
          title: 'Verify Eligibility Online on the Official "Am I Eligible" Portal',
          description: 'Visit the official beneficiary portal (beneficiary.nha.gov.in) or dial 14555. Enter your registered mobile number and search using Ration Card Number or Aadhaar Number.',
          priority: 1,
          reason: 'Verifies whether the family is pre-seeded in the national beneficiary database before visiting centers.',
          humanConfirmationRequired: false,
          relevantSourceUrl: 'https://beneficiary.nha.gov.in/'
        },
        {
          title: 'Gather Mandatory Documentation',
          description: 'Keep ready: (1) Aadhaar Card with active mobile link for OTP e-KYC, (2) Active Ration Card (NFSA) showing family composition, (3) Recent passport photo.',
          priority: 2,
          reason: 'Incomplete documentation or unlinked mobile numbers cause e-KYC authentication failures at centers.',
          humanConfirmationRequired: false
        },
        {
          title: 'Visit Nearest Common Service Center (CSC) or Empanelled Public Hospital',
          description: 'Go to your nearest Gram Panchayat CSC center or government district hospital Ayushman Mitra kiosk. The representative conducts biometric e-KYC and prints the Ayushman Card free of charge.',
          priority: 3,
          reason: 'Provides on-the-spot biometric verification if Aadhaar mobile OTP is not functioning.',
          humanConfirmationRequired: true,
          relevantSourceUrl: 'https://pmjay.gov.in/'
        }
      ],
      resources: [
        {
          name: 'National Health Authority - Beneficiary Portal',
          category: 'Government Health Portal',
          contact: '14555 (Toll Free Helpline)',
          url: 'https://pmjay.gov.in/',
          isOfficial: true,
          notes: 'Official platform to check eligibility, generate card, and find empanelled hospitals.',
          coverage: 'All Participating States'
        },
        {
          name: 'National Portal of India Services Directory',
          category: 'Public Welfare Directory',
          url: 'https://www.india.gov.in/my-government/schemes',
          isOfficial: true,
          notes: 'Directory of central and state welfare benefits and application procedures.'
        }
      ],
      warnings: [
        'Beware of fraudulent third-party agents: Government Ayushman Card creation is completely FREE of cost at official kiosks.',
        'Never share OTP or biometric details with unauthorized persons or unverified websites.'
      ],
      verificationStatus: 'verified',
      language: 'en',
      confidenceExplanation: 'High factual certainty based on published guidelines from the National Health Authority (NHA) and Ministry of Health & Family Welfare.',
      verifiedSources: [
        {
          publisher: 'National Health Authority (NHA)',
          sourceTitle: 'Ayushman Bharat PM-JAY Beneficiary Guidelines & Empanelment Standards',
          originalUrl: 'https://pmjay.gov.in/',
          retrievalTimestamp: new Date().toISOString(),
          geographicCoverage: 'Pan-India',
          claimSupported: 'Confirms ₹5 lakh annual cover, free e-KYC issuance, and 14555 helpline.',
          verificationLimitations: 'Hospital network list updates dynamically; check active hospital empanelment prior to elective procedures.',
          isLive: true
        },
        {
          publisher: 'National Portal of India',
          sourceTitle: 'Single Window Government Services Directory',
          originalUrl: 'https://www.india.gov.in/my-government/schemes',
          retrievalTimestamp: new Date().toISOString(),
          geographicCoverage: 'Central & State Government',
          claimSupported: 'Verified public scheme listings.',
          verificationLimitations: 'State-specific health schemes may have additional criteria.',
          isLive: false
        }
      ],
      isSimulated: true
    }
  },
  {
    id: 'scenario-e-multilingual',
    name: 'Scenario E: Multilingual Voice / Hindi Consultation',
    badge: 'Regional Language (हिन्दी)',
    category: 'health',
    language: 'hi',
    suggestedPrompt: 'मेरी माताजी को अचानक चक्कर आ रहे हैं, पसीना आ रहा है और बीपी नापने पर 90/60 आया है। हमें क्या करना चाहिए?',
    sampleInput: 'आवाज संदेश / टेक्स्ट: "मेरी माताजी की उम्र 62 वर्ष है। उन्हें अचानक बहुत कमजोरी, चक्कर और ठंडा पसीना आ रहा है। घर पर बीपी मशीन में 90/60 रीडिंग आई है। क्या यह गंभीर है? हम क्या करें?"',
    hasAttachmentPreview: false,
    sampleResponse: {
      summary: 'बुजुर्ग महिला में अचानक कमजोरी, चक्कर, पसीना और निम्न रक्तचाप (हाइपोटेंशन 90/60) के संबंध में प्राथमिक मार्गदर्शन। यह स्थिति निर्जलीकरण या कार्डियक/न्यूरोलॉजिकल कारणों से हो सकती है। तत्काल प्राथमिक देखभाल और चिकित्सक परामर्श आवश्यक है।',
      category: 'health',
      urgency: 'urgent',
      keyFacts: [
        'मरीज की उम्र 62 वर्ष है और अचानक चक्कर, कमजोरी और ठंडा पसीना आने की शिकायत है।',
        'रक्तचाप (BP) 90/60 mmHg मापा गया है, जो सामान्य सीमा (120/80 mmHg) से काफी कम (निम्न रक्तचाप / Hypotension) है।',
        'अचानक बीपी गिरना और ठंडा पसीना आना निर्जलीकरण, दवाओं के दुष्प्रभाव या हृदय संबंधी स्थिति का संकेत हो सकता है।'
      ],
      missingInformation: [
        'क्या मरीज पहले से बीपी, मधुमेह (शुगर) या हृदय रोग की कोई दवा ले रही हैं?',
        'क्या उन्हें सीने में भारीपन, सांस फूलने या बेहोशी का अनुभव हुआ है?',
        'क्या उन्होंने पिछले कुछ घंटों में पर्याप्त पानी या भोजन लिया है?'
      ],
      actions: [
        {
          title: 'मरीज को तुरंत समतल बिस्तर पर लिटाएं और पैर थोड़े ऊंचे करें',
          description: 'मरीज को सीधे पीठ के बल लिटाएं और उनके पैरों के नीचे 1-2 तकिए रखकर पैरों को सिर के स्तर से थोड़ा ऊंचा (Trendelenburg position) रखें। टाइट कपड़े ढीले करें।',
          priority: 1,
          reason: 'पैरों को ऊपर उठाने से गुरुत्वाकर्षण के कारण रक्त का प्रवाह मस्तिष्क और हृदय की ओर बढ़ता है, जिससे चक्कर में तुरंत राहत मिलती है।',
          humanConfirmationRequired: false,
          relevantSourceUrl: 'https://mohfw.gov.in/'
        },
        {
          title: 'यदि मरीज पूरी तरह होश में हैं, तो ओआरएस (ORS) या हल्का नमक-चीनी पानी दें',
          description: 'यदि मरीज ठीक से बात कर रही हैं और निगलने में सक्षम हैं, तो 1 गिलास पानी में चुटकी भर नमक और चीनी या ओआरएस घोल पिलाएं। (ध्यान दें: बेहोश व्यक्ति को कभी भी मुंह से कुछ न पिलाएं)।',
          priority: 1,
          reason: 'यह रक्त की मात्रा (volume) और इलेक्ट्रोलाइट्स को सामान्य करने में मदद करता है।',
          humanConfirmationRequired: false
        },
        {
          title: 'लक्षण बने रहने पर नजदीकी क्लिनिक या 108 एम्बुलेंस से संपर्क करें',
          description: 'यदि 15-20 मिनट में बीपी सामान्य न हो, या सीने में भारीपन, उल्टी या अत्यधिक सुस्ती आए, तो तुरंत आपातकालीन नंबर 112 या 108 पर कॉल करें या नजदीकी अस्पताल ले जाएं।',
          priority: 1,
          reason: 'गंभीर हाइपोटेंशन में अंतर्निहित कारणों (जैसे ईसीजी जांच) की चिकित्सकीय जांच जरूरी है।',
          humanConfirmationRequired: true,
          relevantSourceUrl: 'https://112.gov.in/'
        }
      ],
      resources: [
        {
          name: 'राष्ट्रीय स्वास्थ्य हेल्पलाइन (MoHFW)',
          category: 'सरकारी स्वास्थ्य सेवा',
          contact: '1075 (टोल फ्री)',
          url: 'https://mohfw.gov.in/',
          isOfficial: true,
          notes: '24 घंटे निशुल्क स्वास्थ्य सलाह एवं नजदीकी स्वास्थ्य केंद्र जानकारी।'
        },
        {
          name: 'आपातकालीन एम्बुलेंस सेवा (ERSS)',
          category: 'इमरजेंसी मेडिकल सेवा',
          contact: '108 / 112',
          url: 'https://112.gov.in/',
          isOfficial: true,
          notes: 'गंभीर स्थिति में त्वरित एम्बुलेंस एवं प्राथमिक उपचार सहायता।'
        }
      ],
      warnings: [
        'महत्वपूर्ण चेतावनी: यह केवल प्राथमिक सूचनात्मक मार्गदर्शन है, कोई चिकित्सीय निदान या नुस्खा नहीं।',
        'यदि मरीज बेहोश हो जाए, तो मुंह में कोई तरल पदार्थ न डालें और तुरंत 112/108 डायल करें।'
      ],
      verificationStatus: 'verified',
      language: 'hi',
      confidenceExplanation: 'आईसीएमआर और स्वास्थ्य मंत्रालय के प्राथमिक चिकित्सा प्रोटोकॉल के आधार पर सुरक्षित व रूढ़िवादी सलाह। सटीक कारण जानने के लिए व्यक्तिगत डॉक्टर जांच अनिवार्य है।',
      medicalDisclaimer: 'महत्वपूर्ण सूचना: LifeBridge AI एक निर्णय-समर्थन सूचना मंच है। यह किसी प्रमाणित डॉक्टर का विकल्प नहीं है। गंभीर स्थिति में तुरंत योग्य चिकित्सक से संपर्क करें।',
      verifiedSources: [
        {
          publisher: 'Ministry of Health and Family Welfare (MoHFW)',
          sourceTitle: 'National Health Portal - Hypotension Protocol',
          originalUrl: 'https://mohfw.gov.in/',
          retrievalTimestamp: new Date().toISOString(),
          geographicCoverage: 'भारत',
          claimSupported: 'निम्न रक्तचाप प्राथमिक उपचार एवं एम्बुलेंस प्रोटोकॉल से सत्यापित।',
          verificationLimitations: 'व्यक्तिगत मेडिकल इतिहास के आधार पर बदलाव संभव है।',
          isLive: false
        }
      ],
      isSimulated: true
    }
  }
];

export function getDemoScenarioById(id: string): DemoScenario | undefined {
  return DEMO_SCENARIOS.find((s) => s.id === id);
}
