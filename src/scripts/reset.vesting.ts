/**
 * Vesting Reset Utility - Emergency Override v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Utility: Ledger Reconciliation
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Formalized the update payload with strict TypeScript typing.
 * - Added safety validation for MongoDB connection string.
 * - Preserved administrative audit messages for Daniel's compliance monitoring.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Investor from '../models/investor.model.js';

dotenv.config();

/**
 * @function resetVesting
 * @desc Resets 'mapCapReleased' and 'vestingMonthsCompleted' for all investors.
 * Essential for restarting distribution cycles without data loss.
 */
const resetVesting = async (): Promise<void> => {
    try {
        /**
         * SAFETY CHECK:
         * Ensure environment variables are loaded before proceeding.
         */
        const MONGO_URI: string | undefined = process.env.MONGO_URI;

        if (!MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not defined.");
        }

        /**
         * INITIALIZATION:
         * Connecting to the ledger database.
         */
        await mongoose.connect(MONGO_URI);
        console.log("🚨 [EMERGENCY_INIT] Initiating Global Vesting Reset Sequence...");

        /**
         * DATABASE ATOMIC UPDATE:
         * Utilizes $set to zero out distribution metrics.
         * Note: This preserves 'totalPiContributed' and 'allocatedMapCap' (Philip's Spec).
         */
        const result = await Investor.updateMany({}, {
            $set: {
                mapCapReleased: 0,
                vestingMonthsCompleted: 0
            }
        });

        console.log(`✅ [RESET_SUCCESS] Successfully synchronized ${result.modifiedCount} Pioneer ledgers.`);
        console.log("ℹ️ [SYSTEM_STATUS] Distribution progress has been re-indexed to Month 0.");
        
        // Graceful termination of the administrative process
        process.exit(0);
    } catch (error: any) {
        /**
         * EXCEPTION HANDLING:
         * Captures failure during the reset sequence for audit reporting.
         */
        console.error("❌ [CRITICAL_RESET_FAILURE]:", error.message);
        process.exit(1);
    }
};

// Execute the reset sequence
resetVesting();
