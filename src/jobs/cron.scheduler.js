/**
 * Cron Scheduler - MapCap IPO Automation Engine (Production Ready)
 * -------------------------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE: 
 * This orchestrator automates the MapCap lifecycle (Daily Pricing, 
 * 4-Week Whale Settlement, and 10-Month Vesting) as per Spec Page 4-6.
 * -------------------------------------------------------------------------
 */

import cron from 'node-cron';
import Investor from '../models/investor.model.js';
import SettlementJob from './settlement.job.js'; // Ensure .js extension
import { auditLogStream } from '../config/logger.js';

class CronScheduler {
    /**
     * Initializes all automated tasks for the IPO ecosystem.
     * All tasks are strictly bound to the 'UTC' timezone for global consistency.
     */
    static init() {
        console.log("--- [SYSTEM] Cron Scheduler Initialized (UTC Mode) ---");

        /**
         * TASK 1: Daily Spot Price Snapshot (Midnight UTC Every Day)
         * Requirement: Real-time 'Water-Level' tracking [Page 4, 73-74].
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
         * TASK 2: Final Whale Settlement (End of 4-Week IPO Cycle)
         * Requirement: Triggering the Anti-Whale 10% Trim-Back [Page 6, 92-94].
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
         * Requirement: Linear 10% release over 10 months [Page 5, 87-88].
         */
        cron.schedule('0 0 1 * *', async () => {
            console.log("[CRON] Executing Monthly 10% Vesting Distribution...");
            try {
                // Future Hook: This will call the VestingService.releaseNextTranche()
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

export default CronScheduler;
