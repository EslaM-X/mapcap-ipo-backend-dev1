/**
 * Vesting Job - IPO Token Release Engine v1.6 (Production Grade)
 * -------------------------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * * PURPOSE:
 * Automates the monthly 10% release of MapCap equity to Pioneers.
 * Enforces a strict 10-month linear vesting schedule to maintain 
 * ecosystem stability and mitigate early-market volatility.
 * -------------------------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import PaymentService from '../services/payment.service.js';
import MathHelper from '../utils/math.helper.js';
import { writeAuditLog } from '../config/logger.js';

class VestingJob {
    /**
     * @method executeMonthlyVesting
     * @description Orchestrates the calculation and transfer of the monthly 10% 
     * tranche via the A2UaaS (App-to-User-as-a-Service) protocol.
     * Prevents over-distribution by tracking individual completion counters.
     */
    static async executeMonthlyVesting() {
        console.log("🕒 --- [VESTING_ENGINE] Monthly Distribution Cycle Started ---");
        writeAuditLog('INFO', 'Vesting Engine: Monthly Tranche Release Initiated.');

        try {
            /**
             * 1. PIONEER SELECTION FILTER
             * Fetches active participants who have not yet completed their 
             * 10-month vesting cycle and have active contributions.
             */
            const investors = await Investor.find({ 
                totalPiContributed: { $gt: 0 },
                vestingMonthsCompleted: { $lt: 10 },
                isWhale: false // Only non-whale accounts are auto-processed
            });

            if (investors.length === 0) {
                console.log("ℹ️ [SYSTEM] Idle State: No pending vesting tranches detected.");
                return;
            }

            console.log(`📊 [SCAN] Found ${investors.length} eligible Pioneers for distribution.`);

            for (const investor of investors) {
                /**
                 * 2. PROPORTIONAL CALCULATION (Requirement Ref: PJ-87)
                 * Calculation: Releases exactly 10% (1/10th) of the total allocated equity.
                 * Uses MathHelper to maintain Pi Network decimal precision.
                 */
                const monthlyRelease = MathHelper.toPiPrecision(investor.allocatedMapCap * 0.10);

                if (monthlyRelease > 0) {
                    try {
                        /**
                         * 3. BLOCKCHAIN SETTLEMENT (A2UaaS)
                         * Direct financial payout executed via the Pi Network SDK Service.
                         */
                        await PaymentService.transferPi(investor.piAddress, monthlyRelease);
                        
                        /**
                         * 4. LEDGER SYNCHRONIZATION
                         * Increments progress and updates the timestamp to ensure 
                         * a clear audit trail for Daniel's compliance review.
                         */
                        investor.vestingMonthsCompleted += 1;
                        investor.lastContributionDate = new Date();
                        await investor.save();

                        writeAuditLog('INFO', `[TRANCHE_RELEASED] ${investor.vestingMonthsCompleted}/10 | Recipient: ${investor.piAddress}`);
                        console.log(`✅ [SUCCESS] Tranche dispatched to: ${investor.piAddress}`);
                        
                    } catch (err) {
                        /**
                         * DANIEL'S AUDIT PROTOCOL:
                         * Failed tranches are logged with CRITICAL status for manual 
                         * reconciliation by the Map-of-Pi administrative team.
                         */
                        writeAuditLog('CRITICAL', `[PAYOUT_FAILURE] Identity: ${investor.piAddress} | Error: ${err.message}`);
                        console.error(`❌ [PIPELINE_ERROR] Payment failed for ${investor.piAddress}:`, err.message);
                    }
                }
            }

            console.log("🏁 --- [SUCCESS] Monthly Vesting Cycle Finalized ---");
            writeAuditLog('INFO', 'Vesting Engine: Cycle finished successfully.');

        } catch (error) {
            writeAuditLog('CRITICAL', `[FATAL_SYSTEM_ERROR] Vesting Job Aborted: ${error.message}`);
            console.error("🚨 [ENGINE_FAILURE] Vesting Job Critical Crash:", error.message);
            throw error; // Propagate to global error handler
        }
    }
}

export default VestingJob;
