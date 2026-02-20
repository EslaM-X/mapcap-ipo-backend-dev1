/**
 * Metrics Synchronization Integration Suite - System Pulse v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Real-time Market Data Integration
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented type-safe mocking for PriceService methods.
 * - Formalized the 'adminSecret' and 'admin-token' headers for RBAC parity.
 * - Aligned with ResponseHelper v1.7.5 structure for compliance verification.
 */

import { jest } from '@jest/globals'; 
import request from 'supertest';
import app from '../../server.js';
import GlobalConfig from '../../src/models/globalConfig.model.js';
import PriceService from '../../src/services/price.service.js';
import mongoose from 'mongoose';

describe('Metrics Synchronization - System Pulse Integration', () => {
  let adminSecret: string;

  // Extended timeout for complex aggregation queries on Node/Termux
  jest.setTimeout(30000);

  beforeAll(async (): Promise<void> => {
    if (mongoose.connection.readyState === 0) {
      const TEST_DB: string = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test';
      await mongoose.connect(TEST_DB);
    }
    // Synchronized with Daniel's Security Gate
    adminSecret = process.env.ADMIN_SECRET_TOKEN || 'test_admin_secret_123';
  });

  afterEach(async (): Promise<void> => {
    if (mongoose.connection.readyState !== 0) {
      await GlobalConfig.deleteMany({});
    }
    // Critical: Restore all mocks to avoid side-effects between test cases
    jest.restoreAllMocks();
  });

  afterAll(async (): Promise<void> => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  /**
   * @test Successful Market Data Aggregation
   * @description Verifies that the global pulse correctly reflects scarcity engine metrics.
   */
  test('Sync: Should return synchronized global pulse with scarcity metrics', async () => {
    /**
     * PRECISION MOCKING:
     * We simulate a specific spot price to verify dashboard fidelity.
     */
    const priceSpy = jest.spyOn(PriceService, 'calculateDailySpotPrice').mockReturnValue(0.000458);

    const response = await request(app)
      .get('/api/v1/stats') 
      .set('x-admin-token', adminSecret);

    expect(response.status).toBe(200);
    expect(priceSpy).toHaveBeenCalled();
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('spotPrice');
    
    /**
     * COMPLIANCE ALIGNMENT:
     * Ensuring the API adheres to the 6-decimal precision standard for ledger auditing.
     */
    if (response.body.data.compliance) {
      expect(response.body.data.compliance.precision).toBe("6-Decimal_Standard");
    }
  });

  /**
   * @test Faulty Internal Execution (Resilience)
   * @description Ensures the ResponseHelper dispatches a proper 500 error if the engine crashes.
   */
  test('Resilience: Should return 500 error if the Scarcity Engine fails', async () => {
    /**
     * ANOMALY INJECTION:
     * Forcing a runtime error to validate the global error interceptor.
     */
    jest.spyOn(PriceService, 'calculateDailySpotPrice')
      .mockImplementation(() => { throw new Error('Engine Failure'); });

    const response = await request(app)
      .get('/api/v1/stats')
      .set('x-admin-token', adminSecret);

    expect(response.status).toBe(500); 
    expect(response.body.success).toBe(false);
    
    // Matches the error propagation in the centralized API layer
    expect(response.body.message).toContain('Global Sync Failure');
  });
});
