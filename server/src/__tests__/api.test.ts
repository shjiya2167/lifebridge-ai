import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index.js';

describe('LifeBridge AI API Endpoints', () => {
  it('GET /api/health should report server status and health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toContain('LifeBridge AI');
  });

  it('GET /api/config should return safe public config and demo scenarios', async () => {
    const res = await request(app).get('/api/config');
    expect(res.status).toBe(200);
    expect(res.body.supportedLanguages).toBeInstanceOf(Array);
    expect(res.body.demoScenarios.length).toBe(5);
    expect(res.body.demoScenarios[0].id).toBe('scenario-a-medical');
  });

  it('POST /api/analyze should reject empty input with 400', async () => {
    const res = await request(app).post('/api/analyze').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Missing input');
  });

  it('POST /api/analyze with demoScenarioId should return structured analysis and session ID', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({ demoScenarioId: 'scenario-a-medical' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.sessionId).toBeDefined();
    expect(res.body.analysis).toBeDefined();
    expect(res.body.analysis.category).toBe('health');
    expect(res.body.analysis.actions).toBeInstanceOf(Array);
    expect(res.body.analysis.verifiedSources.length).toBeGreaterThan(0);
  });

  it('POST /api/verify should verify claims using authoritative providers', async () => {
    const res = await request(app)
      .post('/api/verify')
      .send({
        category: 'weather',
        queryText: 'heavy rain in Mumbai flood water level',
        keyFacts: ['water level 2 feet high']
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.verifiedSources.length).toBeGreaterThan(0);
    expect(res.body.verifiedSources.some((s: any) => s.originalUrl.includes('imd.gov.in'))).toBe(true);
  });

  it('GET /api/resources should return curated official directories', async () => {
    const res = await request(app).get('/api/resources?category=emergency');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.resources.length).toBeGreaterThan(0);
    expect(res.body.resources[0].contact).toBe('112');
  });
});
