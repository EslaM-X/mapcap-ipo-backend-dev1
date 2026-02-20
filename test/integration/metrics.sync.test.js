/**
 * Metrics Synchronization Integration Suite - System Pulse v1.0.5
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Real-time Market Data Integration
 * -------------------------------------------------------------------------
 */

import { jest } from '@jest/globals'; 
import request from 'supertest';
import app from '../../server.js';
import GlobalConfig from '../../src/models/globalConfig.model.js';
import PriceService from '../../src/services/price.service.js';
import mongoose from 'mongoose';

describe('Metrics Synchronization - System Pulse Integration', () => {
  let adminSecret;

  jest.setTimeout(30000);

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      const TEST_DB = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test';
      await mongoose.connect(TEST_DB);
    }
    adminSecret = process.env.ADMIN_SECRET_TOKEN || 'test_admin_secret_123';
  });

  afterEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      await GlobalConfig.deleteMany({});
    }
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  /**
   * TEST: Successful Market Data Aggregation
   */
  test('Sync: Should return synchronized global pulse with scarcity metrics', async () => {
    // Mocking service to ensure predictable result during test
    const priceSpy = jest.spyOn(PriceService, 'calculateDailySpotPrice').mockReturnValue(0.000458);

    const response = await request(app)
      .get('/api/v1/stats') 
      .set('x-admin-token', adminSecret);

    expect(response.status).toBe(200);
    expect(priceSpy).toHaveBeenCalled();
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('spotPrice');
    // Aligning with ResponseHelper structure
    expect(response.body.data.compliance.precision).toBe("6-Decimal_Standard");
  });

  /**
   * TEST: Faulty Internal Execution (Resilience)
   */
  test('Resilience: Should return 500 error if the Scarcity Engine fails', async () => {
    // Force an error to test the catch block in api.js
    jest.spyOn(PriceService, 'calculateDailySpotPrice')
      .mockImplementation(() => { throw new Error('Engine Failure'); });

    const response = await request(app)
      .get('/api/v1/stats')
      .set('x-admin-token', adminSecret);

    expect(response.status).toBe(500); 
    expect(response.body.success).toBe(false);
    // Matches the error message in api.js
    expect(response.body.message).toContain('Global Sync Failure');
  });
});
