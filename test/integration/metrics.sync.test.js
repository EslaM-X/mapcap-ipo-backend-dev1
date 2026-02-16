/**
 * Metrics Synchronization Integration Suite - System Pulse v1.0.4
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Real-time Market Data Integration
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ALIGNMENT:
 * This suite validates the synchronization between PriceService and the 
 * Global Aggregate Pulse endpoint. Optimized for Termux & MERN stack.
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

  // Stability timeout for Termux environment and complex math operations
  jest.setTimeout(30000);

  beforeAll(async () => {
    // 1. Database Handshake: Direct connection for environment compatibility
    try {
      if (mongoose.connection.readyState === 0) {
        const TEST_DB = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test';
        await mongoose.connect(TEST_DB);
      }
    } catch (error) {
      console.error("[METRICS_DB_ERROR]: Database connection failed.");
      throw error;
    }

    // 2. Security Setup: Using the environment's secret token
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
   * ALIGNMENT: Updated to match GET /api/v1/stats defined in api.js
   */
  test('Sync: Should return synchronized global pulse with scarcity metrics', async () => {
    // Simulation: Price data formatting check
    const formattedPriceMock = "3.141592 Pi";
    
    // Spying on service layer to ensure it's called during the request
    const priceSpy = jest.spyOn(PriceService, 'calculateDailySpotPrice');

    const response = await request(app)
      .get('/api/v1/stats') // FIX: Route updated from /admin/sync/metrics to /stats
      .set('x-admin-token', adminSecret);

    // Assertions: Ensuring the API bridge is functional for Frontend consumption
    expect(response.status).toBe(200);
    expect(priceSpy).toHaveBeenCalled();
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('spotPrice');
    expect(response.body.data.compliance.precision).toBe("6-Decimal_Standard");
  });

  /**
   * TEST: Faulty Internal Execution (Resilience)
   * Ensures the system handles calculation or service errors gracefully.
   */
  test('Resilience: Should return 500 error if the Scarcity Engine fails', async () => {
    // Simulate an internal service crash
    jest.spyOn(PriceService, 'calculateDailySpotPrice')
      .mockImplementation(() => { throw new Error('Engine Failure'); });

    const response = await request(app)
      .get('/api/v1/stats')
      .set('x-admin-token', adminSecret);

    // Integrity Assertion: Frontend must receive a proper error status
    expect(response.status).toBe(500); 
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Global Sync Failure');
  });
});
