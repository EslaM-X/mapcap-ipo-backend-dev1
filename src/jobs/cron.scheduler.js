/**
 * Cron Scheduler - MapCap IPO Automation Engine v1.4
 * -------------------------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE: 
 * Orchestrates automated tasks (Daily Snapshots, Whale Settlement, 
 * and Monthly Vesting) in strict adherence to UTC global standards.
 * -------------------------------------------------------------------------
 */

import cron from 'node-cron';
import Investor from '../models/investor.model.js';
import SettlementJob from './settlement.job.js';
import { writeAuditLog } from '../config/logger.js';

class CronScheduler {
    /**
     * Initializes all automated tasks for the IPO ecosystem.
     * Centralized UTC execution prevents timezone drift during the 2026 launch.
     */
    static init() {
        console.log("--- [SYSTEM] Cron Scheduler Initialized (UTC Mode) ---");
        writeAuditLog('INFO', 'Cron Scheduler Engine Online.');

        /**
         * TASK 1: Daily Spot Price Snapshot
         * Frequency: Midnight UTC Every Day.
         * Requirement: Records the 'Water-Level' for the 28-day price chart.
         */
        cron.schedule('0 0 * * *', async () => {
            console.log("[CRON] Daily Snapshot: Calculating Water-Level...");
            try {
                const globalStats = await Investor.aggregate([
                    { $group: { _id: null, totalPi: { $sum: "$totalPiContributed" } } }
                ]);
                
                const totalPi = globalStats[0]?.totalPi || 0;
                
                // Update Global Pulse (Future: Save to a separate DailyStats model)
                writeAuditLog('INFO', `[DAILY_SNAPSHOT] Pool: ${totalPi} Pi | All systems nominal.`);
                
            } catch (error) {
                writeAuditLog('CRITICAL', `Price Snapshot Failed: ${error.message}`);
            }
        }, { scheduled: true, timezone: "UTC" });

        /**
         * TASK 2: Final Whale Settlement (IPO PHASE END)
         * Frequency: 23:00 UTC on the 28th day.
         * Requirement: Executes the Anti-Whale 10% Trim-Back [Page 6].
         */
        cron.schedule('0 23 28 * *', async () => {
            console.log("[CRON] 🚨 IPO CLOSURE: Enforcing Whale Cap Protocol...");
            try {
                const investors = await Investor.find({ totalPiContributed: { $gt: 0 } });
                const totalStats = await Investor.aggregate([
                    { $group: { _id: null, totalPi: { $sum: "$totalPiContributed" } } }
                ]);
                
                const totalPool = totalStats[0]?.totalPi || 0;
                
                if (totalPool > 0) {
                    const result = await SettlementJob.executeWhaleTrimBack(investors, totalPool);
                    writeAuditLog('INFO', `[SETTLEMENT_SUCCESS] Total Refunded: ${result.totalRefunded} Pi.`);
                }
            } catch (error) {
                writeAuditLog('CRITICAL', `Whale Settlement Failure: ${error.message}`);
            }
        }, { scheduled: true, timezone: "UTC" });

        /**
         * TASK 3: Monthly Vesting Release
         * Frequency: Midnight UTC on the 1st of every month.
         * Requirement: Linear 10% release over 10 months [Page 5].
         */
        cron.schedule('0 0 1 * *', async () => {
            console.log("[CRON] Triggering Monthly Vesting Release...");
            try {
                /**
                 * FUTURE HOOK: 
                 * Integration point for the A2UaaS Monthly Payout Engine.
                 * Triggers the release of the next 10% tranche to all Pioneers.
                 */
                writeAuditLog('INFO', `[VESTING_INIT] Monthly distribution cycle started.`);
            } catch (error) {
                writeAuditLog('CRITICAL', `Vesting Cycle Failed: ${error.message}`);
            }
        }, { scheduled: true, timezone: "UTC" });
    }
}

export default CronScheduler;
