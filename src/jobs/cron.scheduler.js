/**
 * Cron Scheduler - MapCap IPO Automation Engine v1.5
 * -------------------------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE: 
 * Centralized orchestrator for Daily Snapshots, Whale Settlements, 
 * and Monthly Vesting release cycles.
 * -------------------------------------------------------------------------
 */

import cron from 'node-cron';
import Investor from '../models/investor.model.js';
import SettlementJob from './settlement.job.js';
import VestingJob from './vesting.job.js'; // Integrated the Vesting logic
import DailyPriceJob from './daily-price-update.js'; // Integrated the Pricing logic
import { writeAuditLog } from '../config/logger.js';

class CronScheduler {
    /**
     * Initializes all automated tasks.
     * Use of locked UTC timezone ensures global ledger consistency.
     */
    static init() {
        console.log("--- [SYSTEM] Cron Scheduler Initialized (UTC Mode) ---");
        writeAuditLog('INFO', 'Cron Scheduler Engine Online.');

        /**
         * TASK 1: Daily Spot Price & Snapshot
         * Freq: Midnight UTC (0 0 * * *)
         * Purpose: Updates the scarcity-based pricing model daily.
         */
        cron.schedule('0 0 * * *', async () => {
            writeAuditLog('INFO', '[CRON_START] Daily Price Recalibration Sequence.');
            try {
                // Triggering the standalone DailyPriceJob
                await DailyPriceJob.updatePrice();
            } catch (error) {
                writeAuditLog('CRITICAL', `Price Snapshot Failed: ${error.message}`);
            }
        }, { scheduled: true, timezone: "UTC" });

        /**
         * TASK 2: Final Whale Settlement (IPO PHASE END)
         * Freq: 23:00 UTC on the 28th day of the cycle.
         * Purpose: Automated 10% trim-back via A2UaaS protocol.
         */
        cron.schedule('0 23 28 * *', async () => {
            writeAuditLog('WARN', '[CRON_ALERT] IPO Closure Threshold Reached. Starting Settlement.');
            try {
                const investors = await Investor.find({ totalPiContributed: { $gt: 0 } });
                const totalStats = await Investor.aggregate([
                    { $group: { _id: null, totalPi: { $sum: "$totalPiContributed" } } }
                ]);
                
                const totalPool = totalStats[0]?.totalPi || 0;
                
                if (totalPool > 0) {
                    const result = await SettlementJob.executeWhaleTrimBack(investors, totalPool);
                    writeAuditLog('INFO', `[SETTLEMENT_SUCCESS] ${result.totalRefunded} Pi returned to pool.`);
                }
            } catch (error) {
                writeAuditLog('CRITICAL', `Whale Settlement Failure: ${error.message}`);
            }
        }, { scheduled: true, timezone: "UTC" });

        /**
         * TASK 3: Monthly 10% Vesting Release
         * Freq: Midnight UTC on the 1st of every month.
         * Purpose: 10-month linear release as per Spec Page 5.
         */
        cron.schedule('0 0 1 * *', async () => {
            writeAuditLog('INFO', '[CRON_START] Monthly Vesting Disbursement Cycle.');
            try {
                // Calling the VestingJob to handle A2UaaS payouts
                await VestingJob.executeMonthlyVesting();
            } catch (error) {
                writeAuditLog('CRITICAL', `Vesting Cycle Failed: ${error.message}`);
            }
        }, { scheduled: true, timezone: "UTC" });
    }
}

export default CronScheduler;
