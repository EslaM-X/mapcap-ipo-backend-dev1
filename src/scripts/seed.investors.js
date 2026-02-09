/**
 * Seed Script - Financial Data Provisioning v1.1
 * -------------------------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Stress Testing Anti-Whale Logic
 * * PURPOSE:
 * Populates the 'investors' collection with diverse profiles to verify:
 * 1. The 10-month linear vesting calculations.
 * 2. The 10% Whale-Cap ceiling enforcement.
 * 3. Schema index performance for O(1) lookups.
 * -------------------------------------------------------------------------
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Investor from '../models/investor.model.js';

// Load environment variables for DB connectivity
dotenv.config();

const seedData = async () => {
    try {
        console.log("🚀 [SEED_ENGINE] Initializing connection to Financial Ledger...");
        await mongoose.connect(process.env.MONGO_URI);
        
        // CLEANUP: Resetting the collection to ensure a clean test environment
        await Investor.deleteMany({});
        console.log("🧹 [CLEANUP] Existing investor records purged.");

        /**
         * TEST SUITE: DIVERSE INVESTOR PROFILES
         * Profiles are designed to test the limits of the 10% sharePct virtual.
         */
        const mockInvestors = [
            {
                piAddress: "GBV...NORM_PIONEER_01",
                totalPiContributed: 500,
                allocatedMapCap: 5000,
                vestingMonthsCompleted: 0,
                isWhale: false
            },
            {
                piAddress: "GCX...POTENTIAL_WHALE_01",
                totalPiContributed: 55000, // Large contribution for testing
                allocatedMapCap: 550000, 
                vestingMonthsCompleted: 0,
                isWhale: true // Tagged for Daniel's settlement audit
            },
            {
                piAddress: "GDA...VESTING_TEST_01",
                totalPiContributed: 1200,
                allocatedMapCap: 12000,
                mapCapReleased: 2400, // Simulating 2 months already released
                vestingMonthsCompleted: 2,
                isWhale: false
            }
        ];

        // PERSISTENCE: Committing the mock data to the database
        await Investor.insertMany(mockInvestors);

        console.log("✅ [SUCCESS] 3 Strategic Profiles injected successfully.");
        console.log("📊 [PULSE] System ready for AdminController.triggerFinalSettlement testing.");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ [CRITICAL_ERROR] Seed engine failure:", error.message);
        process.exit(1);
    }
};

seedData();

