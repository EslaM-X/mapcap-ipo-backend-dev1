/**
 * System Health & Infrastructure Integrity - Unified Suite v1.7.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite validates the core infrastructure: Express orchestration, 
 * audit logging precision, and Vercel cloud configuration. It ensures 
 * high-availability, security headers, and immutable audit trails.
 * -------------------------------------------------------------------------
 */

import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { jest } from '@jest/globals';

// --- MOCKING & DYNAMIC IMPORTS ---
const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

// Importing core components
import app from '../../../server.js';
import Investor from '../../../src/models/investor.model.js';
const { writeAuditLog } = await import('../../../src/config/logger.js');

describe('System Health & Cloud Infrastructure - Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: SERVER HEARTBEAT & PULSE (Philip's Requirement)
   * Validates that the root API returns real-time liquidity metrics.
   *
   */
  describe('Server Engine - Heartbeat Integration', () => {
    
    test('Heartbeat: GET / should return 200 and live financial metrics for UI', async () => {
      const aggregateSpy = jest.spyOn(Investor, 'aggregate').mockResolvedValue([{
        totalPiInPool: 1000000,
        pioneerCount: 500
      }]);

      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.live_metrics.total_pi_invested).toBe(1000000);
      
      aggregateSpy.mockRestore();
    });

    test('Security: Should verify CORS headers for cross-origin dashboard access', async () => {
      const res = await request(app).get('/'); 
      // Requirement: Must allow the MapCap Dashboard to fetch data
      expect(res.header['access-control-allow-origin']).toBe('*');
    }, 15000);
  });

  /**
   * SECTION 2: AUDIT LOGGING ENGINE (Daniel's Standard)
   * Ensures every critical financial event is captured with correct priority.
   *
   */
  describe('Audit Logger - Transparency & Alerts', () => {

    test('INFO Logs: Should format operational entries with [AUDIT_INFO] tag', () => {
      writeAuditLog('INFO', "System heartbeat stable.");
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[AUDIT_INFO]'));
    });

    test('CRITICAL Alerts: Should elevate priority for security/pipeline failures', () => {
      const errorMessage = "A2UaaS Pipeline Breach!";
      writeAuditLog('CRITICAL', errorMessage); 
      // Requirement: Alerts must be routed to console.error
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('[AUDIT_ALERT]'));
    });
  });

  /**
   * SECTION 3: CLOUD ORCHESTRATION (Vercel Config)
   * Validates the serverless deployment rules and caching policies.
   *
   */
  describe('Vercel Config - Serverless Security', () => {
    const vercelPath = path.resolve(process.cwd(), 'vercel.json');
    const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));

    test('Security: Should enforce no-store headers to prevent stale financial data', () => {
      const apiRoute = config.routes.find(r => r.src.includes('/api/'));
      // Daniel's Requirement: Real-time Pi data must never be cached
      expect(apiRoute.headers['Cache-Control']).toContain('no-store');
    });

    test('Environment: Should enable experimental-modules for Node runtime support', () => {
      // Vital for ES6/ESM compatibility in the cloud
      expect(config.env.NODE_OPTIONS).toContain('--experimental-modules');
    });
  });
});

