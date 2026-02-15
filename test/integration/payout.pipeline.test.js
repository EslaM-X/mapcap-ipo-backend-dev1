/**
 * Payout Pipeline Integration Suite - Financial Integrity v1.0.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: A2UaaS (App-to-User) Execution Flow
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite validates the high-stakes connection between the Vesting Jobs 
 * and the Blockchain Payout Service. It ensures that successful transfers 
 * correctly update the ledger, while failed ones preserve data integrity.
 * -------------------------------------------------------------------------
 */

import request from 'supertest';
import app from '../../server.js';
import Investor from '../../src/models/investor.model.js';
import PaymentService from '../../src/services/payment.service.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('Payout Pipeline - End-to-End Financial Integration', () => {
  let adminToken;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/mapcap_test');
    }

    // Admin token required to trigger the manual payout/vesting endpoints
    adminToken = jwt.sign({ id: 'admin_id', role: 'admin' }, process.env.JWT_SECRET || 'test_secret');
  });

  afterEach(async () => {
    await Investor.deleteMany({});
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  /**
   * SCENARIO: Successful Monthly Vesting Release
   * REQUIREMENT: When the PayoutService returns success, the investor's 
   * 'vestingMonthsCompleted' must increment in the real database.
   */
  test('Vesting Flow: Successful Pi transfer should update the investor ledger', async () => {
    // 1. Seed a compliant investor
    const pioneer = await Investor.create({
      piAddress: 'PIONEER_PAYOUT_001',
      allocatedMapCap: 1000,
      vestingMonthsCompleted: 0,
      isWhale: false
    });

    /**
     * INTERCEPTING THE BLOCKCHAIN:
     * We mock the low-level Pi Network SDK call to simulate a 
     * successful transaction on the Pi Mainnet/Testnet.
     */
    const paymentSpy = jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ 
      success: true, 
      txId: 'PI_BLOCK_999' 
    });

    // 2. Trigger the vesting release via protected admin endpoint
    const response = await request(app)
      .post('/api/v1/admin/jobs/run-vesting')
      .set('Authorization', `Bearer ${adminToken}`);

    // 3. Verify Database Integrity
    const updatedPioneer = await Investor.findById(pioneer._id);
    
    expect(response.status).toBe(200);
    expect(paymentSpy).toHaveBeenCalled();
    expect(updatedPioneer.vestingMonthsCompleted).toBe(1); // Real DB update check
    expect(updatedPioneer.lastPayoutTxId).toBe('PI_BLOCK_999');
  });

  /**
   * SCENARIO: Payment Failure Resilience
   * REQUIREMENT: If the Pi Network SDK fails, the database must NOT 
   * increment the vesting month to allow for a retry later.
   */
  test('Resilience: Database should not update if the Payout Service fails', async () => {
    const pioneer = await Investor.create({
      piAddress: 'PIONEER_FAIL_TEST',
      allocatedMapCap: 1000,
      vestingMonthsCompleted: 2,
      isWhale: false
    });

    // Simulate a network failure or insufficient balance in the app wallet
    jest.spyOn(PaymentService, 'transferPi').mockRejectedValue(new Error('Blockchain Congestion'));

    await request(app)
      .post('/api/v1/admin/jobs/run-vesting')
      .set('Authorization', `Bearer ${adminToken}`);

    const unchangedPioneer = await Investor.findById(pioneer._id);
    
    // Ledger Integrity Check: Should still be 2, not 3.
    expect(unchangedPioneer.vestingMonthsCompleted).toBe(2);
  });
});

