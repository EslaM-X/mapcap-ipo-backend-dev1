/**
 * Admin Operations Integration Suite - Security & Settlement v1.0.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Compliance & Security Gate
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite validates the administrative security layer and operational 
 * integrity. It ensures that only authenticated administrators can trigger 
 * high-stakes operations like the Final IPO Settlement.
 * -------------------------------------------------------------------------
 */

import request from 'supertest';
import app from '../../server.js';
import Investor from '../../src/models/investor.model.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('Admin Operations - Security & Settlement Integration', () => {
  let adminToken;

  beforeAll(async () => {
    // Connect to Test Database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/mapcap_test');
    }

    /**
     * AUTHENTICATION SETUP:
     * Generate a real JWT token to simulate a logged-in administrator.
     * This mimics the AuthController.adminLogin behavior.
     */
    adminToken = jwt.sign(
      { id: 'admin_test_id', role: 'admin' }, 
      process.env.JWT_SECRET || 'test_secret_key', 
      { expiresIn: '1h' }
    );
  });

  afterEach(async () => {
    await Investor.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  /**
   * SCENARIO: Unauthorized Access Attempt
   * REQUIREMENT: Any request to /admin/* without a valid Bearer token 
   * must be rejected with a 401 Unauthorized status.
   */
  test('Security: GET /api/v1/admin/audit-logs should reject unauthenticated requests', async () => {
    const response = await request(app).get('/api/v1/admin/audit-logs');
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/unauthorized/i);
  });

  /**
   * SCENARIO: Authorized Settlement Execution
   * REQUIREMENT: A logged-in admin should be able to trigger the settlement
   * protocol and receive a success confirmation.
   */
  test('Settlement: POST /api/v1/admin/settle should execute with a valid admin token', async () => {
    // Seed database with dummy data for settlement testing
    await Investor.create({
      piAddress: 'Whale_001',
      totalPiContributed: 20000, // This should trigger the logic during integration
      isWhale: false
    });

    const response = await request(app)
      .post('/api/v1/admin/settle')
      .set('Authorization', `Bearer ${adminToken}`); // Injecting the real JWT

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('executed');
  });

  /**
   * SCENARIO: Financial Report Access
   * REQUIREMENT: Admin must have access to the global metrics for audit reviews.
   */
  test('Audit: GET /api/v1/admin/status should return system metrics for Daniel’s review', async () => {
    const response = await request(app)
      .get('/api/v1/admin/status')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('metrics');
  });
});

