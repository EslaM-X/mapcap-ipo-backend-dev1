/**
 * Cron Scheduler - MapCap IPO Automation Engine v1.5.5
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE: 
 * Centralized orchestrator for automated Financial Snapshots, Whale 
 * Settlements, and Monthly Vesting release cycles.
 * -------------------------------------------------------------------------
 */

import cron from 'node-cron';
import Investor from '../models/investor.model.js';
import SettlementJob from './settlement.job.js';
import VestingJob from './vesting.job.js'; 
import DailyPriceJob from './daily-price-update.js'; 
import { writeAuditLog } from '../config/logger.js';

class CronScheduler {
    /**
     * @method init
     * @desc Bootstraps all automated tasks using a locked UTC timezone to 
     * ensure global ledger consistency and synchronization with the Pi Blockchain.
     */
    static init() {
        console.log("--- [SYSTEM] Cron Scheduler Engine Initialized (UTC Mode) ---");
        writeAuditLog('INFO', 'Cron Scheduler Engine Online.');

        /**
         * TASK 1: DAILY SPOT PRICE RECALIBRATION
         * Frequency: Midnight UTC (0 0 * * *)
         * Purpose: Updates the scarcity-based 'Value 2' daily.
         */
        cron.schedule('0 0 * * *', async () => {
            writeAuditLog('INFO', '[CRON_START] Daily Price Recalibration Sequence initiated.');
            try {
                // Synchronizing the 'Water-Level' with the pricing model
                await DailyPriceJob.updatePrice();
            } catch (error) {
                writeAuditLog('CRITICAL', `Price Snapshot Failed: ${error.message}`);
            }
        }, { scheduled: true, timezone: "UTC" });

        /**
         * TASK 2: POST-IPO FINAL SETTLEMENT (Whale-Shield Enforcement)
         * Frequency: 23:00 UTC on the 28th day of the IPO cycle.
         * Purpose: Automated 10% trim-back as per Philip's Dynamic Liquidity Spec.
         */
        cron.schedule('0 23 28 * *', async () => {
            writeAuditLog('WARN', '[CRON_ALERT] IPO Closure Threshold reached. Starting Final Settlement.');
            try {
                const investors = await Investor.find({ totalPiContributed: { $gt: 0 } });
                const totalStats = await Investor.aggregate([
                    { $group: { _id: null, totalPi: { $sum: "$totalPiContributed" } } }
                ]);
                
                const totalPool = totalStats[0]?.totalPi || 0;
                
                if (totalPool > 0) {
                    // Executes the A2UaaS refund engine for excess whale stakes
                    const result = await SettlementJob.executeWhaleTrimBack(investors, totalPool);
                    writeAuditLog('INFO', `[SETTLEMENT_SUCCESS] ${result.totalRefundedPi} Pi processed in trim-back.`);
                }
            } catch (error) {
                writeAuditLog('CRITICAL', `Automated Whale Settlement Failure: ${error.message}`);
            }
        }, { scheduled: true, timezone: "UTC" });

        /**
         * TASK 3: MONTHLY VESTING RELEASE (10% Linear Release)
         * Frequency: Midnight UTC on the 1st of every month.
         * Purpose: 10-month automated disbursement cycle [Spec Page 5].
         */
        cron.schedule('0 0 1 * *', async () => {
            writeAuditLog('INFO', '[CRON_START] Monthly Vesting Disbursement Cycle.');
            try {
                // Handles the recurring A2UaaS payouts for vested equity
                await VestingJob.executeMonthlyVesting();
            } catch (error) {
                writeAuditLog('CRITICAL', `Vesting Disbursement Cycle Failed: ${error.message}`);
            }
        }, { scheduled: true, timezone: "UTC" });
    }
}

export default CronScheduler;
