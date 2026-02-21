/**
 * Payout Pipeline Integration Suite - Financial Integrity v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Automated Vesting & Pi Transfer
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented strict Promise-based mocking for PaymentService.
 * - Formalized IInvestor interface usage for database seeding.
 * - Enforced atomic rollback verification (Resilience test).
 * - Maintained 30s timeout for blockchain-simulated operations.
 */

import { jest } from '@jest/globals'; 
import request from 'supertest';
import app from '../../server.js';
import Investor, { IInvestor } from '../../src/models/investor.model.js';
import PaymentService from '../../src/services/payment.service.js';
import mongoose from 'mongoose';

describe('Payout Pipeline - End-to-End Financial Integration', () => {
  const adminSecret: string = process.env.ADMIN_SECRET_TOKEN || 'secure_fallback_2026';

  // Global timeout for blockchain-simulated handshakes and job execution
  jest.setTimeout(30000);

  beforeAll(async (): Promise<void> => {
    if (mongoose.connection.readyState === 0) {
      const TEST_DB: string = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test';
      await mongoose.connect(TEST_DB);
    }
  });

  afterEach(async (): Promise<void> => {
    if (mongoose.connection.readyState !== 0) {
      await Investor.deleteMany({});
    }
    // Clean slate for every test to prevent cross-contamination
    jest.restoreAllMocks(); 
    jest.clearAllMocks();
  });

  afterAll(async (): Promise<void> => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  /**
   * @test Success Path - Monthly Vesting Release
   * @description Verifies that the VestingJob identifies eligible pioneers and updates ledger.
   */
  test('Vesting Flow: Successful Pi transfer should update the investor ledger', async () => {
    // 1. DATA SEEDING: Creating an eligible record
    await Investor.create({
      piAddress: 'PIONEER_001',
      totalPiContributed: 5000,
      allocatedMapCap: 1000,
      vestingMonthsCompleted: 0
    });

    /**
     * ARCHITECTURAL SPY:
     * Mocking 'transferPi' to bypass real network calls and Nock restrictions.
     */
    const transferSpy = jest.spyOn(PaymentService, 'transferPi').mockImplementation(() => {
        return Promise.resolve({ 
            success: true, 
            txId: 'MOCK_PI_TX_SUCCESS_2026' 
        });
    });

    // 2. TRIGGER: Administrative API call mimicking Admin Dashboard
    const response = await request(app)
      .post('/api/v1/admin/settle-vesting') 
      .set('x-admin-token', adminSecret);

    // 3. VALIDATION
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(transferSpy).toHaveBeenCalled(); 

    const updated = await Investor.findOne({ piAddress: 'PIONEER_001' });
    // Verifies that the ledger was incremented only after successful payout
    expect(updated?.vestingMonthsCompleted).toBe(1);
  });

  /**
   * @test Failure Path - Transactional Resilience
   * @description Ensures the database remains unchanged if the Pi Network API fails.
   */
  test('Resilience: Database should not update if the Payout Service fails', async () => {
    // 1. SEED: Pioneer already 2 months into vesting
    await Investor.create({
      piAddress: 'PIONEER_FAIL',
      totalPiContributed: 5000,
      allocatedMapCap: 1000,
      vestingMonthsCompleted: 2
    });

    // 2. MOCK FAILURE: Simulate network disruption
    const transferSpy = jest.spyOn(PaymentService, 'transferPi').mockImplementation(() => {
        return Promise.reject(new Error('Nock: Disallowed net connect (Simulated Failure)'));
    });

    // 3. EXECUTE
    await request(app)
      .post('/api/v1/admin/settle-vesting')
      .set('x-admin-token', adminSecret);

    const unchanged = await Investor.findOne({ piAddress: 'PIONEER_FAIL' });
    
    /**
     * INTEGRITY CHECK: 
     * The month counter MUST NOT increase if the payment service failed.
     */
    expect(unchanged?.vestingMonthsCompleted).toBe(2);
    expect(transferSpy).toHaveBeenCalled();
  });
});
