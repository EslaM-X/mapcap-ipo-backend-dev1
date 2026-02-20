/**
 * Cron Scheduler - MapCap IPO Automation Engine v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE: 
 * Centralized orchestrator for automated Financial Snapshots, Whale 
 * Settlements, and Monthly Vesting release cycles.
 * -------------------------------------------------------------------------
 * TS STABILIZATION LOG:
 * - Resolved TS2835: Appended mandatory .js extensions for ESM compatibility.
 * - Resolved TS2554 & TS2551: Standardized SettlementJob method arguments 
 * and interface property references.
 * - Integrity: Locked to UTC timezone to ensure global financial synchronization.
 */

import cron from 'node-cron';

/**
 * INTERNAL MODULE IMPORTS
 * Explicit .js extensions are required for successful module resolution 
 * in the NodeNext ECMAScript environment.
 */
import Investor from '../models/investor.model.js';
import SettlementJob from './settlement.job.js';
import VestingJob from './vesting.job.js'; 
import DailyPriceJob from './daily-price-update.js'; 
import { writeAuditLog } from '../config/logger.js';

class CronScheduler {
    /**
     * @method init
     * @description Bootstraps all automated tasks using a locked UTC timezone.
     * This method acts as the heartbeat of the MapCap automated economy.
     */
    static init(): void {
        console.log("--- [SYSTEM] Cron Scheduler Engine Initialized (UTC Mode) ---");
        writeAuditLog('INFO', 'Cron Scheduler Engine Online.');

        /**
         * TASK 1: DAILY SPOT PRICE RECALIBRATION
         * Frequency: Midnight UTC (0 0 * * *)
         * Purpose: Updates the scarcity-based 'Value 2' (Spot Price) daily 
         * to reflect the current ecosystem liquidity.
         */
        cron.schedule('0 0 * * *', async () => {
            writeAuditLog('INFO', '[CRON_START] Daily Price Recalibration Sequence initiated.');
            try {
                await DailyPriceJob.updatePrice();
            } catch (error: any) {
                writeAuditLog('CRITICAL', `Price Snapshot Failed: ${error.message}`);
            }
        }, { scheduled: true, timezone: "UTC" });

        /**
         * TASK 2: POST-IPO FINAL SETTLEMENT (Whale-Shield Enforcement)
         * Frequency: 23:00 UTC on the 28th day of the IPO cycle.
         * Purpose: Automated 10% trim-back as per Philip's Dynamic Liquidity Spec.
         * Ensures decentralization by capping individual stakes post-stabilization.
         */
        cron.schedule('0 23 28 * *', async () => {
            writeAuditLog('WARN', '[CRON_ALERT] IPO Closure Threshold reached. Starting Final Settlement.');
            try {
                /**
                 * PHASE 1: FINANCIAL DATA AGGREGATION
                 * Calculating total global liquidity to determine the 10% ceiling.
                 */
                const totalStats = await Investor.aggregate([
                    { $group: { _id: null, totalPi: { $sum: "$totalPiContributed" } } }
                ]);
                
                const totalPool: number = totalStats.length > 0 ? totalStats[0].totalPi : 0;
                
                if (totalPool > 0) {
                    /**
                     * PHASE 2: EXECUTE SETTLEMENT ENGINE
                     * Invoking the Whale-Shield protocol based on the aggregated pool.
                     */
                    const result = await SettlementJob.executeWhaleTrimBack(totalPool);
                    
                    /**
                     * PHASE 3: AUDIT LOGGING
                     * Utilizing 'totalRefunded' property as defined in ISettlementResult.
                     */
                    writeAuditLog('INFO', `[SETTLEMENT_SUCCESS] ${result.totalRefunded} Pi processed in trim-back.`);
                }
            } catch (error: any) {
                writeAuditLog('CRITICAL', `Automated Whale Settlement Failure: ${error.message}`);
            }
        }, { scheduled: true, timezone: "UTC" });

        /**
         * TASK 3: MONTHLY VESTING RELEASE (10% Linear Release)
         * Frequency: Midnight UTC on the 1st of every month.
         * Purpose: Automated disbursement cycle as per [Spec Page 5].
         * Manages the gradual release of MapCap assets over a 10-month period.
         */
        cron.schedule('0 0 1 * *', async () => {
            writeAuditLog('INFO', '[CRON_START] Monthly Vesting Disbursement Cycle.');
            try {
                await VestingJob.executeMonthlyVesting();
            } catch (error: any) {
                writeAuditLog('CRITICAL', `Vesting Disbursement Cycle Failed: ${error.message}`);
            }
        }, { scheduled: true, timezone: "UTC" });
    }
}

export default CronScheduler;
