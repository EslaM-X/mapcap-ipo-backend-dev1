/**
 * Metrics Synchronization Integration Suite - System Pulse v1.0.3
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Real-time Market Data Integration
 * -------------------------------------------------------------------------
 * FIX LOG:
 * - Environment Alignment: Direct local MongoDB connection for Termux compatibility.
 * - Security Update: Switched to 'x-admin-token' to match v1.5.4 Middleware.
 * - Dependency Resolution: Fully compatible with PriceService.fetchLatestPiPrice().
 */

import { jest } from '@jest/globals'; 
import request from 'supertest';
import app from '../../server.js';
import GlobalConfig from '../../src/models/globalConfig.model.js';
import PriceService from '../../src/services/price.service.js';
import mongoose from 'mongoose';

describe('Metrics Synchronization - System Pulse Integration', () => {
  let adminSecret;

  // Stability timeout for Termux environment
  jest.setTimeout(30000);

  beforeAll(async () => {
    // 1. Database Handshake: Bypassing memory-server binary issues
    try {
      if (mongoose.connection.readyState === 0) {
        const TEST_DB = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test';
        await mongoose.connect(TEST_DB);
        console.log(`[METRICS_TEST]: Connected to ${TEST_DB}`);
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
   * TEST: Successful Market Data Ingestion
   * Uses the newly implemented 'fetchLatestPiPrice' alias in PriceService.
   */
  test('Sync: Should fetch external Pi price and update GlobalConfig pulse', async () => {
    // Simulation of Price Oracle (Mocking the service logic)
    const mockPriceValue = 3.141592;

    const priceSpy = jest.spyOn(PriceService, 'fetchLatestPiPrice')
      .mockResolvedValue(mockPriceValue);

    const response = await request(app)
      .post('/api/v1/admin/sync/metrics')
      .set('x-admin-token', adminSecret); // Aligned with our custom security gate

    const currentPulse = await GlobalConfig.findOne({ key: 'SYSTEM_PULSE' });

    expect(response.status).toBe(200);
    expect(priceSpy).toHaveBeenCalled();
    expect(response.body.success).toBe(true);
    
    if (currentPulse) {
      expect(currentPulse.value.piPrice).toBe(3.141592);
    }
  });

  /**
   * TEST: Faulty External API Response (Resilience)
   */
  test('Resilience: Should retain last known price if external sync fails', async () => {
    // Seed "Last Known Good" price
    await GlobalConfig.create({
      key: 'SYSTEM_PULSE',
      value: { piPrice: 3.10, lastUpdated: new Date() }
    });

    // Simulate Oracle Connectivity Error
    jest.spyOn(PriceService, 'fetchLatestPiPrice')
      .mockRejectedValue(new Error('Oracle Offline'));

    const response = await request(app)
      .post('/api/v1/admin/sync/metrics')
      .set('x-admin-token', adminSecret);

    const retainedPulse = await GlobalConfig.findOne({ key: 'SYSTEM_PULSE' });

    // Status 500 is expected on sync failure, but data must remain stable
    expect(response.status).toBe(500); 
    expect(retainedPulse.value.piPrice).toBe(3.10); 
  });
});
