/**
 * Manual Trigger - Administrative Command Center v1.2
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Admin Protocol
 * * PURPOSE:
 * Provides a CLI interface for manual batch execution of 
 * critical financial jobs (e.g., Whale Refunds, Manual Syncs).
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import SettlementJob from './settlement.job.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load Environment Variables (Necessary for standalone CLI execution)
dotenv.config();

/**
 * @function runManualAction
 * @desc Parses CLI arguments and triggers the corresponding administrative job.
 */
const runManualAction = async () => {
    // Parsing the action from the command line argument --action=XXXX
    const actionArg = process.argv.find(arg => arg.startsWith('--action='));
    const action = actionArg ? actionArg.split('=')[1] : null;

    if (!action) {
        console.error("❌ Error: No action specified. Usage: node src/jobs/manual_trigger.js --action=WHALE_REFUND");
        process.exit(1);
    }

    console.log(`--- [ADMIN_COMMAND] Initializing Manual Action: ${action} ---`);

    try {
        // HANDSHAKE: Database Connection
        // Since this runs as a standalone script, we must establish a fresh connection.
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ [DATABASE] Connection established for manual task.");

        if (action === 'WHALE_REFUND') {
            console.log("🚀 [TASK] Starting Automated Whale Trim-Back...");
            
            const allInvestors = await Investor.find({});
            const totalPiPool = allInvestors.reduce((sum, inv) => sum + inv.totalPiContributed, 0);
            
            // Execute the Compliance Engine logic
            await SettlementJob.executeWhaleTrimBack(allInvestors, totalPiPool);
            
            console.log("✅ [SUCCESS] Manual Whale Refund protocol completed.");
        } 
        else if (action === 'PULSE_CHECK') {
            // Future Utility: Can be expanded to check ledger health
            const count = await Investor.countDocuments();
            console.log(`📊 [STATS] Total Registered Pioneers: ${count}`);
        }
        else {
            console.log(`❌ [ERROR] Unknown action: ${action}. Available: WHALE_REFUND, PULSE_CHECK`);
        }

    } catch (error) {
        console.error("--- [CRITICAL_FAILURE] ---", error.message);
    } finally {
        // Always close the connection to avoid hanging the terminal
        await mongoose.connection.close();
        console.log("🔌 [DATABASE] Connection closed. Task finished.");
        process.exit(0);
    }
};

// Start the administrative process
runManualAction();
