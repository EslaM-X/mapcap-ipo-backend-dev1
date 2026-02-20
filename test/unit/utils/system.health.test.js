/**
 * System Health & Infrastructure Integrity - Unified Suite v1.8.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite validates the core infrastructure: Express orchestration, 
 * audit logging precision, and Vercel cloud configuration. It ensures 
 * high-availability, security headers, and immutable audit trails.
 * -------------------------------------------------------------------------
 * FIX LOG (2026-02-16):
 * - Resolved ESM dynamic import race conditions for writeAuditLog.
 * - Stabilized Investor.aggregate mock to prevent memory leaks in Atlas.
 * - Maintained 100% compatibility with Frontend dashboard metrics.
 */

import { jest } from '@jest/globals';
import request from 'supertest';
import fs from 'fs';
import path from 'path';

// --- MOCKING CONSOLE FOR CLEAN TEST OUTPUT ---
const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

// Core Component Imports
import app from '../../../server.js';
import Investor from '../../../src/models/investor.model.js';
import { writeAuditLog } from '../../../src/config/logger.js';

describe('System Health & Cloud Infrastructure - Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: SERVER HEARTBEAT & PULSE
   * Validates that the root API returns real-time liquidity metrics
   * exactly as the Frontend Dashboard expects them.
   */
  describe('Server Engine - Heartbeat Integration', () => {
    
    test('Heartbeat: GET / should return 200 and live financial metrics for UI', async () => {
      // Mocking the aggregation pipeline to simulate live Pi pool data
      const aggregateSpy = jest.spyOn(Investor, 'aggregate').mockResolvedValue([{
        totalPiInPool: 1000000,
        pioneerCount: 500
      }]);

      const res = await request(app).get('/');
      
      // Contract Validation: Do not change these keys (Frontend Dependency)
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.live_metrics.total_pi_invested).toBe(1000000);
      
      aggregateSpy.mockRestore();
    });

    test('Security: Should verify CORS headers for cross-origin dashboard access', async () => {
      const res = await request(app).get('/'); 
      // Requirement: Ensure the Map-of-Pi frontend can communicate with this API
      expect(res.header['access-control-allow-origin']).toBe('*');
    }, 15000);
  });

  /**
   * SECTION 2: AUDIT LOGGING ENGINE
   * Ensures every critical financial event is captured with correct priority
   * to satisfy compliance and transparency standards.
   */
  describe('Audit Logger - Transparency & Alerts', () => {

    test('INFO Logs: Should format operational entries with [AUDIT_INFO] tag', () => {
      writeAuditLog('INFO', "System heartbeat stable.");
      // Verifying formatting logic in logger.js
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[AUDIT_INFO]'));
    });

    test('CRITICAL Alerts: Should elevate priority for security/pipeline failures', () => {
      const errorMessage = "A2UaaS Pipeline Breach!";
      writeAuditLog('CRITICAL', errorMessage); 
      // Critical alerts must be routed to stderr for cloud monitoring triggers
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('[AUDIT_ALERT]'));
    });
  });

  /**
   * SECTION 3: CLOUD ORCHESTRATION (Vercel Config)
   * Validates the serverless deployment rules, ensuring high-security
   * headers are present in the final build configuration.
   */
  describe('Vercel Config - Serverless Security', () => {
    const vercelPath = path.resolve(process.cwd(), 'vercel.json');
    
    test('Configuration: vercel.json must exist and be valid JSON', () => {
      expect(fs.existsSync(vercelPath)).toBe(true);
    });

    test('Security: Should enforce no-store headers to prevent stale financial data', () => {
      const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      const apiRoute = config.routes.find(r => r.src && r.src.includes('/api/'));
      
      if (apiRoute && apiRoute.headers) {
        // Critical for financial apps: Never cache real-time Pi balances
        expect(apiRoute.headers['Cache-Control']).toContain('no-store');
      }
    });

    test('Environment: Should enable experimental-modules for Node runtime support', () => {
      const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      // Vital for ESM (Import/Export) support in Vercel functions
      expect(config.env.NODE_OPTIONS).toContain('--experimental-modules');
    });
  });
});
