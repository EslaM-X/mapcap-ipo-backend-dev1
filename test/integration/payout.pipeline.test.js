/**
 * Payout Pipeline Integration Suite - Financial Integrity v1.0.4
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Automated Vesting & Pi Transfer
 * -------------------------------------------------------------------------
 * FIX LOG:
 * - Security Protocol: Switched to 'x-admin-token' for alignment with v1.5.4.
 * - DB Strategy: Local MongoDB handshake to fix Termux binary download errors.
 * - Port Management: Optimized server listener for parallel testing.
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

  // Optimized timeout for financial logic and blockchain simulation
  jest.setTimeout(30000);

  beforeAll(async () => {
    // Dynamic port allocation to prevent EADDRINUSE during concurrent runs
    if (!app.listening) {
      server = app.listen(0); 
    }

    // Secure handshake with local testing database
    try {
      if (mongoose.connection.readyState === 0) {
        const TEST_DB = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test';
        await mongoose.connect(TEST_DB);
        console.log(`[PAYOUT_TEST]: Connected to ${TEST_DB}`);
      }
    } catch (error) {
      console.error("[PAYOUT_DB_ERROR]: Database connection failed.");
      throw error;
    }

    // Set administrative secret for secure job triggering
    adminSecret = process.env.ADMIN_SECRET_TOKEN || 'test_admin_secret_123';
  });

  afterEach(async () => {
    // Ensuring clean state for financial atomicity tests
    if (mongoose.connection.readyState !== 0) {
      await Investor.deleteMany({});
    }
    jest.restoreAllMocks(); 
  });

  afterAll(async () => {
    // Graceful resources teardown
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    if (server) await server.close(); 
  });

  /**
   * TEST: Successful Monthly Vesting Release
   * VERIFIES: Investor ledger increments and TXID is logged only after successful transfer.
   */
  test('Vesting Flow: Successful Pi transfer should update the investor ledger', async () => {
    const pioneer = await Investor.create({
      piAddress: 'PIONEER_PAYOUT_001',
      allocatedMapCap: 1000,
      vestingMonthsCompleted: 0,
      isWhale: false
    });

    // Mocking Pi Network Blockchain (Success Scenario)
    const paymentSpy = jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ 
      success: true, 
      txId: 'PI_BLOCK_999_SUCCESS' 
    });

    const response = await request(app)
      .post('/api/v1/admin/jobs/run-vesting')
      .set('x-admin-token', adminSecret); // Standardized header for Map-of-Pi security

    const updatedPioneer = await Investor.findById(pioneer._id);
    
    expect(response.status).toBe(200);
    expect(paymentSpy).toHaveBeenCalled();
    expect(updatedPioneer.vestingMonthsCompleted).toBe(1);
    expect(updatedPioneer.lastPayoutTxId).toBe('PI_BLOCK_999_SUCCESS');
  });

  /**
   * TEST: Payment Failure Resilience (Transactional Integrity)
   * VERIFIES: System does not increment vesting count if the blockchain transfer fails.
   */
  test('Resilience: Database should not update if the Payout Service fails', async () => {
    const pioneer = await Investor.create({
      piAddress: 'PIONEER_FAIL_TEST',
      allocatedMapCap: 1000,
      vestingMonthsCompleted: 2,
      isWhale: false
    });

    // Simulating external network error or congestion
    jest.spyOn(PaymentService, 'transferPi').mockRejectedValue(new Error('Blockchain Congestion'));

    const response = await request(app)
      .post('/api/v1/admin/jobs/run-vesting')
      .set('x-admin-token', adminSecret);

    const unchangedPioneer = await Investor.findById(pioneer._id);
    
    // Integrity Check: Counter must remain unchanged to prevent double-payout risk
    expect(unchangedPioneer.vestingMonthsCompleted).toBe(2);
    expect(response.status).toBe(500);
  });
});
