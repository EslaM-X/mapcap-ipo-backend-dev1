/**
 * Vesting Reset Utility - Emergency Override v1.0.1
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Utility: Ledger Reconciliation
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Provides an administrative override to reset all vesting progress and 
 * released asset counts to zero. This is essential for restarting distribution 
 * cycles without compromising the core contribution data (Total Pi).
 * -------------------------------------------------------------------------
 * COMPLIANCE NOTE:
 * Use only during pre-launch rehearsals or authorized emergency recovery.
 * -------------------------------------------------------------------------
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Investor from '../models/investor.model.js';

dotenv.config();

/**
 * @function resetVesting
 * @desc Resets 'mapCapReleased' and 'vestingMonthsCompleted' for all investors.
 */
const resetVesting = async () => {
    try {
        /**
         * INITIALIZATION:
         * Connecting to the ledger database using the authenticated MONGO_URI.
         */
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🚨 [EMERGENCY_INIT] Initiating Global Vesting Reset Sequence...");

        /**
         * DATABASE ATOMIC UPDATE:
         * Utilizes $set to zero out distribution metrics while preserving 
         * 'totalPiContributed' and 'allocatedMapCap'.
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
    } catch (error) {
        /**
         * EXCEPTION HANDLING:
         * Logs critical failures to ensure Daniel's audit logs capture the disruption.
         */
        console.error("❌ [CRITICAL_RESET_FAILURE]:", error.message);
        process.exit(1);
    }
};

// Execute the reset sequence
resetVesting();
