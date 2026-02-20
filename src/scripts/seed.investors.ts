/**
 * Seed Script - Financial Data Provisioning v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Stress Testing Anti-Whale Logic
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented Partial<IInvestor> for type-safe mock data injection.
 * - Formalized test cases to validate 'Whale-Shield' and 'Vesting' logic.
 * - Preserved atomic delete-and-insert sequence for testing purity.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Investor, { IInvestor } from '../models/investor.model.js';

// Load environment variables for secure database connectivity
dotenv.config();

/**
 * @function seedData
 * @desc Orchestrates the injection of strategic mock data for ecosystem testing.
 */
const seedData = async (): Promise<void> => {
    try {
        console.log("🚀 [SEED_ENGINE] Initializing connection to Financial Ledger...");
        
        const MONGO_URI: string | undefined = process.env.MONGO_URI;
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables.");
        }

        await mongoose.connect(MONGO_URI);
        
        // CLEANUP: Resetting the collection to ensure a pure testing environment
        await Investor.deleteMany({});
        console.log("🧹 [CLEANUP] Existing investor records purged successfully.");

        /**
         * TEST SUITE: DIVERSE INVESTOR PROFILES
         * Meticulously designed to challenge the 'sharePct' virtual logic.
         */
        const mockInvestors: Partial<IInvestor>[] = [
            {
                // CASE 1: Standard Pioneer - Validating baseline contribution logic
                piAddress: "GBV_PIONEER_ALPHA_01",
                totalPiContributed: 500,
                allocatedMapCap: 5000,
                vestingMonthsCompleted: 0,
                isWhale: false
            },
            {
                // CASE 2: High-Volume Participant - Testing 'Whale-Shield' advisory flagging
                // Note: ~550k MapCap triggers the 10% threshold calculation.
                piAddress: "GCX_POTENTIAL_WHALE_BETA_02",
                totalPiContributed: 55000, 
                allocatedMapCap: 550000, 
                vestingMonthsCompleted: 0,
                isWhale: true 
            },
            {
                // CASE 3: Active Vesting Profile - Verifying Math.max protection and release math
                piAddress: "GDA_VESTING_GAMMA_03",
                totalPiContributed: 1200,
                allocatedMapCap: 12000,
                mapCapReleased: 2400, // Simulates Month 2 status
                vestingMonthsCompleted: 2,
                isWhale: false
            }
        ];

        // PERSISTENCE: Committing the strategic profiles to the database
        await Investor.insertMany(mockInvestors);

        console.log("\n✅ [SUCCESS] 3 Strategic Profiles injected into the ecosystem.");
        console.log("📊 [STATUS] System ready for 'AdminController.triggerFinalSettlement' validation.");
        
        // Graceful exit for CI/CD or Manual CLI execution
        process.exit(0);
    } catch (error: any) {
        /**
         * EXCEPTION INTERCEPTOR:
         * Logs failure during the seeding process for developer audit.
         */
        console.error("❌ [CRITICAL_SEED_FAILURE]:", error.message);
        process.exit(1);
    }
};

// Initiate the seeding sequence
seedData();
