/**
 * UNIVERSAL TEST SETUP & DATABASE LIFECYCLE (Cross-Platform) v1.1.1
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Compliance & Quality Assurance
 * -------------------------------------------------------------------------
 * FIX LOG:
 * - Termux Optimization: Strictly bypasses 'mongodb-memory-server' by forcing 
 * Local or Cloud URI connection.
 * - Global Identity: Ensures ADMIN_SECRET_TOKEN is globally available for all suites.
 * - Connection Resilience: Forced IPv4 and increased timeouts for unstable networks.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Synchronizing environment variables before any test suite executes
dotenv.config();

/**
 * PRE-FLIGHT INITIALIZATION:
 * Centralized DB Handshake to prevent binary download failures in Termux.
 */
beforeAll(async () => {
  // CONFIGURATION: Priority 1: Cloud Atlas (Best for Termux) | Priority 2: Local DB
  const TEST_URI = process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/mapcap_test";
  
  // Enforcing Environment Consistency
  process.env.MONGO_URI = TEST_URI;
  process.env.NODE_ENV = 'test';
  
  // Critical for v1.5.4 AuthMiddleware compatibility across all test files
  process.env.ADMIN_SECRET_TOKEN = process.env.ADMIN_SECRET_TOKEN || 'secure_fallback_2026';

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(TEST_URI, {
        serverSelectionTimeoutMS: 10000, // Increased for Termux/Mobile data latency
        family: 4 // Essential: Prevents IPv6 resolution issues on Android
      });
      
      const isCloud = TEST_URI.includes('mongodb.net');
      console.log(`\n✅ TEST_ENGINE_READY: Connected to ${isCloud ? 'Remote Atlas' : 'Local Instance'}`);
    } catch (err) {
      console.error("\n❌ TEST_ENGINE_CRITICAL: Connection Failed.");
      console.error(`Reason: ${err.message}`);
      console.warn("💡 HINT: In Termux, if Local DB fails, please provide a MONGO_URI_TEST in .env");
      process.exit(1); 
    }
  }
});

/**
 * STATE HYGIENE (Post-Test Cleanup):
 * Maintains a clean ledger for each test case, reflecting Philip's "Clean-Start" MVP.
 */
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      try {
        await collections[key].deleteMany({});
      } catch (e) {
        // Silent catch to handle parallel operation locks
      }
    }
  }
});

/**
 * GRACEFUL SHUTDOWN:
 * Releases resource locks and terminates the database pool cleanly.
 */
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      // Optional: Clean purge of the transient test database
      await mongoose.connection.dropDatabase();
    } catch (e) {
      // Log skipped if permissions are restricted on remote Atlas
    }
    await mongoose.connection.close();
    console.log("🛑 TEST_ENGINE_OFFLINE: Resources deallocated.");
  }
});
