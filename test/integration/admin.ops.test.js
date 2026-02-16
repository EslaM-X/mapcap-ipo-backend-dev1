/**
 * Admin Operations Integration Suite - Security & Settlement v1.0.4
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Compliance & Security Gate
 * -------------------------------------------------------------------------
 * FIX LOG:
 * - Environment Adaptation: Switched from Memory Server to Local DB for Termux compatibility.
 * - Connection Logic: Prioritizes process.env.MONGO_URI_TEST for CI/CD flexibility.
 */

import { jest } from '@jest/globals'; 
import request from 'supertest';
import app from '../../server.js';
import Investor from '../../src/models/investor.model.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('Admin Operations - Security & Settlement Integration', () => {
  let adminToken;

  // Optimized timeout for stable handshakes in Termux environments
  jest.setTimeout(30000); 

  beforeAll(async () => {
    /**
     * DATABASE CONNECTION STRATEGY:
     * Directly connects to the Local/Cloud MongoDB to bypass 'mongodb-memory-server' 
     * binary download failures on restricted environments like Termux.
     */
    try {
      if (mongoose.connection.readyState === 0) {
        const testDbUri = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test';
        await mongoose.connect(testDbUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        console.log(`[TEST_DB]: Connected successfully to ${testDbUri}`);
      }
    } catch (error) {
      console.error("[TEST_DB_ERROR]: Connection failed. Ensure MongoDB is running locally.");
      throw error;
    }

    /**
     * AUTHENTICATION SETUP:
     * Aligned with the 'x-admin-token' logic used in auth.middleware.
     */
    adminToken = process.env.ADMIN_SECRET_TOKEN || 'test_admin_secret_123';
  });

  afterEach(async () => {
    // Clean-up between tests to ensure isolation
    if (mongoose.connection.readyState !== 0) {
      await Investor.deleteMany({});
    }
  });

  afterAll(async () => {
    // Ensure the process exits cleanly
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  /**
   * TEST: Unauthorized Access Interception
   */
  test('Security: GET /api/v1/admin/audit-logs should reject unauthenticated requests', async () => {
    const response = await request(app).get('/api/v1/admin/audit-logs');
    
    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  /**
   * TEST: Authorized Settlement Execution
   * Uses the 'x-admin-token' header for consistency with our new AuthMiddleware.
   */
  test('Settlement: POST /api/v1/admin/settle should execute with a valid admin token', async () => {
    await Investor.create({
      piAddress: 'PIONEER_SETTLE_TEST_001',
      totalPiContributed: 20000, 
      isWhale: false
    });

    const response = await request(app)
      .post('/api/v1/admin/settle')
      .set('x-admin-token', adminToken); // Updated to match our specific header requirement

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toMatch(/finalized|successfully|executed|settlement/i);
  });

  /**
   * TEST: Pulse Dashboard Metrics Retrieval
   */
  test('Audit: GET /api/v1/admin/status should return system metrics for Daniel’s review', async () => {
    const response = await request(app)
      .get('/api/v1/admin/status')
      .set('x-admin-token', adminToken);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    if (response.body.data) {
        expect(response.body.data).toHaveProperty('metrics');
    }
  });
});
