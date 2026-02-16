/**
 * @file IPO Contribution Integration Suite
 * @version 1.0.5
 * @author EslaM-X | AppDev @Map-of-Pi
 * @description 
 * Critical integration testing for the MapCap IPO Investment Pipeline.
 * Validates high-precision financial ledger synchronization, idempotency 
 * (anti double-spend), and Pi Network transaction metadata integrity.
 * * @architectural_standard Philip's Dynamic IPO Flexibility & Daniel's Audit Compliance.
 */

import { jest } from '@jestglobals'; 
import request from 'supertest';
import app from '../../server.js'; 
import Investor from '../../src/models/investor.model.js';
import Transaction from '../../src/models/Transaction.js'; 
import mongoose from 'mongoose';

describe('IPO Contribution Pipeline - End-to-End Integration', () => {

  /** * EXTENDED TIMEOUT:
   * Allocated for potential Cold-Start latency in CI/CD environments and 
   * high-fidelity database handshake.
   */
  jest.setTimeout(25000); 

  beforeAll(async () => {
    /** * DB HANDSHAKE:
     * Ensuring a clean, secure connection to the testing cluster before 
     * pipeline execution.
     */
    if (mongoose.connection.readyState === 0) {
      const TEST_DB = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test';
      await mongoose.connect(TEST_DB);
    }
  });

  afterEach(async () => {
    /** * LEDGER RESET:
     * Purging transient test data from both Investor and Transaction 
     * collections to ensure idempotent test runs and isolation.
     */
    if (mongoose.connection.readyState !== 0) {
      await Investor.deleteMany({});
      await Transaction.deleteMany({});
    }
  });

  afterAll(async () => {
    /** * RESOURCE CLEANUP:
     * Graceful termination of the database pool to prevent memory leaks 
     * during the final settlement of the test process.
     */
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  /**
   * @test SUCCESSFUL CONTRIBUTION
   * @verifies Real-time ledger synchronization and 6-decimal precision persistence.
   */
  test('Success: POST /api/v1/ipo/invest should persist high-fidelity data and return 200 OK', async () => {
    const contributionPayload = {
      piAddress: 'GBVXXXX_TEST_PIONEER_NODE',
      amount: 750.55,
      piTxId: 'TX_ID_999_INTEGRATION_TEST' // Aligned with PaymentController schema
    };

    const response = await request(app)
      .post('/api/v1/ipo/invest') 
      .set('X-Forwarded-For', '127.0.0.1') // Bypass security filters for local integration
      .send(contributionPayload);

    // Asserting Response Structure & Standardized Success Code
    expect(response.status).toBe(200); 
    expect(response.body.success).toBe(true);
    
    // AUDIT CHECK: Verify individual stake reflects the precise contribution amount
    const persistedInvestor = await Investor.findOne({ piAddress: contributionPayload.piAddress });
    expect(persistedInvestor).not.toBeNull();
    expect(persistedInvestor.totalPiContributed).toBe(750.55);
  });

  /**
   * @test IDEMPOTENCY GUARD (ANTI DOUBLE-SPEND)
   * @verifies Prevention of duplicate transaction processing in the financial pipeline.
   */
  test('Security: Should trigger 409 Conflict when a duplicate piTxId is detected', async () => {
    const payload = {
      piAddress: 'PIONEER_UNIQUE_STAKE',
      amount: 100,
      piTxId: 'STRICTLY_UNIQUE_TX_101'
    };

    // Primary entry: Establishing the initial record
    await request(app).post('/api/v1/ipo/invest').send(payload);
    
    // Duplicate entry: Attempting to bypass idempotency guard
    const response = await request(app).post('/api/v1/ipo/invest').send(payload);

    // Compliance: Rejecting re-submission to protect global liquidity pool
    expect(response.status).toBe(409); 
    expect(response.body.message).toMatch(/duplicate|already processed/i);
  });

  /**
   * @test METADATA INTEGRITY
   * @verifies Strict validation for mandatory Pi Network blockchain metadata.
   */
  test('Guard: Should reject malformed requests missing critical blockchain metadata', async () => {
    const invalidPayload = { 
      piAddress: 'PIONEER_MALFORMED_DATA', 
      amount: 5
      // piTxId is intentionally omitted
    };

    const response = await request(app)
      .post('/api/v1/ipo/invest')
      .send(invalidPayload);

    // Ensuring Front-end stability by returning standardized 400 Bad Request
    expect(response.status).toBe(400); 
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/required/i);
  });

});
