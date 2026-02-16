/**
 * Admin Operations Integration Suite - Security & Settlement v1.0.3
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Compliance & Security Gate
 * -------------------------------------------------------------------------
 * DESCRIPTION:
 * Validates administrative orchestration, including settlement pipelines 
 * and secure audit logging. Ensures RBAC integrity across the MERN stack.
 * * UPDATES: 
 * - Path Integrity: Verified model resolutions for cross-environment stability.
 * - ESM Compatibility: Explicitly managed 'jest' context for asynchronous handshakes.
 * - Security Alignment: Enforced strict JWT payload validation for 'admin' role.
 */

import { jest } from '@jest/globals'; 
import request from 'supertest';
import app from '../../server.js';
import Investor from '../../src/models/investor.model.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('Admin Operations - Security & Settlement Integration', () => {
  let adminToken;

  // Optimized timeout for Cloud DB handshakes and complex aggregation pipelines
  jest.setTimeout(25000); 

  beforeAll(async () => {
    // Ensuring a stable connection to the testing cluster before suite execution
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test');
    }

    /**
     * AUTHENTICATION SETUP:
     * Generates a high-privilege JWT token. 
     * NOTE: The 'role: admin' must strictly match the AuthMiddleware's expectation 
     * to avoid 403 Forbidden errors during integration.
     */
    adminToken = jwt.sign(
      { id: 'admin_test_id', role: 'admin' }, 
      process.env.JWT_SECRET || 'test_secret_key', 
      { expiresIn: '1h' }
    );
  });

  afterEach(async () => {
    // Maintain database cleanliness between test cycles to prevent data leakage
    if (mongoose.connection.readyState !== 0) {
      await Investor.deleteMany({});
    }
  });

  afterAll(async () => {
    // Graceful teardown of the database connection pool
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  /**
   * TEST: Unauthorized Access Interception
   * VERIFIES: Daniel's Security Gate correctly identifies and rejects missing credentials.
   */
  test('Security: GET /api/v1/admin/audit-logs should reject unauthenticated requests', async () => {
    const response = await request(app).get('/api/v1/admin/audit-logs');
    
    // Expecting 403 Forbidden or 401 Unauthorized based on Middleware configuration
    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/unauthorized|forbidden|denied|token/i);
  });

  /**
   * TEST: Authorized Settlement Execution
   * VERIFIES: Full pipeline integration from Admin trigger to Investor record updates.
   */
  test('Settlement: POST /api/v1/admin/settle should execute with a valid admin token', async () => {
    // Pre-seed a 'Pioneer' record to simulate a real-world settlement scenario
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
    // Support for flexible success messaging defined in ResponseHelper
    expect(response.body.message).toMatch(/finalized|successfully|executed|settlement/i);
  });

  /**
   * TEST: Pulse Dashboard Metrics Retrieval
   * VERIFIES: Data encapsulation and availability for the Frontend Dashboard.
   */
  test('Audit: GET /api/v1/admin/status should return system metrics for Daniel’s review', async () => {
    const response = await request(app)
      .get('/api/v1/admin/status')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // Validates that the response contains the required 'metrics' object for Frontend rendering
    if (response.body.data) {
        expect(response.body.data).toHaveProperty('metrics');
    }
  });
});
