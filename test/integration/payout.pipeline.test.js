/**
 * Payout Pipeline Integration Suite - Financial Integrity v1.0.3
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Automated Vesting & Pi Transfer
 * -------------------------------------------------------------------------
 * DESCRIPTION:
 * Validates the end-to-end financial orchestration for Pi distributions.
 * Ensures transactional atomicity between the Blockchain layer and MongoDB.
 * -------------------------------------------------------------------------
 * UPDATES:
 * - ESM Jest Integration: Explicitly managed @jest/globals context.
 * - Resilience: Verified transactional rollback on blockchain failure.
 * - Port Guard: Dynamic allocation to prevent EADDRINUSE in CI/CD.
 */

import { jest } from '@jest/globals'; 
import request from 'supertest';
import app from '../../server.js';
import Investor from '../../src/models/investor.model.js';
import PaymentService from '../../src/services/payment.service.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('Payout Pipeline - End-to-End Financial Integration', () => {
  let adminToken;
  let server;

  // Set timeout for complex financial operations and DB updates
  jest.setTimeout(30000);

  beforeAll(async () => {
    // PORT COLLISION FIX: Use dynamic port for parallel test execution stability
    if (!app.listening) {
      server = app.listen(0); 
    }

    // Ensure secure handshake with the testing database cluster
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test');
    }

    // Generate administrative token with strict role enforcement for financial routes
    adminToken = jwt.sign(
      { id: 'admin_payout_manager', role: 'admin' }, 
      process.env.JWT_SECRET || 'test_secret_key',
      { expiresIn: '1h' }
    );
  });

  afterEach(async () => {
    // Maintain idempotent state by cleaning collections and resetting spies
    if (mongoose.connection.readyState !== 0) {
      await Investor.deleteMany({});
    }
    jest.restoreAllMocks(); 
  });

  afterAll(async () => {
    // Graceful teardown of DB connections and HTTP listeners
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

    // Mocking the external Pi Network Blockchain response (Success Scenario)
    const paymentSpy = jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ 
      success: true, 
      txId: 'PI_BLOCK_999_SUCCESS' 
    });

    const response = await request(app)
      .post('/api/v1/admin/jobs/run-vesting')
      .set('Authorization', `Bearer ${adminToken}`);

    // Verification of high-fidelity data state in the ledger
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

    // Simulating external network error or Pi Blockchain congestion
    jest.spyOn(PaymentService, 'transferPi').mockRejectedValue(new Error('Blockchain Congestion'));

    const response = await request(app)
      .post('/api/v1/admin/jobs/run-vesting')
      .set('Authorization', `Bearer ${adminToken}`);

    const unchangedPioneer = await Investor.findById(pioneer._id);
    
    // Integrity Check: Counter must remain unchanged to prevent financial discrepancies
    expect(unchangedPioneer.vestingMonthsCompleted).toBe(2);
    // Ensure the failure is communicated to the Admin dashboard
    expect(response.status).toBe(500);
  });
});
