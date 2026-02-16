/**
 * Metrics Synchronization Integration Suite - System Pulse v1.0.2
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Real-time Market Data Integration
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Validates the automated data-fetching pipeline. It ensures that external 
 * market metrics (Pi price) are ingested, standardized, and persisted 
 * without breaking the Pulse Dashboard in the MERN Frontend.
 * -------------------------------------------------------------------------
 */

import { jest } from '@jest/globals'; // CRITICAL: Enables Jest mocks in ESM environment
import request from 'supertest';
import app from '../../server.js';
import GlobalConfig from '../../src/models/globalConfig.model.js';
import PriceService from '../../src/services/price.service.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('Metrics Synchronization - System Pulse Integration', () => {
  let adminToken;

  // Extended timeout to handle external service simulation & DB write latency
  jest.setTimeout(20000);

  beforeAll(async () => {
    // Establishing secure handshake with the designated testing cluster
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/mapcap_test');
    }
    // Generate valid administrative payload for secure route access
    adminToken = jwt.sign(
      { id: 'admin_id_metrics', role: 'admin' }, 
      process.env.JWT_SECRET || 'test_secret_key'
    );
  });

  afterEach(async () => {
    // Isolation: Clean up configurations and reset spies after each test case
    if (mongoose.connection.readyState !== 0) {
      await GlobalConfig.deleteMany({});
    }
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    // Graceful teardown of the database connection pool
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  /**
   * TEST: Successful Market Data Ingestion
   * VERIFIES: GlobalConfig correctly reflects updated Pi-to-USD rate for Frontend consumption.
   */
  test('Sync: Should fetch external Pi price and update GlobalConfig pulse', async () => {
    // 1. Mocking the external API response (Simulation of Price Oracle)
    const mockPriceData = {
      pair: 'PI/USD',
      price: 3.141592,
      lastUpdated: new Date()
    };

    const priceSpy = jest.spyOn(PriceService, 'fetchLatestPiPrice')
      .mockResolvedValue(mockPriceData);

    // 2. Trigger the sync via the Admin/Cron protected endpoint
    const response = await request(app)
      .post('/api/v1/admin/sync/metrics')
      .set('Authorization', `Bearer ${adminToken}`);

    // 3. Verify Database Persistence and Synchronization Integrity
    const currentPulse = await GlobalConfig.findOne({ key: 'SYSTEM_PULSE' });

    expect(response.status).toBe(200);
    expect(priceSpy).toHaveBeenCalled();
    expect(currentPulse.value.piPrice).toBe(3.141592);
    expect(response.body.success).toBe(true);
  });

  /**
   * TEST: Faulty External API Response (Resilience)
   * VERIFIES: System retains last known good price to prevent UI breakage (Stale Data Strategy).
   */
  test('Resilience: Should retain last known price if external sync fails', async () => {
    // 1. Seed the database with a "Last Known Good" price for recovery testing
    await GlobalConfig.create({
      key: 'SYSTEM_PULSE',
      value: { piPrice: 3.10, lastUpdated: new Date() }
    });

    // 2. Simulate external API failure (Timeout or Oracle Connectivity Error)
    jest.spyOn(PriceService, 'fetchLatestPiPrice')
      .mockRejectedValue(new Error('Oracle Offline'));

    const response = await request(app)
      .post('/api/v1/admin/sync/metrics')
      .set('Authorization', `Bearer ${adminToken}`);

    // 3. Verify stability: Ensure the stale price remains consistent in the ledger
    const retainedPulse = await GlobalConfig.findOne({ key: 'SYSTEM_PULSE' });

    // Expecting 500 status due to service failure, but data integrity must be preserved
    expect(response.status).toBe(500); 
    expect(retainedPulse.value.piPrice).toBe(3.10); 
  });
});
