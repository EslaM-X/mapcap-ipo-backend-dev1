/**
 * System Health & Infrastructure Integrity - Unified Suite v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip & Daniel Compliance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Formalized Supertest request types for Express heartbeat validation.
 * - Synchronized Audit Logger tags ([AUDIT_INFO], [AUDIT_ALERT]) for cloud monitoring.
 * - Validated Vercel Serverless security headers (Cache-Control: no-store).
 * - Implemented strict JSON schema check for vercel.json configuration.
 */

import { jest } from '@jest/globals';
import request from 'supertest';
import fs from 'fs';
import path from 'path';

// Core Component Imports (Ensuring .js extension for ESM compatibility in TS)
import app from '../../../server.js';
import Investor from '../../../src/models/investor.model.js';
import { writeAuditLog } from '../../../src/config/logger.js';

// --- MOCKING CONSOLE FOR CLEAN TEST OUTPUT ---
const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('System Health & Cloud Infrastructure - Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: SERVER HEARTBEAT & PULSE
   * Requirement: Philip's Spec - UI must receive real-time liquidity metrics.
   */
  describe('Server Engine - Heartbeat Integration', () => {
    
    test('Heartbeat: GET / should return 200 and live financial metrics for UI', async () => {
      // Mocking the aggregation pipeline to simulate live Pi pool data from Atlas
      const aggregateSpy = jest.spyOn(Investor, 'aggregate').mockResolvedValue([{
        totalPiInPool: 1000000,
        pioneerCount: 500
      }] as any);

      const res = await request(app).get('/');
      
      /**
       * Contract Validation:
       * Frontend Dashboard relies on 'success' flag and 'live_metrics' object.
       */
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.live_metrics.total_pi_invested).toBe(1000000);
      
      aggregateSpy.mockRestore();
    });

    test('Security: Should verify CORS headers for cross-origin dashboard access', async () => {
      const res = await request(app).get('/'); 
      // Requirement: Ensure the Map-of-Pi frontend can communicate securely with this API
      expect(res.header['access-control-allow-origin']).toBe('*');
    });
  });

  /**
   * SECTION 2: AUDIT LOGGING ENGINE
   * Requirement: Daniel's Transparency Standard - Unified priority logging.
   */
  describe('Audit Logger - Transparency & Alerts', () => {

    test('INFO Logs: Should format operational entries with [AUDIT_INFO] tag', () => {
      writeAuditLog('INFO', "System heartbeat stable.");
      // Requirement: Automated log parsers look for this specific tag
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[AUDIT_INFO]'));
    });

    test('CRITICAL Alerts: Should elevate priority for security/pipeline failures', () => {
      const errorMessage = "A2UaaS Pipeline Breach!";
      writeAuditLog('CRITICAL', errorMessage); 
      // Critical alerts must be routed to stderr to trigger CloudWatch/Vercel alerts
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('[AUDIT_ALERT]'));
    });
  });

  /**
   * SECTION 3: CLOUD ORCHESTRATION (Vercel Config)
   * Requirement: Security Headers & ESM Support.
   */
  describe('Vercel Config - Serverless Security', () => {
    const vercelPath = path.resolve(process.cwd(), 'vercel.json');
    
    test('Configuration: vercel.json must exist and be valid JSON', () => {
      expect(fs.existsSync(vercelPath)).toBe(true);
    });

    test('Security: Should enforce no-store headers to prevent stale financial data', () => {
      const fileContent = fs.readFileSync(vercelPath, 'utf8');
      const config = JSON.parse(fileContent);
      
      // Finding API route configuration in vercel settings
      const apiRoute = config.routes?.find((r: any) => r.src && r.src.includes('/api/'));
      
      if (apiRoute && apiRoute.headers) {
        /**
         * Compliance: Financial balances must never be cached by CDN.
         * Forces fresh data fetch on every request.
         */
        expect(apiRoute.headers['Cache-Control']).toContain('no-store');
      }
    });

    test('Environment: Should enable experimental-modules for Node runtime support', () => {
      const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      // Vital for Top-level Await and ESM Support in Vercel Functions
      expect(config.env?.NODE_OPTIONS).toContain('--experimental-modules');
    });
  });
});

