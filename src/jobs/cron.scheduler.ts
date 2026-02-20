/**
 * Cron Scheduler - MapCap IPO Automation Engine v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE: 
 * Centralized orchestrator for automated Financial Snapshots, Whale 
 * Settlements, and Monthly Vesting release cycles.
 * * TS STABILIZATION LOG:
 * - Resolved TS2554: Aligned SettlementJob.executeWhaleTrimBack arguments.
 * - Resolved TS2551: Corrected property reference from totalRefundedPi to totalRefunded.
 * - Enforced strict timezone locking (UTC) for global financial consistency.
 */

import cron from 'node-cron';
import Investor from '../models/investor.model';
import SettlementJob from './settlement.job';
import VestingJob from './vesting.job'; 
import DailyPriceJob from './daily-price-update'; 
import { writeAuditLog } from '../config/logger';

class CronScheduler {
    /**
     * @method init
     * @description Bootstraps all automated tasks using a locked UTC timezone for global synchronization.
     */
    static init(): void {
        console.log("--- [SYSTEM] Cron Scheduler Engine Initialized (UTC Mode) ---");
        writeAuditLog('INFO', 'Cron Scheduler Engine Online.');

        /**
         * TASK 1: DAILY SPOT PRICE RECALIBRATION
         * Frequency: Midnight UTC (0 0 * * *)
         * Purpose: Updates the scarcity-based 'Value 2' (Spot Price) daily.
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
         */
        cron.schedule('0 23 28 * *', async () => {
            writeAuditLog('WARN', '[CRON_ALERT] IPO Closure Threshold reached. Starting Final Settlement.');
            try {
                /**
                 * PHASE 1: FINANCIAL DATA AGGREGATION
                 */
                const totalStats = await Investor.aggregate([
                    { $group: { _id: null, totalPi: { $sum: "$totalPiContributed" } } }
                ]);
                
                const totalPool: number = totalStats.length > 0 ? totalStats[0].totalPi : 0;
                
                if (totalPool > 0) {
                    /**
                     * PHASE 2: EXECUTE SETTLEMENT ENGINE
                     * Note: Passing totalPool as required by the SettlementJob signature.
                     */
                    const result = await SettlementJob.executeWhaleTrimBack(totalPool);
                    
                    /**
                     * PHASE 3: AUDIT LOGGING
                     * Property 'totalRefunded' is used as per ISettlementResult interface.
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
         * Purpose: 10-month automated disbursement cycle as per [Spec Page 5].
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
