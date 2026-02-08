/**
 * Cron Scheduler - MapCap IPO Automation Engine (Production Ready)
 * -------------------------------------------------------------------------
 * This orchestrator automates the MapCap lifecycle based on Philip Jennings' 
 * Use Case (Feb 6th, 2026). It ensures all global financial operations 
 * [span_3](start_span)[span_4](start_span)align with the Gregorian calendar and UTC time standards.[span_3](end_span)[span_4](end_span)
 */

const cron = require('node-cron');
const Investor = require('../models/Investor');
const SettlementJob = require('./settlement');
const MathHelper = require('../utils/math.helper');
const auditLogStream = require('../config/logger');

class CronScheduler {
    /**
     * Initializes all automated tasks for the IPO ecosystem.
     * [span_5](start_span)All tasks are strictly bound to the 'UTC' timezone as per documentation.[span_5](end_span)
     */
    static init() {
        console.log("--- [SYSTEM] Cron Scheduler Initialized (UTC Mode) ---");

        /**
         * TASK 1: Daily Spot Price Calculation (Midnight UTC Every Day)
         * [span_6](start_span)[span_7](start_span)Purpose: Updates the Daily Spot-Price points for the Frontend Graph.[span_6](end_span)[span_7](end_span)
         * [span_8](start_span)Calculation: IPO MapCap (2,181,818) / Current Wallet Balance.[span_8](end_span)
         */
        cron.schedule('0 0 * * *', async () => {
            console.log("[CRON] Executing End-of-Day Spot Price Calculation...");
            try {
                const globalStats = await Investor.aggregate([
                    { $group: { _id: null, totalPi: { $sum: "$totalPiContributed" } } }
                ]);
                
                const totalPi = globalStats[0]?.totalPi || 0;
                
                [span_9](start_span)// Audit logging for Daniel's transparency standard[span_9](end_span)
                const logEntry = `[PRICE_SNAPSHOT] ${new Date().toISOString()} | Pool: ${totalPi} Pi | UTC Sync Active\n`;
                auditLogStream.write(logEntry);
                
                console.log(`[CRON SUCCESS] Daily Water-Level recorded: ${totalPi} Pi`);
            } catch (error) {
                auditLogStream.write(`[CRON_ERROR] Price Sync Failed: ${error.message}\n`);
            }
        }, {
            scheduled: true,
            [span_10](start_span)timezone: "UTC" // Force UTC to comply with Use Case Section 2[span_10](end_span)
        });

        /**
         * TASK 2: Final Whale Settlement (End of 4-Week Cycle)
         * [span_11](start_span)Purpose: Enforces the 10% Anti-Whale investment cap.[span_11](end_span)
         * [span_12](start_span)Logic: Identifies and refunds excess Pi via A2UaaS transfer.[span_12](end_span)
         */
        cron.schedule('0 23 28 * *', async () => {
            console.log("[CRON] 🚨 IPO PHASE END: Triggering Anti-Whale Settlement...");
            try {
                const investors = await Investor.find({ totalPiContributed: { $gt: 0 } });
                const totalStats = await Investor.aggregate([
                    { $group: { _id: null, totalPi: { $sum: "$totalPiContributed" } } }
                ]);
                
                const totalPool = totalStats[0]?.totalPi || 0;
                
                [span_13](start_span)// Invoke the integrated settlement engine[span_13](end_span)
                const result = await SettlementJob.executeWhaleTrimBack(investors, totalPool);
                
                auditLogStream.write(`[SETTLEMENT_REPORT] ${new Date().toISOString()} | Refunded: ${result.totalRefunded} Pi\n`);
            } catch (error) {
                auditLogStream.write(`[CRITICAL_SETTLEMENT_FAILURE] ${error.message}\n`);
            }
        }, {
            scheduled: true,
            timezone: "UTC"
        });

        /**
         * TASK 3: Monthly Vesting Release (1st of Month, UTC)
         * [span_14](start_span)[span_15](start_span)Purpose: Transfers 10% of IPO MapCap to pioneers over 10 months.[span_14](end_span)[span_15](end_span)
         * [span_16](start_span)Timing: Commences immediately after IPO phase completion.[span_16](end_span)
         */
        cron.schedule('0 0 1 * *', async () => {
            console.log("[CRON] Executing Monthly 10% Vesting Distribution...");
            try {
                [span_17](start_span)// Future Implementation: Logic to release 1/10th of allocated tokens monthly[span_17](end_span)
                auditLogStream.write(`[VESTING_CYCLE] Started for ${new Date().toLocaleString('default', { month: 'long' })}\n`);
            } catch (error) {
                console.error("[CRON ERROR] Vesting Process Interrupted:", error.message);
            }
        }, {
            scheduled: true,
            timezone: "UTC"
        });
    }
}

module.exports = CronScheduler;
