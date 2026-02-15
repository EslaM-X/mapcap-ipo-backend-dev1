/**
 * IPO Contribution Integration Suite - End-to-End Pipeline v1.0.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: High-Fidelity Transaction Integration
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite validates the full lifecycle of a Pioneer's contribution.
 * It bypasses mocking to test the real-world interaction between:
 * Express Routes -> Validation Middleware -> IPO Controller -> MongoDB.
 * -------------------------------------------------------------------------
 */

import request from 'supertest';
import app from '../../server.js'; 
import Investor from '../../src/models/investor.model.js';
import mongoose from 'mongoose';

describe('IPO Contribution Pipeline - Integration Tests', () => {

  /**
   * ENVIRONMENT SETUP:
   * Establish a dedicated connection to the test database to ensure 
   * production data remains isolated and protected.
   */
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      const TEST_DB = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/mapcap_test';
      await mongoose.connect(TEST_DB);
    }
  });

  /**
   * DATA HYGIENE:
   * Wipe the Investor collection after each execution to prevent 
   * cross-test pollution and ensure deterministic results.
   */
  afterEach(async () => {
    await Investor.deleteMany({});
  });

  /**
   * TEARDOWN:
   * Gracefully terminate the database connection once the suite completes
   * to release system resources.
   */
  afterAll(async () => {
    await mongoose.connection.close();
  });

  /**
   * SCENARIO: Valid Contribution Lifecycle
   * REQUIREMENT: Verify that a compliant payload is persisted to the ledger
   * and returns the standardized API response.
   */
  test('Success: POST /api/v1/ipo/contribute should persist data and return 201 Created', async () => {
    const contributionPayload = {
      piAddress: 'GDTXXXX...PIONEER_ESLAM',
      amount: 500,
      txId: 'TX_123456789'
    };

    const response = await request(app)
      .post('/api/v1/ipo/contribute')
      .send(contributionPayload);

    // Assert: HTTP Status & Standardization Compliance
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.piAddress).toBe(contributionPayload.piAddress);

    // Assert: Database Persistence (The Integrity Check)
    const persistedInvestor = await Investor.findOne({ piAddress: contributionPayload.piAddress });
    expect(persistedInvestor).not.toBeNull();
    expect(persistedInvestor.totalPiContributed).toBe(500);
  });

  /**
   * SCENARIO: Input Validation Guard
   * REQUIREMENT: Ensure the Validation Middleware intercepts malformed 
   * requests before they reach the controller logic.
   */
  test('Guard: POST /api/v1/ipo/contribute should reject requests with missing identity fields', async () => {
    const malformedPayload = { amount: 100 }; // Missing piAddress

    const response = await request(app)
      .post('/api/v1/ipo/contribute')
      .send(malformedPayload);

    // Assert: Validation Rejection
    expect(response.status).toBe(400); 
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBeDefined();
  });
});

