/**
 * Payout Pipeline Integration Suite - Financial Integrity v1.3.5
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Automated Vesting & Pi Transfer
 * -------------------------------------------------------------------------
 * FINAL AUDIT FIX (2026-02-16):
 * - Enhanced Seed Data: Added 'allocatedMapCap' to trigger Vesting logic.
 * - Spy Integrity: Maintained PayoutService global tracking.
 * - UI Stability: Zero changes to keys/routes to preserve Frontend parity.
 */

import { jest } from '@jest/globals'; 
import request from 'supertest';
import app from '../../server.js';
import Investor from '../../src/models/investor.model.js';
import PayoutService from '../../src/services/payout.service.js';
import mongoose from 'mongoose';

describe('Payout Pipeline - End-to-End Financial Integration', () => {
  const adminSecret = process.env.ADMIN_SECRET_TOKEN || 'secure_fallback_2026';
  let server;

  // Set timeout for blockchain-simulated operations
  jest.setTimeout(30000);

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      const TEST_DB = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test';
      await mongoose.connect(TEST_DB);
    }
  });

  afterEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      await Investor.deleteMany({});
    }
    jest.restoreAllMocks(); 
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  /**
   * @test Success Path - Monthly Vesting Release
   */
  test('Vesting Flow: Successful Pi transfer should update the investor ledger', async () => {
    // 1. SEED DATA: Added 'allocatedMapCap' so the Job detects an eligible payout.
    await Investor.create({
      piAddress: 'PIONEER_001',
      totalPiContributed: 5000,
      allocatedMapCap: 1000, // Essential for VestingJob calculation
      vestingMonthsCompleted: 0
    });

    /**
     * PRECISION MOCKING:
     * Spying on the prototype to catch the call even if triggered from VestingJob.
     */
    const payoutSpy = jest.spyOn(PayoutService, 'executeA2UPayout').mockResolvedValue({ 
      success: true, 
      txid: 'MOCK_PI_TX_SUCCESS_2026' 
    });

    // 2. Execute the administrative trigger
    const response = await request(app)
      .post('/api/v1/admin/settle-vesting') 
      .set('x-admin-token', adminSecret);

    // 3. Assertions
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // Ensure the PayoutService was reached by the internal Job
    expect(payoutSpy).toHaveBeenCalled(); 

    const updated = await Investor.findOne({ piAddress: 'PIONEER_001' });
    // Verify the ledger was actually incremented
    expect(updated.vestingMonthsCompleted).toBe(1);
  });

  /**
   * @test Failure Path - Transactional Resilience
   */
  test('Resilience: Database should not update if the Payout Service fails', async () => {
    // 1. Seed data for failure scenario
    await Investor.create({
      piAddress: 'PIONEER_FAIL',
      totalPiContributed: 5000,
      allocatedMapCap: 1000,
      vestingMonthsCompleted: 2
    });

    // 2. Simulate API Outage (Network Failure)
    const payoutSpy = jest.spyOn(PayoutService, 'executeA2UPayout')
      .mockRejectedValue(new Error('A2UaaS pipeline disrupted: Network Unreachable'));

    // 3. Execute request
    const response = await request(app)
      .post('/api/v1/admin/settle-vesting')
      .set('x-admin-token', adminSecret);

    const unchanged = await Investor.findOne({ piAddress: 'PIONEER_FAIL' });
    
    /**
     * INTEGRITY CHECK: 
     * The month counter MUST NOT increase if the payment service failed.
     */
    expect(unchanged.vestingMonthsCompleted).toBe(2);
    expect(payoutSpy).toHaveBeenCalled();
  });
});
