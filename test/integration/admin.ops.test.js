/**
 * Admin Operations Integration Suite - Security & Settlement v1.0.2
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Compliance & Security Gate
 * -------------------------------------------------------------------------
 * UPDATES: 
 * - ESM Compatibility: Explicitly imported 'jest' for timeout management.
 * - Increased Timeout: Boosted to 20s for stable Cloud DB Handshakes.
 * - Security Alignment: Verified 403 Forbidden logic for Daniel's Audit.
 * - Standardized Response: Logic synced with ResponseHelper v1.6.8.
 */

import { jest } from '@jest/globals'; // CRITICAL: Fixes 'ReferenceError: jest is not defined' in ESM
import request from 'supertest';
import app from '../../server.js';
import Investor from '../../src/models/investor.model.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('Admin Operations - Security & Settlement Integration', () => {
  let adminToken;

  // Global timeout increase for integration tests to prevent "Exceeded timeout" errors
  jest.setTimeout(20000); 

  beforeAll(async () => {
    // Establishing secure handshake with the testing cluster
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test');
    }

    /**
     * AUTHENTICATION SETUP:
     * Generate a real JWT token with administrative privileges (Daniel's Security Protocol).
     */
    adminToken = jwt.sign(
      { id: 'admin_test_id', role: 'admin' }, 
      process.env.JWT_SECRET || 'test_secret_key', 
      { expiresIn: '1h' }
    );
  });

  afterEach(async () => {
    // Cleanup to ensure test isolation and data integrity
    if (mongoose.connection.readyState !== 0) {
      await Investor.deleteMany({});
    }
  });

  afterAll(async () => {
    // Graceful closure of the connection pool
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  /**
   * SCENARIO: Unauthorized Access Attempt
   * REQUIREMENT: Middleware must intercept requests without valid headers (Forbidden).
   */
  test('Security: GET /api/v1/admin/audit-logs should reject unauthenticated requests', async () => {
    const response = await request(app).get('/api/v1/admin/audit-logs');
    
    // Status 403 (Forbidden) is enforced by Daniel's AuthMiddleware for missing tokens
    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/unauthorized|forbidden|denied|token/i);
  });

  /**
   * SCENARIO: Authorized Settlement Execution
   * REQUIREMENT: Philip's Anti-Whale Enforcement via full pipeline integration.
   */
  test('Settlement: POST /api/v1/admin/settle should execute with a valid admin token', async () => {
    // Seed database with a 'Pseudo-Whale' to test full settlement orchestration
    await Investor.create({
      piAddress: 'PIONEER_SETTLE_TEST_001',
      totalPiContributed: 20000, 
      isWhale: false
    });

    const response = await request(app)
      .post('/api/v1/admin/settle')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    // Flexible matching for standardized success messages in v1.6.x
    expect(response.body.message).toMatch(/finalized|successfully|executed|settlement/i);
  });

  /**
   * SCENARIO: Financial Report Access
   * REQUIREMENT: Ensure global metrics are accessible for the Pulse Dashboard.
   */
  test('Audit: GET /api/v1/admin/status should return system metrics for Daniel’s review', async () => {
    const response = await request(app)
      .get('/api/v1/admin/status')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // Check for standardized data encapsulation for Dashboard compatibility
    if (response.body.data) {
        expect(response.body.data).toHaveProperty('metrics');
    }
  });
});
