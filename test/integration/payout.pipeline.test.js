/**
 * Payout Pipeline Integration Suite - Financial Integrity v1.1.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Automated Vesting & Pi Transfer
 * -------------------------------------------------------------------------
 * FIX LOG:
 * - Redirected endpoints to /settle-vesting to ensure ledger increments.
 * - Mocked PayoutService & PaymentService to prevent ENOTFOUND on external APIs.
 * - Maintained Frontend compatibility by preserving response validation.
 */

import { jest } from '@jest/globals'; 
import request from 'supertest';
import app from '../../server.js';
import Investor from '../../src/models/investor.model.js';
import PaymentService from '../../src/services/payment.service.js';
import PayoutService from '../../src/services/payout.service.js'; // Added to prevent ENOTFOUND
import mongoose from 'mongoose';

describe('Payout Pipeline - End-to-End Financial Integration', () => {
  let adminSecret;
  let server;

  // Extended timeout to accommodate cryptographic operations and DB handshakes
  jest.setTimeout(30000);

  /**
   * Global Setup:
   * Initializes the server instance on a dynamic port and establishes 
   * a secure connection to the isolated test database environment.
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
      throw error;
    }
    // Using global secret consistent with setup.js
    adminSecret = process.env.ADMIN_SECRET_TOKEN || 'secure_fallback_2026';
  });

  /**
   * Teardown Logic:
   * Ensures state isolation by purging the Investor collection after each test.
   */
  afterEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      await Investor.deleteMany({});
    }
    jest.restoreAllMocks(); 
  });

  /**
   * Final Teardown:
   * Terminates active database connections and closes the server listener.
   */
  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    if (server) await server.close(); 
  });

  /**
   * @test Success Path - Monthly Vesting Release
   * @description Verifies that a successful Pi transfer triggers an incremental update 
   * to the investor's vesting progress via the /settle-vesting pipeline.
   */
  test('Vesting Flow: Successful Pi transfer should update the investor ledger', async () => {
    const pioneer = await Investor.create({
      piAddress: 'PIONEER_PAYOUT_001',
      allocatedMapCap: 1000,
      totalPiContributed: 5000,
      vestingMonthsCompleted: 0,
      isWhale: false
    });

    /**
     * DUAL-LAYER MOCKING:
     * Prevents ENOTFOUND by intercepting both payment engine possibilities.
     */
    const paymentSpy = jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ 
      success: true, 
      txId: 'PI_BLOCK_999_SUCCESS' 
    });
    
    // Also mock PayoutService as it is used by internal jobs
    jest.spyOn(PayoutService, 'executeA2UPayout').mockResolvedValue({ 
      success: true, 
      txId: 'ESCROW_MOCK_SUCCESS' 
    });

    /**
     * Action: Execute the dedicated Vesting Settlement endpoint.
     * Path: /api/v1/admin/settle-vesting
     */
    const response = await request(app)
      .post('/api/v1/admin/settle-vesting') 
      .set('x-admin-token', adminSecret);

    const updatedPioneer = await Investor.findById(pioneer._id);
    
    // Assertions: Validate HTTP status and ledger progression
    expect(response.status).toBe(200); 
    expect(paymentSpy).toHaveBeenCalled();
    expect(updatedPioneer.vestingMonthsCompleted).toBe(1);
  });

  /**
   * @test Failure Path - Transactional Resilience
   * @description Validates "Rollback" behavior: If the blockchain transfer fails, 
   * the database counter must remain unchanged.
   */
  test('Resilience: Database should not update if the Payout Service fails', async () => {
    const pioneer = await Investor.create({
      piAddress: 'PIONEER_FAIL_TEST',
      allocatedMapCap: 1000,
      totalPiContributed: 5000,
      vestingMonthsCompleted: 2,
      isWhale: false
    });

    // Simulating a network-level failure or API rejection
    jest.spyOn(PaymentService, 'transferPi').mockRejectedValue(new Error('Blockchain Congestion'));
    jest.spyOn(PayoutService, 'executeA2UPayout').mockRejectedValue(new Error('Escrow Pipeline Down'));

    const response = await request(app)
      .post('/api/v1/admin/settle-vesting')
      .set('x-admin-token', adminSecret);

    const unchangedPioneer = await Investor.findById(pioneer._id);
    
    /**
     * INTEGRITY CHECK: 
     * Even on failure, the system must return a structured response and keep the ledger intact.
     */
    expect(unchangedPioneer.vestingMonthsCompleted).toBe(2);
    expect(response.status).toBeLessThan(500); 
  });
});
