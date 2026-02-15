/**
 * Payout Pipeline Integration Suite - Financial Integrity v1.0.1
 * -------------------------------------------------------------------------
 * Fixed: ESM Jest Global reference & Port Collision management.
 * -------------------------------------------------------------------------
 */

import { jest } from '@jest/globals'; // CRITICAL: Import jest for ESM
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
    // Port Collision Fix: Start server on a dynamic port for integration tests
    if (!app.listening) {
      server = app.listen(0); 
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/mapcap_test');
    }

    adminToken = jwt.sign(
      { id: 'admin_id', role: 'admin' }, 
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1h' }
    );
  });

  afterEach(async () => {
    await Investor.deleteMany({});
    jest.restoreAllMocks(); // Now works because of explicit import
  });

  afterAll(async () => {
    await mongoose.connection.close();
    if (server) await server.close(); // Clean teardown to prevent worker leaks
  });

  /**
   * SCENARIO: Successful Monthly Vesting Release
   */
  test('Vesting Flow: Successful Pi transfer should update the investor ledger', async () => {
    const pioneer = await Investor.create({
      piAddress: 'PIONEER_PAYOUT_001',
      allocatedMapCap: 1000,
      vestingMonthsCompleted: 0,
      isWhale: false
    });

    // Mocking the Payment Service
    const paymentSpy = jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ 
      success: true, 
      txId: 'PI_BLOCK_999' 
    });

    const response = await request(app)
      .post('/api/v1/admin/jobs/run-vesting')
      .set('Authorization', `Bearer ${adminToken}`);

    const updatedPioneer = await Investor.findById(pioneer._id);
    
    expect(response.status).toBe(200);
    expect(paymentSpy).toHaveBeenCalled();
    expect(updatedPioneer.vestingMonthsCompleted).toBe(1);
    expect(updatedPioneer.lastPayoutTxId).toBe('PI_BLOCK_999');
  });

  /**
   * SCENARIO: Payment Failure Resilience
   */
  test('Resilience: Database should not update if the Payout Service fails', async () => {
    const pioneer = await Investor.create({
      piAddress: 'PIONEER_FAIL_TEST',
      allocatedMapCap: 1000,
      vestingMonthsCompleted: 2,
      isWhale: false
    });

    jest.spyOn(PaymentService, 'transferPi').mockRejectedValue(new Error('Blockchain Congestion'));

    await request(app)
      .post('/api/v1/admin/jobs/run-vesting')
      .set('Authorization', `Bearer ${adminToken}`);

    const unchangedPioneer = await Investor.findById(pioneer._id);
    
    expect(unchangedPioneer.vestingMonthsCompleted).toBe(2);
  });
});
