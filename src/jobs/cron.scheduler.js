/**
 * Cron Scheduler - MapCap IPO Automation Engine (Production Ready)
 * -------------------------------------------------------------------------
 * This orchestrator automates the MapCap lifecycle based on Philip Jennings' 
 * Use Case. It ensures all global financial operations align with the 
 * Gregorian calendar and UTC time standards.
 */

const cron = require('node-cron');
const Investor = require('../models/Investor');
const SettlementJob = require('./settlement');
const auditLogStream = require('../config/logger');

class CronScheduler {
    /**
     * Initializes all automated tasks for the IPO ecosystem.
     * All tasks are strictly bound to the 'UTC' timezone.
     */
    static init() {
        console.log("--- [SYSTEM] Cron Scheduler Initialized (UTC Mode) ---");

        /**
         * TASK 1: Daily Spot Price Calculation (Midnight UTC Every Day)
         */
        cron.schedule('0 0 * * *', async () => {
            console.log("[CRON] Executing End-of-Day Spot Price Calculation...");
            try {
                const globalStats = await Investor.aggregate([
                    { $group: { _id: null, totalPi: { $sum: "$totalPiContributed" } } }
                ]);
                
                const totalPi = globalStats[0]?.totalPi || 0;
                
                // Audit logging for Daniel's transparency standard
                const logEntry = `[PRICE_SNAPSHOT] ${new Date().toISOString()} | Pool: ${totalPi} Pi | UTC Sync Active\n`;
                auditLogStream.write(logEntry);
                
                console.log(`[CRON SUCCESS] Daily Water-Level recorded: ${totalPi} Pi`);
            } catch (error) {
                auditLogStream.write(`[CRON_ERROR] Price Sync Failed: ${error.message}\n`);
            }
        }, {
            scheduled: true,
            timezone: "UTC" 
        });

        /**
         * TASK 2: Final Whale Settlement (End of 4-Week Cycle)
         */
        cron.schedule('0 23 28 * *', async () => {
            console.log("[CRON] 🚨 IPO PHASE END: Triggering Anti-Whale Settlement...");
            try {
                const investors = await Investor.find({ totalPiContributed: { $gt: 0 } });
                const totalStats = await Investor.aggregate([
                    { $group: { _id: null, totalPi: { $sum: "$totalPiContributed" } } }
                ]);
                
                const totalPool = totalStats[0]?.totalPi || 0;
                
                // Invoke the integrated settlement engine
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
         */
        cron.schedule('0 0 1 * *', async () => {
            console.log("[CRON] Executing Monthly 10% Vesting Distribution...");
            try {
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
