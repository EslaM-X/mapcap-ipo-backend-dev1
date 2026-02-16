/**
 * Payout Pipeline Integration Suite - Financial Integrity v1.2.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Automated Vesting & Pi Transfer
 * -------------------------------------------------------------------------
 * FINAL AUDIT FIXES (2026-02-16):
 * - Unified Mocking Strategy: Focused on PayoutService to align with Controller logic.
 * - Network Shielding: Prevented 'getaddrinfo' errors by intercepting A2UaaS calls.
 * - Contract Stability: Maintained existing API routes and response structures.
 * - Environment Compatibility: Optimized for Termux/Vercel serverless runtime.
 */

import { jest } from '@jest/globals'; 
import request from 'supertest';
import app from '../../server.js';
import Investor from '../../src/models/investor.model.js';
import PaymentService from '../../src/services/payment.service.js';
import PayoutService from '../../src/services/payout.service.js';
import mongoose from 'mongoose';

describe('Payout Pipeline - End-to-End Financial Integration', () => {
  let adminSecret;
  let server;

  // Global timeout for blockchain-simulated handshakes
  jest.setTimeout(30000);

  /**
   * Global Setup:
   * Establishes server instance and secure DB connectivity.
   */
  beforeAll(async () => {
    if (!app.listening) {
      server = app.listen(0); 
    }
    try {
      if (mongoose.connection.readyState === 0) {
        const TEST_DB = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test';
        await mongoose.connect(TEST_DB);
      }
    } catch (error) {
      console.error("Test DB Setup Failed:", error);
    }
    adminSecret = process.env.ADMIN_SECRET_TOKEN || 'secure_fallback_2026';
  });

  /**
   * Cleanup Logic:
   * Purges database state and restores mocks to maintain isolation.
   */
  afterEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      await Investor.deleteMany({});
    }
    jest.restoreAllMocks(); 
    jest.clearAllMocks();
  });

  /**
   * Final Teardown:
   * Gracefully closes all persistent resources.
   */
  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    if (server) await server.close(); 
  });

  /**
   * @test Success Path - Monthly Vesting Release
   * @description Validates that a successful A2U transfer increments the vesting ledger.
   * Ensures the Frontend receives a 200 OK and valid status metadata.
   */
  test('Vesting Flow: Successful Pi transfer should update the investor ledger', async () => {
    // 1. Seed specific test pioneer
    const pioneer = await Investor.create({
      piAddress: 'PIONEER_PAYOUT_001',
      allocatedMapCap: 1000,
      totalPiContributed: 5000,
      vestingMonthsCompleted: 0,
      isWhale: false
    });

    /**
     * PRECISION MOCKING:
     * We spy on PayoutService.executeA2UPayout because the Controller triggers 
     * this specific A2UaaS logic for settlement.
     */
    const payoutSpy = jest.spyOn(PayoutService, 'executeA2UPayout').mockResolvedValue({ 
      success: true, 
      txId: 'MOCK_PI_TX_VESTING_SUCCESS_2026' 
    });

    // Mocking PaymentService as a safety layer for alternative paths
    jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ 
      success: true, 
      txId: 'MOCK_DIRECT_TRANSFER_SUCCESS' 
    });

    // 2. Execute the administrative settlement trigger
    const response = await request(app)
      .post('/api/v1/admin/settle-vesting') 
      .set('x-admin-token', adminSecret);

    // 3. Fetch updated state from Atlas/LocalDB
    const updatedPioneer = await Investor.findById(pioneer._id);
    
    // Assertions: Integrity check
    expect(response.status).toBe(200); 
    expect(payoutSpy).toHaveBeenCalled(); // Verification of the actual execution unit
    expect(updatedPioneer.vestingMonthsCompleted).toBe(1);
    expect(response.body.success).toBe(true);
  });

  /**
   * @test Failure Path - Transactional Resilience
   * @description Ensures no ledger increment occurs if the Pi Network API is unreachable.
   * Protects the financial pipeline from "false-positive" database updates.
   */
  test('Resilience: Database should not update if the Payout Service fails', async () => {
    // 1. Seed failure-scenario pioneer
    const pioneer = await Investor.create({
      piAddress: 'PIONEER_FAIL_TEST',
      allocatedMapCap: 1000,
      totalPiContributed: 5000,
      vestingMonthsCompleted: 2,
      isWhale: false
    });

    // 2. Simulate API Outage (getaddrinfo failure scenario)
    jest.spyOn(PayoutService, 'executeA2UPayout').mockRejectedValue(new Error('A2UaaS pipeline disrupted'));
    jest.spyOn(PaymentService, 'transferPi').mockRejectedValue(new Error('Network Unreachable'));

    // 3. Execute request
    const response = await request(app)
      .post('/api/v1/admin/settle-vesting')
      .set('x-admin-token', adminSecret);

    const unchangedPioneer = await Investor.findById(pioneer._id);
    
    /**
     * INTEGRITY CHECK: 
     * The month counter MUST NOT increase if the payment failed.
     */
    expect(unchangedPioneer.vestingMonthsCompleted).toBe(2);
    expect(response.status).toBeLessThan(500); // Should handle gracefully (400 or 200 with partial failure)
  });
});
