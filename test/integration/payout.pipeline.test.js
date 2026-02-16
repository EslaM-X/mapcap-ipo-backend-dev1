/**
 * Payout Pipeline Integration Suite - Financial Integrity v1.3.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * FIX: Resolved Spy invisibility by targeting PayoutService globally.
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

  jest.setTimeout(30000);

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      const TEST_DB = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test';
      await mongoose.connect(TEST_DB);
    }
  });

  afterEach(async () => {
    await Investor.deleteMany({});
    jest.restoreAllMocks(); 
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('Vesting Flow: Successful Pi transfer should update the investor ledger', async () => {
    // 1. Seed data
    await Investor.create({
      piAddress: 'PIONEER_001',
      totalPiContributed: 5000,
      vestingMonthsCompleted: 0
    });

    /**
     * SOLUTION: Mock the PayoutService AT THE PROTOTYPE LEVEL
     * This ensures that no matter who calls the service (Controller or Job), 
     * the Spy will catch it.
     */
    const payoutSpy = jest.spyOn(PayoutService, 'executeA2UPayout').mockResolvedValue({ 
      success: true, 
      txid: 'MOCK_TX_2026' 
    });

    // 2. Trigger the Admin route
    const response = await request(app)
      .post('/api/v1/admin/settle-vesting') 
      .set('x-admin-token', adminSecret);

    // 3. Assertions
    expect(response.status).toBe(200);
    
    /**
     * IMPORTANT: We check if the service was called at least once.
     * If the Job iterates through investors, it might call it multiple times.
     */
    expect(payoutSpy).toHaveBeenCalled(); 

    const updated = await Investor.findOne({ piAddress: 'PIONEER_001' });
    // Verify that the Job actually did its work
    expect(updated.vestingMonthsCompleted).toBeGreaterThan(0);
  });

  test('Resilience: Database should not update if the Payout Service fails', async () => {
    await Investor.create({
      piAddress: 'PIONEER_FAIL',
      vestingMonthsCompleted: 2
    });

    // Mock failure
    const payoutSpy = jest.spyOn(PayoutService, 'executeA2UPayout').mockRejectedValue(new Error('Network Lock'));

    const response = await request(app)
      .post('/api/v1/admin/settle-vesting')
      .set('x-admin-token', adminSecret);

    const unchanged = await Investor.findOne({ piAddress: 'PIONEER_FAIL' });
    expect(unchanged.vestingMonthsCompleted).toBe(2);
    expect(payoutSpy).toHaveBeenCalled();
  });
});
