/**
 * Manual Trigger - Administrative Command Center v1.7.5 (TS)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Admin Protocol
 * ---------------------------------------------------------
 * ARCHITECTURAL PURPOSE:
 * A standalone CLI utility for manual orchestration of high-stakes 
 * financial jobs. This tool fulfills Philip's requirement for 
 * post-IPO settlement before liquidity is transitioned to the LP.
 */

import Investor from '../models/investor.model.js';
import SettlementJob from './settlement.job.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { writeAuditLog } from '../config/logger.js';

// Environment context for standalone execution
dotenv.config();

/**
 * @enum AdminAction
 * Standardized manual commands for CLI orchestration.
 */
enum AdminAction {
    WHALE_REFUND = 'WHALE_REFUND',
    PULSE_CHECK = 'PULSE_CHECK'
}

/**
 * @function runManualAction
 * @desc Parses CLI arguments to execute targeted administrative tasks.
 * Usage: node dist/jobs/manual_trigger.js --action=WHALE_REFUND
 */
const runManualAction = async (): Promise<void> => {
    const actionArg: string | undefined = process.argv.find(arg => arg.startsWith('--action='));
    const action: string | null = actionArg ? actionArg.split('=')[1] : null;

    if (!action) {
        console.error("❌ Usage Error: Define an action flag. Example: --action=WHALE_REFUND");
        process.exit(1);
    }

    console.log(`--- [ADMIN_COMMAND] Manual Engine Activated: ${action} ---`);

    try {
        // SECURE HANDSHAKE: Database Connection
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing in .env");
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ [DATABASE] Ledger synchronization successful.");

        switch (action as AdminAction) {
            case AdminAction.WHALE_REFUND:
                /**
                 * POST-IPO SETTLEMENT EXECUTION:
                 * Manually triggers the 10% ceiling enforcement.
                 */
                console.log("🚀 [TASK] Initiating Post-IPO Final Whale Settlement...");
                
                const allInvestors = await Investor.find({ totalPiContributed: { $gt: 0 } });
                const totalPiPool: number = allInvestors.reduce((sum, inv) => sum + inv.totalPiContributed, 0);
                
                if (totalPiPool === 0) {
                    console.warn("⚠️ [ABORT] Liquidity Pool is currently empty. No action required.");
                    break;
                }

                // Invoking the Settlement Engine
                const result = await SettlementJob.executeWhaleTrimBack(allInvestors, totalPiPool);
                
                // Daniel's Compliance Requirement: Log all CLI interventions
                writeAuditLog('WARN', `MANUAL_CLI_OVERRIDE: Settlement executed. Total Refunded: ${result.totalRefundedPi} Pi.`);
                console.log(`✅ [SUCCESS] Settlement Complete. Capped ${result.refundCount} whale accounts.`);
                break;

            case AdminAction.PULSE_CHECK:
                // Real-time metrics for Philip's "Water-Level" verification
                const count: number = await Investor.countDocuments();
                const aggregation = await Investor.aggregate([{ $group: { _id: null, total: { $sum: "$totalPiContributed" } } }]);
                
                console.log(`📊 [AUDIT] Registered Pioneers: ${count}`);
                console.log(`📊 [AUDIT] Total Global Liquidity: ${aggregation[0]?.total || 0} Pi`);
                break;

            default:
                console.error(`❌ [ERROR] Unsupported action: ${action}.`);
        }

    } catch (error: any) {
        writeAuditLog('CRITICAL', `MANUAL_ENGINE_FAILURE: ${error.message}`);
        console.error("--- [FATAL_EXCEPTION] ---", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 [DATABASE] Session terminated safely.");
        process.exit(0);
    }
};

runManualAction();
