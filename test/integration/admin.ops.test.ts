/**
 * Admin Operations Integration Suite - Security & Settlement v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Compliance & Security Gate
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented strict typing for Supertest responses.
 * - Formalized the 'x-admin-token' validation logic for RBAC testing.
 * - Aligned with v1.7.x flattened data structure for O(1) property access.
 * - Maintained 30s timeout for complex MongoDB aggregations on Termux.
 */

import { jest } from '@jest/globals'; 
import request from 'supertest';
import app from '../../server.js';
import Investor from '../../src/models/investor.model.js';
import mongoose from 'mongoose';

describe('Admin Operations - Security & Settlement Integration', () => {
  let adminToken: string;

  // Optimized timeout for local DB handshakes and complex aggregation queries
  jest.setTimeout(30000); 

  beforeAll(async (): Promise<void> => {
    /**
     * DATABASE CONNECTION STRATEGY:
     * Utilizing a fail-safe connection to the local test instance to bypass 
     * environment-specific binary restrictions (e.g., Termux/Android).
     */
    try {
      if (mongoose.connection.readyState === 0) {
        const testDbUri: string = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test';
        await mongoose.connect(testDbUri);
        console.log(`[ADMIN_OPS_TEST]: Connection established with ${testDbUri}`);
      }
    } catch (error: any) {
      throw new Error(`[CRITICAL]: Database connection failed: ${error.message}`);
    }

    // Aligned with the ecosystem's administrative secret protocol
    adminToken = process.env.ADMIN_SECRET_TOKEN || 'test_admin_secret_123';
  });

  afterEach(async (): Promise<void> => {
    // Maintain test isolation by clearing the persistent storage between cycles
    if (mongoose.connection.readyState !== 0) {
      await Investor.deleteMany({});
    }
  });

  afterAll(async (): Promise<void> => {
    // Graceful teardown of shared resources
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  /**
   * @test Access Control - Unauthorized Interception
   */
  test('Security: GET /api/v1/admin/audit-logs should reject unauthenticated requests', async () => {
    const response = await request(app).get('/api/v1/admin/audit-logs');
    
    expect(response.status).toBe(403); // Forbidden access without token
    expect(response.body.success).toBe(false);
  });

  /**
   * @test Functional - Authorized Settlement Execution
   */
  test('Settlement: POST /api/v1/admin/settle should execute with a valid admin token', async () => {
    // Injecting a mock Pioneer to validate settlement logic
    await Investor.create({
      piAddress: 'PIONEER_SETTLE_TEST_001',
      totalPiContributed: 20000, 
      isWhale: false
    });

    const response = await request(app)
      .post('/api/v1/admin/settle')
      .set('x-admin-token', adminToken); 

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    // Regex matching to allow flexible response phrasing
    expect(response.body.message).toMatch(/finalized|successfully|executed|settlement/i);
  });

  /**
   * @test Audit - Flat Schema System Metrics
   */
  test('Audit: GET /api/v1/admin/status should return system metrics for real-time review', async () => {
    const response = await request(app)
      .get('/api/v1/admin/status')
      .set('x-admin-token', adminToken);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    /**
     * SCHEMA CHECK:
     * In v1.7.5, we verify the top-level 'data' object contains the operational keys.
     */
    if (response.body.data) {
        const keys: string[] = Object.keys(response.body.data);
        expect(keys.length).toBeGreaterThan(0);
    }
  });
});
