/**
 * Manual Trigger - Administrative Command Center v1.3
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Admin Protocol
 * * PURPOSE:
 * CLI tool for manual execution of high-stakes financial jobs.
 * Supports: Whale Refunds, System Pulse Checks, and Manual Syncs.
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import SettlementJob from './settlement.job.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { writeAuditLog } from '../config/logger.js';

// Load Environment Variables for standalone CLI context
dotenv.config();

/**
 * @function runManualAction
 * @desc Parses CLI arguments and executes the requested administrative task.
 */
const runManualAction = async () => {
    const actionArg = process.argv.find(arg => arg.startsWith('--action='));
    const action = actionArg ? actionArg.split('=')[1] : null;

    if (!action) {
        console.error("❌ Usage: node src/jobs/manual_trigger.js --action=[WHALE_REFUND | PULSE_CHECK]");
        process.exit(1);
    }

    console.log(`--- [ADMIN_COMMAND] Manual Trigger Initiated: ${action} ---`);

    try {
        // HANDSHAKE: Database Connection
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ [DATABASE] Connection established.");

        switch (action) {
            case 'WHALE_REFUND':
                console.log("🚀 [TASK] Triggering Forced Anti-Whale Settlement...");
                
                const allInvestors = await Investor.find({ totalPiContributed: { $gt: 0 } });
                const totalPiPool = allInvestors.reduce((sum, inv) => sum + inv.totalPiContributed, 0);
                
                if (totalPiPool === 0) {
                    console.log("⚠️ [ABORT] Pool is empty. No settlement needed.");
                    break;
                }

                // Execute the Settlement Job
                const result = await SettlementJob.executeWhaleTrimBack(allInvestors, totalPiPool);
                
                // Daniel's Requirement: Log manual interventions
                writeAuditLog('WARN', `MANUAL_OVERRIDE: Whale Refund executed via CLI. Refunded: ${result.totalRefunded} Pi.`);
                console.log(`✅ [SUCCESS] Refunded: ${result.totalRefunded} Pi to ${result.whalesImpacted} whales.`);
                break;

            case 'PULSE_CHECK':
                const count = await Investor.countDocuments();
                const aggregation = await Investor.aggregate([{ $group: { _id: null, total: { $sum: "$totalPiContributed" } } }]);
                
                console.log(`📊 [STATS] Total Pioneers: ${count}`);
                console.log(`📊 [STATS] Total Liquidity: ${aggregation[0]?.total || 0} Pi`);
                break;

            default:
                console.log(`❌ [ERROR] Unknown action: ${action}.`);
        }

    } catch (error) {
        writeAuditLog('CRITICAL', `MANUAL_CLI_FAILURE: ${error.message}`);
        console.error("--- [CRITICAL_FAILURE] ---", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 [DATABASE] Connection closed.");
        process.exit(0);
    }
};

runManualAction();
