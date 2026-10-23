import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { defaultGeminiService, FileAttachment } from './services/geminiService.js';
import { defaultVerificationService } from './services/verificationService.js';
import { DEMO_SCENARIOS, getDemoScenarioById } from './services/demoFixtures.js';
import {
  SupportedLanguages,
  ProblemCategorySchema,
  VerificationRequestSchema,
  GeminiStructuredResponse
} from './types/schema.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Basic In-Memory Privacy-Conscious Session Store
interface SessionRecord {
  id: string;
  createdAt: string;
  inputExcerpt: string;
  category: string;
  urgency: string;
  language: string;
  analysis: GeminiStructuredResponse;
}
const sessionStore: Map<string, SessionRecord> = new Map();

// Configure Helmet Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible API usage alongside dev client
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// Configure CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during hackathon local testing
      }
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP address, please try again in a few minutes.'
  }
});
app.use('/api/', apiLimiter);

// Multer memory storage configuration (keeps files in RAM, never writes sensitive data to disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit per file
    files: 5 // Max 5 files
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'audio/wav',
      'audio/mpeg',
      'audio/webm',
      'audio/ogg',
      'audio/mp4',
      'audio/x-m4a',
      'application/pdf',
      'text/plain'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: Images, Audio, PDF, Text.`));
    }
  }
});

// GET /api/health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'LifeBridge AI Universal Public Assistance Backend',
    version: '1.0.0'
  });
});

// GET /api/config
app.get('/api/config', (_req: Request, res: Response) => {
  const isGeminiConfigured = defaultGeminiService.isLiveConfigured();
  res.json({
    isGeminiConfigured,
    model: defaultGeminiService.getModelName(),
    supportedLanguages: SupportedLanguages,
    categories: ['health', 'traffic', 'weather', 'disaster', 'public_services', 'general'],
    urgencyLevels: ['routine', 'elevated', 'urgent', 'emergency', 'unknown'],
    demoScenarios: DEMO_SCENARIOS.map((s) => ({
      id: s.id,
      name: s.name,
      badge: s.badge,
      category: s.category,
      language: s.language,
      suggestedPrompt: s.suggestedPrompt,
      hasAttachmentPreview: s.hasAttachmentPreview,
      attachmentName: s.attachmentName,
      attachmentType: s.attachmentType
    }))
  });
});

// POST /api/analyze
app.post(
  '/api/analyze',
  upload.array('files', 5),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const text = (req.body.text || '').toString();
      const language = (req.body.language || 'en').toString();
      const categoryHint = req.body.categoryHint ? req.body.categoryHint.toString() : undefined;
      const demoScenarioId = req.body.demoScenarioId ? req.body.demoScenarioId.toString() : undefined;

      // Check if user specifically requested a predefined demo scenario
      if (demoScenarioId) {
        const scenario = getDemoScenarioById(demoScenarioId);
        if (scenario) {
          const responsePayload = JSON.parse(JSON.stringify(scenario.sampleResponse));
          responsePayload.timestamp = new Date().toISOString();
          
          // Save in privacy-conscious session store
          const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
          sessionStore.set(sessionId, {
            id: sessionId,
            createdAt: new Date().toISOString(),
            inputExcerpt: scenario.suggestedPrompt,
            category: scenario.category,
            urgency: scenario.sampleResponse.urgency,
            language: scenario.language,
            analysis: responsePayload
          });

          res.json({
            success: true,
            sessionId,
            analysis: responsePayload
          });
          return;
        }
      }

      // Prepare attached files
      const attachedFiles: FileAttachment[] = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          attachedFiles.push({
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            buffer: file.buffer
          });
        }
      }

      if (!text.trim() && attachedFiles.length === 0) {
        res.status(400).json({
          error: 'Missing input: Please provide either descriptive text or an attached file (image/audio/PDF).'
        });
        return;
      }

      // Execute Gemini Analysis with Safety and Verification rules
      const analysisResult = await defaultGeminiService.analyze({
        text,
        language,
        categoryHint,
        files: attachedFiles
      });

      // Save privacy-conscious session
      const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      sessionStore.set(sessionId, {
        id: sessionId,
        createdAt: new Date().toISOString(),
        inputExcerpt: text ? text.slice(0, 100) : (attachedFiles[0]?.filename || 'Uploaded media file'),
        category: analysisResult.category,
        urgency: analysisResult.urgency,
        language: analysisResult.language,
        analysis: analysisResult
      });

      res.json({
        success: true,
        sessionId,
        analysis: analysisResult
      });
    } catch (err: any) {
      next(err);
    }
  }
);

// POST /api/verify
app.post('/api/verify', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parseResult = VerificationRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Invalid verification request parameters',
        details: parseResult.error.format()
      });
      return;
    }

    const { category, keyFacts, queryText } = parseResult.data;
    const verifiedSources = await defaultVerificationService.verifyClaims(category, queryText, keyFacts);

    res.json({
      success: true,
      category,
      verifiedCount: verifiedSources.length,
      verifiedSources
    });
  } catch (err: any) {
    next(err);
  }
});

// GET /api/resources
app.get('/api/resources', (_req: Request, res: Response) => {
  const category = _req.query.category as string | undefined;

  // Master curated directory of verified public services and emergency resources
  const masterResources = [
    {
      name: 'Emergency Response Support System (ERSS)',
      category: 'emergency',
      contact: '112',
      url: 'https://112.gov.in/',
      notes: 'All-in-one emergency helpline for Police, Ambulance, Fire, and Disaster rescue.',
      isOfficial: true,
      coverage: 'Pan-India (24x7)'
    },
    {
      name: 'National Ambulance Emergency Service',
      category: 'health',
      contact: '108',
      url: 'https://mohfw.gov.in/',
      notes: 'Emergency medical technician response and acute hospital dispatch.',
      isOfficial: true,
      coverage: 'All Participating States'
    },
    {
      name: 'India Meteorological Department (IMD)',
      category: 'weather',
      url: 'https://mausam.imd.gov.in/',
      notes: 'Official live radar, severe weather alerts, rainfall nowcasts, cyclone warnings.',
      isOfficial: true,
      coverage: 'All India'
    },
    {
      name: 'National Disaster Management Authority (NDMA)',
      category: 'disaster',
      contact: '1070 (State) / 1077 (District)',
      url: 'https://ndma.gov.in/',
      notes: 'Disaster safety guidelines, flood evacuation advisories, and relief control.',
      isOfficial: true,
      coverage: 'Pan-India'
    },
    {
      name: 'Ayushman Bharat PM-JAY National Health Portal',
      category: 'public_services',
      contact: '14555',
      url: 'https://pmjay.gov.in/',
      notes: 'Check eligibility for ₹5 lakh cashless hospitalization coverage & Senior Citizen scheme.',
      isOfficial: true,
      coverage: 'All Empanelled Hospitals'
    },
    {
      name: 'National Portal of India Schemes Registry',
      category: 'public_services',
      url: 'https://www.india.gov.in/my-government/schemes',
      notes: 'Directory of official central and state government public welfare programs.',
      isOfficial: true,
      coverage: 'Pan-India'
    },
    {
      name: 'National Highways Emergency Helpline',
      category: 'traffic',
      contact: '1033',
      url: 'https://morth.nic.in/',
      notes: 'Immediate assistance, crane/towing, and highway patrol on National Highways.',
      isOfficial: true,
      coverage: 'All National Highways'
    },
    {
      name: 'National Health Helpline (MoHFW)',
      category: 'health',
      contact: '1075',
      url: 'https://mohfw.gov.in/',
      notes: 'General health guidance, public hospital referrals, and immunization info.',
      isOfficial: true,
      coverage: 'All India'
    }
  ];

  let filtered = masterResources;
  if (category && category !== 'all') {
    filtered = masterResources.filter((r) => r.category === category);
  }

  res.json({
    success: true,
    count: filtered.length,
    resources: filtered
  });
});

// GET /api/history
app.get('/api/history', (_req: Request, res: Response) => {
  const sessions = Array.from(sessionStore.values()).map((s) => ({
    id: s.id,
    createdAt: s.createdAt,
    inputExcerpt: s.inputExcerpt,
    category: s.category,
    urgency: s.urgency,
    language: s.language
  }));
  res.json({
    success: true,
    sessions: sessions.reverse()
  });
});

// GET /api/history/:id
app.get('/api/history/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const session = sessionStore.get(id);
  if (!session) {
    res.status(404).json({ error: 'Session not found or expired from memory' });
    return;
  }
  res.json({
    success: true,
    session
  });
});

// DELETE /api/history/:id
app.delete('/api/history/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const existed = sessionStore.delete(id);
  res.json({
    success: true,
    deleted: existed
  });
});

// DELETE /api/history
app.delete('/api/history', (_req: Request, res: Response) => {
  sessionStore.clear();
  res.json({
    success: true,
    message: 'All session history cleared from memory'
  });
});

// Centralized Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ServerError]', err?.message || err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'An internal server error occurred while processing your request.',
    type: err.name || 'ServerError'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`  LifeBridge AI Server listening on port ${PORT}`);
  console.log(`  Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Live Gemini API: ${defaultGeminiService.isLiveConfigured() ? 'YES' : 'NO (Simulation Engine Active)'}`);
  console.log(`===================================================`);
});

export default app;
