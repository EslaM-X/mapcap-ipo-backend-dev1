/**
 * Payout Pipeline Integration Suite - Financial Integrity v1.0.2
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Automated Vesting & Pi Transfer
 * -------------------------------------------------------------------------
 * UPDATES:
 * - ESM Jest Integration: Explicitly imported @jest/globals to fix ReferenceError.
 * - Port Collision Guard: Implemented dynamic port allocation for CI/CD stability.
 * - Persistence Check: Validating database state consistency after blockchain events.
 */

import { jest } from '@jest/globals'; // CRITICAL: Fixes 'ReferenceError: jest is not defined' in ESM
import request from 'supertest';
import app from '../../server.js';
import Investor from '../../src/models/investor.model.js';
import PaymentService from '../../src/services/payment.service.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('Payout Pipeline - End-to-End Financial Integration', () => {
  let adminToken;
  let server;

  beforeAll(async () => {
    // PORT COLLISION FIX: Start server on a dynamic port for parallel testing
    if (!app.listening) {
      server = app.listen(0); 
    }

    // Ensure database connection is active before executing transactions
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test');
    }

    // Generate administrative token for secure financial route access
    adminToken = jwt.sign(
      { id: 'admin_id', role: 'admin' }, 
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1h' }
    );
  });

  afterEach(async () => {
    // Systematic cleanup to maintain test isolation and data integrity
    await Investor.deleteMany({});
    jest.restoreAllMocks(); 
  });

  afterAll(async () => {
    // Graceful teardown of network listeners and DB connection pool
    await mongoose.connection.close();
    if (server) await server.close(); 
  });

  /**
   * SCENARIO: Successful Monthly Vesting Release
   * REQUIREMENT: When the vesting job triggers, the Pi transfer must occur 
   * and the investor ledger must increment months and log the TXID.
   */
  test('Vesting Flow: Successful Pi transfer should update the investor ledger', async () => {
    const pioneer = await Investor.create({
      piAddress: 'PIONEER_PAYOUT_001',
      allocatedMapCap: 1000,
      vestingMonthsCompleted: 0,
      isWhale: false
    });

    // Mocking the external Pi Network Blockchain response
    const paymentSpy = jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ 
      success: true, 
      txId: 'PI_BLOCK_999' 
    });

    const response = await request(app)
      .post('/api/v1/admin/jobs/run-vesting')
      .set('Authorization', `Bearer ${adminToken}`);

    // Verification of the updated state in the ledger
    const updatedPioneer = await Investor.findById(pioneer._id);
    
    expect(response.status).toBe(200);
    expect(paymentSpy).toHaveBeenCalled();
    expect(updatedPioneer.vestingMonthsCompleted).toBe(1);
    expect(updatedPioneer.lastPayoutTxId).toBe('PI_BLOCK_999');
  });

  /**
   * SCENARIO: Payment Failure Resilience
   * REQUIREMENT: If the blockchain service fails, the database must not 
   * update the vesting count (Transactional Integrity).
   */
  test('Resilience: Database should not update if the Payout Service fails', async () => {
    const pioneer = await Investor.create({
      piAddress: 'PIONEER_FAIL_TEST',
      allocatedMapCap: 1000,
      vestingMonthsCompleted: 2,
      isWhale: false
    });

    // Simulating external network error or blockchain congestion
    jest.spyOn(PaymentService, 'transferPi').mockRejectedValue(new Error('Blockchain Congestion'));

    await request(app)
      .post('/api/v1/admin/jobs/run-vesting')
      .set('Authorization', `Bearer ${adminToken}`);

    const unchangedPioneer = await Investor.findById(pioneer._id);
    
    // Integrity Check: Counter must remain at 2
    expect(unchangedPioneer.vestingMonthsCompleted).toBe(2);
  });
});
