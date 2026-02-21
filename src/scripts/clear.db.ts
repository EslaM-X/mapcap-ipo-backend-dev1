/**
 * DB Cleanup Tool - Development Utility v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Utility: Sandbox Reset Protocol
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented Promise-based void return type for the execution wrapper.
 * - Added a critical safety check for MONGO_URI presence.
 * - Maintained destructive operation warnings for operational safety.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Investor from '../models/investor.model.js';

dotenv.config();

/**
 * @function clearDatabase
 * @desc Irreversibly deletes all records from the Investor collection.
 */
const clearDatabase = async (): Promise<void> => {
    try {
        /**
         * SAFETY GUARD:
         * Verify environment configuration before establishing a connection.
         */
        const MONGO_URI: string | undefined = process.env.MONGO_URI;

        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables.");
        }

        /**
         * INITIALIZATION:
         * Connecting to the MongoDB instance defined in the .env configuration.
         */
        await mongoose.connect(MONGO_URI);
        console.log("⚠️  [DB_TOOL_WARNING] Initiating deep purge of the Investor Ledger...");
        
        /**
         * EXECUTION:
         * Utilizing deleteMany({}) for atomic mass deletion of the collection.
         */
        const result = await Investor.deleteMany({});
        
        console.log(`✨ [CLEANUP_SUCCESS] Database purged. Records removed: ${result.deletedCount}`);
        
        // Ensure graceful process termination
        process.exit(0);
    } catch (error: any) {
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
