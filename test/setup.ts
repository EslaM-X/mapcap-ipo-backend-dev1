/**
 * UNIVERSAL TEST SETUP & DATABASE LIFECYCLE v1.7.5 (TypeScript)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Compliance & Quality Assurance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented strict typing for Mongoose connection and collections.
 * - Maintained IPv4 forcing (family: 4) for Termux/Android resilience.
 * - Preserved 'nock' lockdown logic to ensure Zero-Leakage during tests.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import nock from 'nock';

// Synchronizing environment variables before any test suite executes
dotenv.config();

/**
 * PRE-FLIGHT INITIALIZATION:
 * Centralized DB Handshake and Network Security Policy.
 */
beforeAll(async (): Promise<void> => {
  /**
   * SECURITY ENFORCEMENT:
   * Disables all real network connections to ensure tests are hermetic.
   * Only allows localhost for Supertest/Mongoose communication.
   */
  nock.disableNetConnect();
  nock.enableNetConnect(/(127.0.0.1|localhost)/);

  // CONFIGURATION: Priority 1: Cloud Atlas | Priority 2: Local DB
  const TEST_URI: string = process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/mapcap_test";
  
  // Enforcing Environment Consistency
  process.env.MONGO_URI = TEST_URI;
  process.env.NODE_ENV = 'test';
  
  // Critical for v1.5.4 AuthMiddleware compatibility
  process.env.ADMIN_SECRET_TOKEN = process.env.ADMIN_SECRET_TOKEN || 'secure_fallback_2026';

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(TEST_URI, {
        serverSelectionTimeoutMS: 10000, 
        family: 4 // Essential: Prevents IPv6 resolution issues on Android/Termux
      });
      
      const isCloud: boolean = TEST_URI.includes('mongodb.net');
      console.log(`\n✅ TEST_ENGINE_READY: Connected to ${isCloud ? 'Remote Atlas' : 'Local Instance'}`);
      console.log(`🔒 NETWORK_LOCKDOWN: External API calls disabled (Nock Active).`);
    } catch (err: any) {
      console.error("\n❌ TEST_ENGINE_CRITICAL: Connection Failed.");
      console.error(`Reason: ${err.message}`);
      process.exit(1); 
    }
  }
});

/**
 * STATE HYGIENE (Post-Test Cleanup):
 * Maintains a clean ledger for each test case, reflecting Philip's "Clean-Start" MVP.
 */
afterEach(async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      try {
        await collections[key].deleteMany({});
      } catch (e) {
        // Silent catch for locked or restricted collections
      }
    }
  }
  // Clear all nock interceptors to ensure test isolation
  nock.cleanAll();
});

/**
 * GRACEFUL SHUTDOWN:
 * Releases resource locks and restores network connectivity for the environment.
 */
afterAll(async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    try {
      // Clean purge of the transient test database for storage efficiency
      await mongoose.connection.dropDatabase();
    } catch (e) {
      // Log skipped if permissions are restricted in cloud environments
    }
    await mongoose.connection.close();
    
    // Re-enable network for subsequent environment processes
    nock.restore();
    nock.enableNetConnect();
    
    console.log("🛑 TEST_ENGINE_OFFLINE: Resources deallocated.");
  }
});
