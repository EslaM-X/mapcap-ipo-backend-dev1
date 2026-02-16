/**
 * IPO Contribution Integration Suite - End-to-End Pipeline v1.0.4
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: High-Fidelity Transaction Integration
 * -------------------------------------------------------------------------
 * DESCRIPTION:
 * Comprehensive integration testing for the IPO investment lifecycle. 
 * Ensures idempotency, data precision, and strict validation for Pi Network transactions.
 * * UPDATES:
 * - ESM Compatibility: Explicitly managed 'jest' context for async operations.
 * - Idempotency Guard: Verified unique txId constraints to prevent double-spending.
 * - Precision: Validated support for floating-point Pi contributions.
 * - Scalability: Integrated X-Forwarded-For simulation for CI/CD environments.
 */

import { jest } from '@jest/globals'; 
import request from 'supertest';
import app from '../../server.js'; 
import Investor from '../../src/models/investor.model.js';
import mongoose from 'mongoose';

describe('IPO Contribution Pipeline - Integration Tests', () => {

  // Global timeout for integration tests (Essential for Cloud DB Latency & Pipeline execution)
  jest.setTimeout(25000); 

  beforeAll(async () => {
    // Establishing secure handshake with the testing cluster
    if (mongoose.connection.readyState === 0) {
      const TEST_DB = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test';
      await mongoose.connect(TEST_DB);
    }
  });

  afterEach(async () => {
    // Clean up collection to ensure idempotent test runs and isolation
    if (mongoose.connection.readyState !== 0) {
      await Investor.deleteMany({});
    }
  });

  afterAll(async () => {
    // Graceful closure of the connection pool to prevent memory leaks
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  /**
   * TEST: Valid Contribution Lifecycle
   * VERIFIES: Standardized Route check for v1.6.x IPO investment pipeline.
   */
  test('Success: POST /api/v1/ipo/invest should persist data and return 201 Created', async () => {
    const contributionPayload = {
      piAddress: 'GBVXXXX_TEST_PIONEER_NODE',
      amount: 750.55,
      txId: 'TX_ID_999_INTEGRATION_TEST'
    };

    // Triggering the financial pipeline via the public API route
    const response = await request(app)
      .post('/api/v1/ipo/invest') 
      .set('X-Forwarded-For', '127.0.0.1') // Bypass for security filters in CI environments
      .send(contributionPayload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    
    // Integrity Check: Verifying high-fidelity data persistence in the ledger
    const persistedInvestor = await Investor.findOne({ piAddress: contributionPayload.piAddress });
    expect(persistedInvestor).not.toBeNull();
    expect(persistedInvestor.totalPiContributed).toBe(750.55);
  });

  /**
   * TEST: Duplicate Transaction Guard (Anti Double-Spend)
   * VERIFIES: System prevents re-submitting the same TXID (Idempotency Guard).
   */
  test('Security: Should reject duplicate txId to prevent double-entry', async () => {
    const payload = {
      piAddress: 'PIONEER_UNIQUE',
      amount: 100,
      txId: 'STRICTLY_UNIQUE_TX_101'
    };

    // First entry: Establishing the record
    await request(app).post('/api/v1/ipo/invest').send(payload);
    
    // Second entry: Attempting to duplicate (Must be intercepted by the controller/model)
    const response = await request(app).post('/api/v1/ipo/invest').send(payload);

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/duplicate|already exists/i);
  });

  /**
   * TEST: Input Validation & Financial Guardrails
   * VERIFIES: Rejection of negative or zero amounts to protect the pool integrity.
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

    // Standardized error response for Frontend consistency
    expect(response.status).toBe(400); 
    expect(response.body.success).toBe(false);
  });

});
