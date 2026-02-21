/**
 * @file IPO Contribution Integration Suite v1.7.5 (TS Synchronized)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Dynamic IPO Flexibility
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented strict typing for Supertest request payloads.
 * - Formalized DB connection handling for Node 20.x environments.
 * - Maintained flexible regex matching for "Ledger synchronization" status.
 * - Enforced atomic isolation for Investor and Transaction models.
 */

import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../server.js'; 
import Investor, { IInvestor } from '../../src/models/investor.model.js';
import Transaction from '../../src/models/Transaction.js'; 
import mongoose from 'mongoose';

describe('IPO Contribution Pipeline - End-to-End Integration', () => {

  // Extended timeout for stable processing on Termux/CI environments
  jest.setTimeout(30000); 

  beforeAll(async (): Promise<void> => {
    try {
      if (mongoose.connection.readyState === 0) {
        const TEST_DB: string = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test';
        await mongoose.connect(TEST_DB);
        console.log(`[PIPELINE_TEST]: Connected to ${TEST_DB}`);
      }
    } catch (error: any) {
      console.error("[PIPELINE_DB_ERROR]: Ensure MongoDB is active.");
      throw error;
    }
  });

  afterEach(async (): Promise<void> => {
    if (mongoose.connection.readyState !== 0) {
      await Investor.deleteMany({});
      await Transaction.deleteMany({});
    }
  });

  afterAll(async (): Promise<void> => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  /**
   * @test SUCCESSFUL CONTRIBUTION
   * Matches: "Ledger synchronization successful."
   */
  test('Success: POST /api/v1/ipo/invest should persist high-fidelity data and return 200 OK', async () => {
    const contributionPayload = {
      piAddress: 'GBVXXXX_TEST_PIONEER_NODE',
      amount: 750.55,
      piTxId: 'TX_ID_999_INTEGRATION_TEST'
    };

    const response = await request(app)
      .post('/api/v1/ipo/invest') 
      .send(contributionPayload);

    expect(response.status).toBe(200); 
    expect(response.body.success).toBe(true);
    // Flexible regex to match the updated controller message across versions
    expect(response.body.message).toMatch(/ledger synchronization successful/i);
    
    const persistedInvestor: IInvestor | null = await Investor.findOne({ 
        piAddress: contributionPayload.piAddress 
    });

    expect(persistedInvestor).not.toBeNull();
    expect(persistedInvestor?.totalPiContributed).toBe(750.55);
  });

  /**
   * @test IDEMPOTENCY GUARD (ANTI DOUBLE-SPEND)
   * Ensures that the same Pi Transaction ID cannot be registered twice.
   */
  test('Security: Should trigger 409 Conflict when a duplicate piTxId is detected', async () => {
    const payload = {
      piAddress: 'PIONEER_UNIQUE_STAKE',
      amount: 100,
      piTxId: 'STRICTLY_UNIQUE_TX_101'
    };

    // First attempt: Primary registration
    await request(app).post('/api/v1/ipo/invest').send(payload);
    
    // Duplicate attempt: Should be blocked by the unique index/logic
    const response = await request(app).post('/api/v1/ipo/invest').send(payload);

    expect(response.status).toBe(409); 
    expect(response.body.message).toMatch(/duplicate/i);
  });

  /**
   * @test METADATA INTEGRITY
   */
  test('Guard: Should reject malformed requests missing critical blockchain metadata', async () => {
    const invalidPayload = { 
      piAddress: 'PIONEER_MALFORMED_DATA', 
      amount: 5
      // Missing piTxId
    };

    const response = await request(app)
      .post('/api/v1/ipo/invest')
      .send(invalidPayload);

    expect(response.status).toBe(400); 
    expect(response.body.success).toBe(false);
  });

});
