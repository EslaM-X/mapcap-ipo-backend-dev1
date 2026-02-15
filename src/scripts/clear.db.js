/**
 * DB Cleanup Tool - Development Utility v1.6.1
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Utility: Sandbox Reset Protocol
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Provides a streamlined mechanism to purge the Investor Ledger for 
 * fresh testing cycles. Engineered for high-speed local development.
 * * SECURITY WARNING: 
 * This script is destructive and should only be executed in 'development'
 * or 'staging' environments. Never run against the Production Mainnet.
 * -------------------------------------------------------------------------
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Investor from '../models/investor.model.js';

dotenv.config();

/**
 * @function clearDatabase
 * @desc Irreversibly deletes all records from the Investor collection.
 */
const clearDatabase = async () => {
    try {
        /**
         * INITIALIZATION:
         * Connecting to the MongoDB instance defined in the .env configuration.
         */
        await mongoose.connect(process.env.MONGO_URI);
        console.log("⚠️  [DB_TOOL_WARNING] Initiating deep purge of the Investor Ledger...");
        
        /**
         * EXECUTION:
         * Utilizing deleteMany({}) for atomic mass deletion.
         */
        const result = await Investor.deleteMany({});
        
        console.log(`✨ [CLEANUP_SUCCESS] Database purged. Records removed: ${result.deletedCount}`);
        
        // Ensure graceful process termination
        process.exit(0);
    } catch (error) {
        /**
         * ERROR INTERCEPTOR:
         * Logs failure during the connection or deletion sequence.
         */
        console.error("❌ [CRITICAL_CLEANUP_FAILURE]:", error.message);
        process.exit(1);
    }
};

// Execute the cleanup sequence
clearDatabase();
