/**
 * Manual Trigger - Administrative Command Center
 * ---------------------------------------------------------
 * Allows Daniel/Philip to manually execute critical batch jobs.
 * Usage: node src/jobs/manual_trigger.js --action=WHALE_REFUND
 */

const SettlementJob = require('./settlement');
const Investor = require('../models/Investor');

const runManualAction = async () => {
    const action = process.argv[2]?.split('=')[1];

    console.log(`--- [ADMIN] Executing Manual Action: ${action} ---`);

    try {
        if (action === 'WHALE_REFUND') {
            const allInvestors = await Investor.find({});
            const totalPiPool = allInvestors.reduce((sum, inv) => sum + inv.totalPiContributed, 0);
            
            await SettlementJob.executeWhaleTrimBack(allInvestors, totalPiPool);
            console.log("✅ Manual Whale Refund Completed.");
        } else {
            console.log("❌ Unknown action. Use --action=WHALE_REFUND");
        }
    } catch (error) {
        console.error("--- [CRITICAL ERROR] ---", error.message);
    }
};

// Start the process
runManualAction();

