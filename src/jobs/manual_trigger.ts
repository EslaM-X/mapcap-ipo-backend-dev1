/**
 * Manual Trigger - Administrative Command Center v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Admin Protocol
 * -------------------------------------------------------------------------
 * ARCHITECTURAL PURPOSE:
 * A standalone CLI utility for manual orchestration of high-stakes 
 * financial jobs. This tool fulfills Philip's requirement for 
 * post-IPO settlement before liquidity is transitioned to the LP.
 * -------------------------------------------------------------------------
 * TS STABILIZATION LOG:
 * - Resolved TS2835: Added mandatory .js extensions for NodeNext compatibility.
 * - Resolved TS2554: Aligned with stabilized SettlementJob signature.
 * - Integrity Guard: Maintains exact CLI flag naming to ensure operational 
 * continuity for DevOps and manual overrides.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

/**
 * INTERNAL MODULE IMPORTS
 * Mandatory .js extensions for ESM resolution in Node.js environment.
 */
import Investor from '../models/investor.model.js';
import SettlementJob from './settlement.job.js';
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
 * @description Parses CLI arguments to execute targeted administrative tasks.
 * Usage: node dist/jobs/manual_trigger.js --action=WHALE_REFUND
 */
const runManualAction = async (): Promise<void> => {
    const actionArg: string | undefined = process.argv.find(arg => arg.startsWith('--action='));
    const actionValue: string | null = actionArg ? actionArg.split('=')[1] : null;

    if (!actionValue) {
        console.error("❌ Usage Error: Define an action flag. Example: --action=WHALE_REFUND");
        process.exit(1);
    }

    console.log(`--- [ADMIN_COMMAND] Manual Engine Activated: ${actionValue} ---`);

    try {
        // SECURE HANDSHAKE: Database Connection initialization
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing in .env");
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ [DATABASE] Ledger synchronization successful.");

        // Type-safe action mapping
        const currentAction = actionValue as AdminAction;

        switch (currentAction) {
            case AdminAction.WHALE_REFUND:
                /**
                 * POST-IPO SETTLEMENT EXECUTION:
                 * Manually triggers the 10% ceiling enforcement for whale accounts.
                 */
                console.log("🚀 [TASK] Initiating Post-IPO Final Whale Settlement...");
                
                const aggregation = await Investor.aggregate([
                    { $group: { _id: null, total: { $sum: "$totalPiContributed" } } }
                ]);
                
                const totalPiPool: number = aggregation.length > 0 ? aggregation[0].total : 0;
                
                if (totalPiPool === 0) {
                    console.warn("⚠️ [ABORT] Liquidity Pool is currently empty. No action required.");
                    break;
                }

                /**
                 * EXECUTE SETTLEMENT ENGINE:
                 * Using the stabilized single-parameter signature from SettlementJob.
                 */
                const result = await SettlementJob.executeWhaleTrimBack(totalPiPool);
                
                /**
                 * DANIEL'S COMPLIANCE REQUIREMENT:
                 * Log all manual CLI interventions with updated property mapping.
                 * Property 'totalRefunded' is used as per ISettlementResult interface.
                 */
                writeAuditLog('WARN', `MANUAL_CLI_OVERRIDE: Settlement executed. Total Refunded: ${result.totalRefunded} Pi.`);
                console.log(`✅ [SUCCESS] Settlement Complete. Capped ${result.whalesImpacted} whale accounts.`);
                break;

            case AdminAction.PULSE_CHECK:
                /**
                 * REAL-TIME AUDIT:
                 * Generates instant metrics for Philip's "Water-Level" verification.
                 */
                const count: number = await Investor.countDocuments();
                const auditAgg = await Investor.aggregate([{ $group: { _id: null, total: { $sum: "$totalPiContributed" } } }]);
                
                console.log(`📊 [AUDIT] Registered Pioneers: ${count}`);
                console.log(`📊 [AUDIT] Total Global Liquidity: ${auditAgg[0]?.total || 0} Pi`);
                break;

            default:
                console.error(`❌ [ERROR] Unsupported action: ${actionValue}.`);
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
