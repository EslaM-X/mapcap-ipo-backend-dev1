/**
 * Payout Pipeline Integration Suite - Financial Integrity v1.0.7
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Automated Vesting & Pi Transfer
 * -------------------------------------------------------------------------
 * Description: 
 * Validates the end-to-end flow of the Pi Network payout engine, ensuring 
 * transactional atomicity between the blockchain service and the database ledger.
 * Optimized to prevent 400 Bad Request by seeding initial liquidity.
 */

import { jest } from '@jest/globals'; 
import request from 'supertest';
import app from '../../server.js';
import Investor from '../../src/models/investor.model.js';
import PaymentService from '../../src/services/payment.service.js';
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
    adminSecret = process.env.ADMIN_SECRET_TOKEN || 'test_admin_secret_123';
  });

  /**
   * Teardown Logic:
   * Ensures state isolation by purging the Investor collection after each test 
   * and restoring mocked services to prevent side-effect leakage.
   */
  afterEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      await Investor.deleteMany({});
    }
    jest.restoreAllMocks(); 
  });

  /**
   * Final Teardown:
   * Terminates active database connections and closes the server listener 
   * to ensure a clean process exit and prevent memory leaks.
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
   * to the investor's vesting progress. 
   * NOTE: Seeding 'totalPiContributed' is CRITICAL to bypass the 400 Liquidity Guard.
   */
  test('Vesting Flow: Successful Pi transfer should update the investor ledger', async () => {
    const pioneer = await Investor.create({
      piAddress: 'PIONEER_PAYOUT_001',
      allocatedMapCap: 1000,
      totalPiContributed: 5000, // CRITICAL: Added to satisfy AdminController Liquidity Check
      vestingMonthsCompleted: 0,
      isWhale: false
    });

    // Mocking Pi Network Blockchain provider with a successful transaction response
    const paymentSpy = jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ 
      success: true, 
      txId: 'PI_BLOCK_999_SUCCESS' 
    });

    /**
     * Action: Execute the settlement endpoint via administrative authorization.
     * Path: /api/v1/admin/settle
     */
    const response = await request(app)
      .post('/api/v1/admin/settle') 
      .set('x-admin-token', adminSecret);

    const updatedPioneer = await Investor.findById(pioneer._id);
    
    // Assertions: Validate HTTP status (200 OK or 201 Created)
    expect(response.status).toBeLessThan(400); 
    expect(paymentSpy).toHaveBeenCalled();
    // Ensuring the ledger reflects the progression
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
      totalPiContributed: 5000, // Seeded to bypass initial liquidity check
      vestingMonthsCompleted: 2,
      isWhale: false
    });

    // Simulating a network-level failure
    jest.spyOn(PaymentService, 'transferPi').mockRejectedValue(new Error('Blockchain Congestion'));

    const response = await request(app)
      .post('/api/v1/admin/settle')
      .set('x-admin-token', adminSecret);

    const unchangedPioneer = await Investor.findById(pioneer._id);
    
    /**
     * ALIGNMENT FIX: 
     * If the service fails, we ensure the DB record remains intact (no increment).
     */
    expect(unchangedPioneer.vestingMonthsCompleted).toBe(2);
    // Based on AdminController logic, it might return 200 with partial success or 400
    expect(response.status).toBeLessThan(500); 
  });
});
