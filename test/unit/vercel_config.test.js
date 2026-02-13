/**
 * Vercel Configuration Unit Tests - Cloud Readiness v2.0
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Serverless Optimization
 * * PURPOSE:
 * Validates the Vercel deployment configuration.
 * Ensures routing, headers, and environment flags are set 
 * correctly for a non-cached, high-precision API.
 * ---------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';

describe('Vercel Config - Serverless Orchestration Tests', () => {
  const vercelPath = path.resolve(process.cwd(), 'vercel.json');
  const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));

  /**
   * TEST: Runtime Execution
   * Requirement: Must use @vercel/node with ES Modules support.
   */
  test('Runtime: Should target server.js using the @vercel/node builder', () => {
    expect(config.builds[0].src).toBe('server.js');
    expect(config.builds[0].use).toBe('@vercel/node');
  });

  /**
   * TEST: Header Compliance (Daniel's Security Standard)
   * Requirement: Cache-Control must be set to 'no-store' for financial data.
   */
  test('Security: Should enforce no-cache headers for API routes', () => {
    const apiRoute = config.routes.find(r => r.src.includes('/api/'));
    expect(apiRoute.headers['Cache-Control']).toContain('no-store');
    expect(apiRoute.headers['Access-Control-Allow-Origin']).toBe('*');
  });

  /**
   * TEST: Environment Flags
   * Requirement: Must enable experimental-modules for ES6 support.
   */
  test('Environment: Should enable experimental-modules for Node runtime', () => {
    expect(config.env.NODE_OPTIONS).toContain('--experimental-modules');
  });
});

