/**
 * GLOBAL TEST SETUP & DATABASE TEARDOWN (In-Memory Implementation)
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite orchestrates the lifecycle of a virtualized MongoDB instance. 
 * It ensures that Integration Tests run in an isolated, idempotent environment 
 * without side effects on production or local disk-based databases.
 * -------------------------------------------------------------------------
 */

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod;

/**
 * PRE-FLIGHT INITIALIZATION:
 * Spins up an ephemeral MongoDB server and injects test-specific 
 * environment variables before the test suite execution begins.
 */
beforeAll(async () => {
  // Initialize the MongoDB Memory Server instance
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  // Inject the dynamic URI and security secrets into the runtime environment
  process.env.MONGO_URI = uri;
  process.env.JWT_SECRET = 'test_secret_key_123';
  process.env.NODE_ENV = 'test';

  // Establish connection if the ODM (Mongoose) is not already active
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
});

/**
 * STATE HYGIENE:
 * Wipes all collections after each test execution.
 * Crucial for financial logic to prevent cross-test data pollution (e.g., duplicate txIds).
 */
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
  }
});

/**
 * GRACEFUL SHUTDOWN:
 * Terminates the Mongoose connection and stops the Memory Server
 * to prevent memory leaks and release system resources.
 */
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    // Purge the virtual database before closing the channel
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  
  if (mongod) {
    await mongod.stop();
  }
});
