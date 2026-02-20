/**
 * Payout Pipeline Integration Suite - Financial Integrity v1.5.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Automated Vesting & Pi Transfer
 * -------------------------------------------------------------------------
 * FINAL AUDIT FIX (2026-02-16):
 * - Mock Alignment: Synced Spy with PaymentService.transferPi to prevent 
 * Nock "Disallowed net connect" errors in Termux environment.
 * - Precision Spy: Using mockImplementation for robust ES Module interception.
 * - Zero-Breaking Changes: Strictly maintained all routes and JSON keys for 
 * Frontend (AdminDashboard.jsx) compatibility.
 * -------------------------------------------------------------------------
 */

import { jest } from '@jest/globals'; 
import request from 'supertest';
import app from '../../server.js';
import Investor from '../../src/models/investor.model.js';
import PayoutService from '../../src/services/payout.service.js';
import PaymentService from '../../src/services/payment.service.js'; // Added for precise mocking
import mongoose from 'mongoose';

describe('Payout Pipeline - End-to-End Financial Integration', () => {
  const adminSecret = process.env.ADMIN_SECRET_TOKEN || 'secure_fallback_2026';

  // Global timeout for blockchain-simulated handshakes and job execution
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
    // Clean slate for every test to prevent cross-contamination
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
   * @description Verifies that the VestingJob correctly identifies eligible 
   * pioneers, executes the Pi transfer, and increments the ledger.
   */
  test('Vesting Flow: Successful Pi transfer should update the investor ledger', async () => {
    // 1. DATA SEEDING: Providing full schema requirements to satisfy VestingJob logic.
    await Investor.create({
      piAddress: 'PIONEER_001',
      totalPiContributed: 5000,
      allocatedMapCap: 1000, // CRITICAL: Job ignores records with 0 allocation
      vestingMonthsCompleted: 0
    });

    /**
     * ARCHITECTURAL SPY:
     * We mock 'transferPi' in PaymentService because it's the final gateway 
     * to the Pi Network API. This bypasses Nock restrictions.
     */
    const transferSpy = jest.spyOn(PaymentService, 'transferPi').mockImplementation(() => {
        return Promise.resolve({ 
            success: true, 
            txid: 'MOCK_PI_TX_SUCCESS_2026' 
        });
    });

    // 2. TRIGGER: Administrative API call mimicking the Admin Dashboard action
    const response = await request(app)
      .post('/api/v1/admin/settle-vesting') 
      .set('x-admin-token', adminSecret);

    // 3. VALIDATION: Check for HTTP 200 and data integrity
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // Confirms that the internal logic actually reached out to the PaymentService
    expect(transferSpy).toHaveBeenCalled(); 

    const updated = await Investor.findOne({ piAddress: 'PIONEER_001' });
    // Verifies that the ledger was incremented only after a successful payout mock
    expect(updated.vestingMonthsCompleted).toBe(1);
  });

  /**
   * @test Failure Path - Transactional Resilience
   * @description Ensures the database remains unchanged (Rollback-safety) 
   * if the external Pi Network API fails.
   */
  test('Resilience: Database should not update if the Payout Service fails', async () => {
    // 1. SEED: Pioneer already 2 months into their vesting period
    await Investor.create({
      piAddress: 'PIONEER_FAIL',
      totalPiContributed: 5000,
      allocatedMapCap: 1000,
      vestingMonthsCompleted: 2
    });

    // 2. MOCK FAILURE: Simulate a network disruption or API error
    const transferSpy = jest.spyOn(PaymentService, 'transferPi').mockImplementation(() => {
        return Promise.reject(new Error('Nock: Disallowed net connect (Simulated Failure)'));
    });

    // 3. EXECUTE: Trigger the cycle
    const response = await request(app)
      .post('/api/v1/admin/settle-vesting')
      .set('x-admin-token', adminSecret);

    const unchanged = await Investor.findOne({ piAddress: 'PIONEER_FAIL' });
    
    /**
     * INTEGRITY CHECK: 
     * The month counter MUST NOT increase if the payment service failed.
     * This protects the ecosystem from over-distribution.
     */
    expect(unchanged.vestingMonthsCompleted).toBe(2);
    expect(transferSpy).toHaveBeenCalled();
  });
});
