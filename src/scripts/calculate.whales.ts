/**
 * Whale Audit Tool - Compliance & Decentralization Verification v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Audit & Philip's Whale-Shield
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented strict IInvestor interface for database record safety.
 * - Maintained all original console logging for Daniel's audit trails.
 * - Preserved the 2,181,818 Global Supply constant per Philip's Spec.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Investor, { IInvestor } from '../models/investor.model.js';

dotenv.config();

/**
 * @function auditWhales
 * @desc Executes a global scan of the investor ledger to synchronize the 'isWhale' status.
 */
const auditWhales = async (): Promise<void> => {
    // Constants aligned with Philip's Scarcity Specification
    const GLOBAL_SUPPLY: number = 2181818; 
    const CEILING_LIMIT: number = 0.10;    // 10% Anti-Whale Threshold

    try {
        /**
         * INITIALIZATION:
         * Connecting to the production/staging database as per Daniel's compliance guidelines.
         */
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in environment variables.");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("🔍 [AUDIT_INIT] Establishing connection to Global Ledger...");
        console.log("🚀 [AUDIT_START] Scanning for Whale activity exceeding 10% cap...");

        // Fetching all investors to evaluate current pool distribution
        const investors: IInvestor[] = await Investor.find();
        let whaleCount: number = 0;

        /**
         * EVALUATION LOOP:
         * Iterates through each record to calculate real-time share percentage.
         */
        for (let inv of investors) {
            // sharePct calculation based on current allocation vs global supply
            const sharePct: number = inv.allocatedMapCap / GLOBAL_SUPPLY;
            
            if (sharePct > CEILING_LIMIT) {
                whaleCount++;
                console.warn(`⚠️ [WHALE_FLAGGED] Pioneer: ${inv.piAddress} | Share: ${(sharePct * 100).toFixed(2)}%`);
                
                // Flagging for Daniel's final financial reconciliation
                inv.isWhale = true;
                await inv.save();
            } else {
                // Clearing flag if Pioneer has successfully re-aligned their stake
                inv.isWhale = false;
                await inv.save();
            }
        }

        console.log(`\n✅ [AUDIT_SUCCESS] Scan concluded successfully.`);
        console.log(`📊 [SUMMARY] Total Whales Flagged: ${whaleCount} / Total Pioneers: ${investors.length}`);
        
        // Graceful exit for automated job runners (Cron/GitHub Actions)
        process.exit(0);
    } catch (error: any) {
        /**
         * ERROR INTERCEPTOR:
         * Critical failures are logged for infrastructure monitoring.
         */
        console.error("❌ [CRITICAL_AUDIT_FAILURE]:", error.message);
        process.exit(1);
    }
};

// Execute the audit sequence
auditWhales();
