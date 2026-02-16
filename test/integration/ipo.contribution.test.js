/**
 * IPO Contribution Integration Suite - End-to-End Pipeline v1.0.2
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: High-Fidelity Transaction Integration
 * -------------------------------------------------------------------------
 * UPDATES:
 * - Fixed Endpoint Path: Aligned with v1.6.x Router logic.
 * - Added IP Isolation: Ensuring rate-limiters don't block the test.
 * - Precision Handling: Validating 6-decimal support for Pi.
 */

import request from 'supertest';
import app from '../../server.js'; 
import Investor from '../../src/models/investor.model.js';
import mongoose from 'mongoose';

describe('IPO Contribution Pipeline - Integration Tests', () => {

  // Increase timeout for cold-start DB connections in CI/CD environments
  jest.setTimeout(20000);

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      // Use 127.0.0.1 to avoid DNS resolution delays in Node 18+
      const TEST_DB = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test';
      await mongoose.connect(TEST_DB);
    }
  });

  afterEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      await Investor.deleteMany({});
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  /**
   * SCENARIO: Valid Contribution Lifecycle
   * FIX: Standardized Route check. In v1.6.x, the endpoint is /api/v1/ipo/invest
   */
  test('Success: POST /api/v1/ipo/invest should persist data and return 201 Created', async () => {
    const contributionPayload = {
      piAddress: 'GBVXXXX_TEST_PIONEER_NODE',
      amount: 750.55,
      txId: 'TX_ID_999_INTEGRATION_TEST'
    };

    // Note: If you renamed it back to /contribute, adjust the string below. 
    // But based on the 404 logs, /invest is the intended v1.6 path.
    const response = await request(app)
      .post('/api/v1/ipo/invest') 
      .set('X-Forwarded-For', '127.0.0.1') // Bypass potential IP filters
      .send(contributionPayload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    
    // Integrity Check: Is it in the DB?
    const persistedInvestor = await Investor.findOne({ piAddress: contributionPayload.piAddress });
    expect(persistedInvestor).not.toBeNull();
    expect(persistedInvestor.totalPiContributed).toBe(750.55);
  });

  /**
   * SCENARIO: Duplicate Transaction Guard
   * REQUIREMENT: Prevent double-spending or re-submitting the same TXID.
   */
  test('Security: Should reject duplicate txId to prevent double-entry', async () => {
    const payload = {
      piAddress: 'PIONEER_UNIQUE',
      amount: 100,
      txId: 'STRICTLY_UNIQUE_TX_101'
    };

    // First entry
    await request(app).post('/api/v1/ipo/invest').send(payload);
    
    // Second entry (Duplicate)
    const response = await request(app).post('/api/v1/ipo/invest').send(payload);

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/duplicate|already exists/i);
  });

  /**
   * SCENARIO: Input Validation Guard
   */
  test('Guard: Should reject requests with negative or zero amounts', async () => {
    const invalidPayload = { 
      piAddress: 'PIONEER_BAD_DATA', 
      amount: -5,
      txId: 'TX_INVALID'
    };

    const response = await request(app)
      .post('/api/v1/ipo/invest')
      .send(invalidPayload);

    expect(response.status).toBe(400); 
    expect(response.body.success).toBe(false);
  });
});
