/**
 * Metrics Synchronization Integration Suite - System Pulse v1.0.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Real-time Market Data Integration
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite validates the automated data-fetching pipeline. It ensures that
 * external market metrics (like Pi price) are correctly ingested, 
 * standardized, and persisted to the global configuration ledger.
 * -------------------------------------------------------------------------
 */

import request from 'supertest';
import app from '../../server.js';
import GlobalConfig from '../../src/models/globalConfig.model.js';
import PriceService from '../../src/services/price.service.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('Metrics Synchronization - System Pulse Integration', () => {
  let adminToken;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/mapcap_test');
    }
    adminToken = jwt.sign({ id: 'admin_id', role: 'admin' }, process.env.JWT_SECRET || 'test_secret');
  });

  afterEach(async () => {
    await GlobalConfig.deleteMany({});
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  /**
   * SCENARIO: Successful Market Data Ingestion
   * REQUIREMENT: When the PriceService fetches new data, the GlobalConfig 
   * must reflect the updated Pi-to-USD rate and the timestamp.
   */
  test('Sync: Should fetch external Pi price and update GlobalConfig pulse', async () => {
    // 1. Mocking the external API response (e.g., from a Price Oracle)
    const mockPriceData = {
      pair: 'PI/USD',
      price: 3.141592,
      lastUpdated: new Date()
    };

    const priceSpy = jest.spyOn(PriceService, 'fetchLatestPiPrice')
      .mockResolvedValue(mockPriceData);

    // 2. Trigger the sync via the Admin/Cron endpoint
    const response = await request(app)
      .post('/api/v1/admin/sync/metrics')
      .set('Authorization', `Bearer ${adminToken}`);

    // 3. Verify Database Persistence
    const currentPulse = await GlobalConfig.findOne({ key: 'SYSTEM_PULSE' });

    expect(response.status).toBe(200);
    expect(priceSpy).toHaveBeenCalled();
    expect(currentPulse.value.piPrice).toBe(3.141592);
    expect(response.body.success).toBe(true);
  });

  /**
   * SCENARIO: Faulty External API Response
   * REQUIREMENT: If the external price source is down, the system must 
   * retain the last known good price (Stale-While-Revalidate pattern).
   */
  test('Resilience: Should retain last known price if external sync fails', async () => {
    // 1. Seed the database with a "Last Known Good" price
    await GlobalConfig.create({
      key: 'SYSTEM_PULSE',
      value: { piPrice: 3.10, lastUpdated: new Date() }
    });

    // 2. Simulate external API failure (Timeout or Error)
    jest.spyOn(PriceService, 'fetchLatestPiPrice')
      .mockRejectedValue(new Error('Oracle Offline'));

    const response = await request(app)
      .post('/api/v1/admin/sync/metrics')
      .set('Authorization', `Bearer ${adminToken}`);

    // 3. Verify that the price was NOT wiped out
    const retainedPulse = await GlobalConfig.findOne({ key: 'SYSTEM_PULSE' });

    expect(response.status).toBe(500); // Or 200 with a warning message depending on your logic
    expect(retainedPulse.value.piPrice).toBe(3.10); // Price remains stable
  });
});

