/**
 * UNIVERSAL TEST SETUP & DATABASE LIFECYCLE (Cross-Platform) v1.1.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Compliance & Quality Assurance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Orchestrates database connectivity for the Jest/Vitest execution context.
 * Optimized for Termux (Android) via Cloud URI and Desktop via Local Instance.
 * Ensures idempotent test environments to maintain financial logic integrity.
 * -------------------------------------------------------------------------
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables for test configuration
dotenv.config();

/**
 * PRE-FLIGHT INITIALIZATION:
 * Establishes a robust connection to the test database. 
 * Priority Routing: 
 * 1. MONGO_URI_TEST (Remote Atlas/Cloud - Essential for Termux compatibility)
 * 2. Local Fallback (127.0.0.1 - Standard development environment)
 */
beforeAll(async () => {
  // CONFIGURATION: Priority 1: Environment Variable | Priority 2: Local Fallback
  const TEST_URI = process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/mapcap_test";
  
  // Inject critical test-specific environment variables for global access
  process.env.MONGO_URI = TEST_URI;
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key_123';
  process.env.NODE_ENV = 'test';
  // Standardized fallback to match our new adminAuth middleware logic
  process.env.ADMIN_SECRET_TOKEN = process.env.ADMIN_SECRET_TOKEN || 'secure_fallback_2026';

  // Initialize connection only if Mongoose is currently idle (idempotency)
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(TEST_URI, {
        serverSelectionTimeoutMS: 8000, // Balanced timeout for Termux network latency
        family: 4 // Force IPv4 to prevent resolution hangs in Android environments
      });
      
      const isRemote = TEST_URI.includes('atlassian') || TEST_URI.includes('mongodb.net');
      console.log(`\n🚀 Test Engine Connected: ${isRemote ? 'Remote Cloud (Termux-Ready)' : 'Local Instance'}`);
    } catch (err) {
      console.error("\n❌ CRITICAL: Test Database Connection Failed.");
      console.error(`Details: ${err.message}`);
      console.error("💡 TIP: In Termux, ensure MONGO_URI_TEST is set to a Cloud Atlas instance.");
      process.exit(1); // Force-terminate execution to prevent false-positive test results
    }
  }
});

/**
 * STATE HYGIENE (Post-Test Cleanup):
 * Wipes all database collections after each test case to prevent data leakage.
 * Mandatory for Web3 financial simulations to ensure a clean ledger state.
 */
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      try {
        await collections[key].deleteMany();
      } catch (e) {
        // Silent catch for collection-level lock issues during rapid tests
      }
    }
  }
});

/**
 * GRACEFUL SHUTDOWN (Resource Deallocation):
 * Ensures all database handlers are closed to prevent memory leaks in the Node.js process.
 */
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      // Optional: Clean purge of the test database on environments supporting drop
      await mongoose.connection.dropDatabase();
    } catch (e) {
      // Drop ignored for limited-privilege cloud environments (Atlas Free Tier)
    }
    await mongoose.connection.close();
    console.log("🛑 Test Engine Shutdown: Database connection terminated cleanly.");
  }
});
