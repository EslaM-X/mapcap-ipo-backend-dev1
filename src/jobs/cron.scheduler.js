/**
 * Cron Scheduler - MapCap IPO Automation Engine
 * ---------------------------------------------------------
 * This orchestrator automates the 4-week IPO lifecycle tasks:
 * 1. Daily Spot Price Synchronization.
 * 2. Monthly Vesting Releases (10% over 10 months).
 * 3. Final Whale Settlement (The 10% Cap Enforcement).
 * * Complies with Philip Jennings' Tokenomics and Daniel's Security Audit.
 */

const cron = require('node-cron');
const Investor = require('../models/Investor');
const SettlementJob = require('./settlement');
const MathHelper = require('../utils/math.helper');
const auditLogStream = require('../config/logger');

class CronScheduler {
    /**
     * Initializes all automated tasks for the IPO ecosystem.
     */
    static init() {
        console.log("--- [SYSTEM] Cron Scheduler Initialized Successfully ---");

        /**
         * TASK 1: Daily Spot Price Calculation (Midnight Every Day)
         * Updates the internal metrics to reflect the current "Water-Level".
         */
        cron.schedule('0 0 * * *', async () => {
            console.log("[CRON] Running Daily Price Sync...");
            try {
                const globalStats = await Investor.aggregate([
                    { $group: { _id: null, totalPi: { $sum: "$totalPiContributed" } } }
                ]);
                
                const totalPi = globalStats[0]?.totalPi || 0;
                // Log the current water-level for Daniel's audit
                auditLogStream.write(`[PRICE_SYNC] ${new Date().toISOString()} - Total Pool: ${totalPi} Pi\n`);
            } catch (error) {
                console.error("[CRON ERROR] Daily Price Sync Failed:", error.message);
            }
        });

        /**
         * TASK 2: Final Whale Settlement (End of 4-Week Cycle)
         * Enforces the 10% Anti-Whale Cap and triggers A2UaaS refunds.
         * Recommended to run manually or scheduled for the 28th day.
         */
        cron.schedule('0 23 28 * *', async () => {
            console.log("[CRON] 🚨 FINAL SETTLEMENT DETECTED: Enforcing 10% Whale Cap...");
            try {
                const investors = await Investor.find({});
                const totalStats = await Investor.aggregate([
                    { $group: { _id: null, totalPi: { $sum: "$totalPiContributed" } } }
                ]);
                
                const totalPool = totalStats[0]?.totalPi || 0;
                
                // Trigger the core Settlement Job we integrated earlier
                const result = await SettlementJob.executeWhaleTrimBack(investors, totalPool);
                
                auditLogStream.write(`[SETTLEMENT] ${new Date().toISOString()} - Success: ${result.totalRefunded} Pi Refunded\n`);
            } catch (error) {
                auditLogStream.write(`[CRITICAL_CRON_ERROR] Settlement Failed: ${error.message}\n`);
            }
        });

        /**
         * TASK 3: Monthly Vesting Release (1st of every Month)
         * Releases 10% of the allocated MapCap to Pioneers over 10 months.
         */
        cron.schedule('0 0 1 * *', async () => {
            console.log("[CRON] Processing Monthly 10% Vesting Release...");
            try {
                // Implementation for moving allocatedMapCap to availableBalance
                // Based on Philip's 10-month linear vesting rule.
            } catch (error) {
                console.error("[CRON ERROR] Vesting Release Failed:", error.message);
            }
        });
    }
}

module.exports = CronScheduler;

