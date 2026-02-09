/**
 * Vesting Reset Utility - Emergency Override v1.0
 * -------------------------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * PURPOSE: Resets all vesting progress to 0 for a fresh cycle restart.
 * -------------------------------------------------------------------------
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Investor from '../models/investor.model.js';

dotenv.config();

const resetVesting = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🚨 [EMERGENCY] Initiating Global Vesting Reset...");

        const result = await Investor.updateMany({}, {
            $set: {
                mapCapReleased: 0,
                vestingMonthsCompleted: 0
            }
        });

        console.log(`✅ [RESET_SUCCESS] Impacted ${result.modifiedCount} Pioneer ledgers.`);
        console.log("ℹ️ [INFO] All vesting progress has been zeroed out.");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ [CRITICAL] Reset failed:", error.message);
        process.exit(1);
    }
};

resetVesting();

