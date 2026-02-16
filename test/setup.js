/**
 * UNIVERSAL TEST SETUP & DATABASE LIFECYCLE (Cross-Platform)
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Orchestrates database connectivity for Integration Tests. Designed to be 
 * platform-agnostic, supporting Termux (via Cloud URI) and Desktop OS 
 * (via Local/Memory URI). Ensures idempotent test environments.
 * -------------------------------------------------------------------------
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables for test configuration
dotenv.config();

/**
 * PRE-FLIGHT INITIALIZATION:
 * Establishes a connection to the test database. Priority is given to 
 * MONGO_URI_TEST (Cloud/Atlas) for Termux compatibility, with a 
 * local fallback for standard development environments.
 */
beforeAll(async () => {
  // CONFIGURATION: Priority 1: Environment Variable | Priority 2: Local Fallback
  const TEST_URI = process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/mapcap_test";
  
  // Inject critical test-specific environment variables
  process.env.MONGO_URI = TEST_URI;
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key_123';
  process.env.NODE_ENV = 'test';

  // Initialize connection if Mongoose is idle
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(TEST_URI, {
        serverSelectionTimeoutMS: 5000, // Rapid failure if DB is unreachable
      });
      console.log(`\n🚀 Test Engine Connected: ${TEST_URI.includes('atlassian') || TEST_URI.includes('mongodb.net') ? 'Remote Cloud' : 'Local Instance'}`);
    } catch (err) {
      console.error("\n❌ CRITICAL: Test Database Connection Failed.");
      console.error(`Details: ${err.message}`);
      process.exit(1); // Force-stop tests to prevent false positives
    }
  }
});

/**
 * STATE HYGIENE:
 * Wipes all database collections after each test case.
 * Mandatory for Web3 financial logic to prevent data pollution and 
 * ensure each test starts with a clean ledger state.
 */
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }
});

/**
 * GRACEFUL SHUTDOWN:
 * Properly closes the Mongoose connection to prevent memory leaks 
 * and ensures the test process terminates cleanly.
 */
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    // Optional: Drop database for a complete purge on environments that allow it
    try {
      await mongoose.connection.dropDatabase();
    } catch (e) {
      // Ignore errors during drop in constrained environments
    }
    await mongoose.connection.close();
  }
});
