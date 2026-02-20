/**
 * Vesting Job - IPO Token Release Engine v1.6.5
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Linear Distribution Model
 * -------------------------------------------------------------------------
 * PURPOSE:
 * Automates the monthly 10% release of MapCap equity.
 * Integrated with the Post-IPO Settlement logic to ensure only compliant 
 * (Non-Whale) or adjusted balances are processed for vesting.
 * -------------------------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import PaymentService from '../services/payment.service.js';
import MathHelper from '../utils/math.helper.js';
import { writeAuditLog } from '../config/logger.js';

class VestingJob {
    /**
     * @method executeMonthlyVesting
     * @description Orchestrates the 10-month linear release.
     * Note: This job respects the final 'isWhale' status determined 
     * at the end of the 4-week IPO period.
     */
    static async executeMonthlyVesting() {
        console.log("🕒 --- [VESTING_ENGINE] Monthly Distribution Cycle Started ---");
        writeAuditLog('INFO', 'Vesting Engine: Monthly Tranche Release Initiated.');

        try {
            /**
             * 1. PIONEER SELECTION FILTER
             * Targets investors who have completed the IPO and the 
             * final settlement audit (where isWhale is finalized).
             */
            const investors = await Investor.find({ 
                totalPiContributed: { $gt: 0 },
                vestingMonthsCompleted: { $lt: 10 },
                isWhale: false // Processes those who are within the 10% cap post-settlement
            });

            if (investors.length === 0) {
                console.log("ℹ️ [SYSTEM] Idle State: No pending vesting tranches detected.");
                return;
            }

            for (const investor of investors) {
                /**
                 * 2. PROPORTIONAL CALCULATION (10% Monthly)
                 * High-precision math to satisfy Daniel's audit requirements.
                 */
                const monthlyRelease = MathHelper.toPiPrecision(investor.allocatedMapCap * 0.10);

                if (monthlyRelease > 0) {
                    try {
                        /**
                         * 3. BLOCKCHAIN SETTLEMENT (A2UaaS)
                         */
                        await PaymentService.transferPi(investor.piAddress, monthlyRelease);
                        
                        /**
                         * 4. LEDGER SYNCHRONIZATION
                         */
                        investor.vestingMonthsCompleted += 1;
                        investor.lastContributionDate = new Date();
                        await investor.save();

                        writeAuditLog('INFO', `[TRANCHE_RELEASED] ${investor.vestingMonthsCompleted}/10 to ${investor.piAddress}`);
                        
                    } catch (err) {
                        writeAuditLog('CRITICAL', `[PAYOUT_FAILURE] ${investor.piAddress}: ${err.message}`);
                        console.error(`❌ [PIPELINE_ERROR] Payment failed for ${investor.piAddress}`);
                    }
                }
            }

            console.log("🏁 --- [SUCCESS] Monthly Vesting Cycle Finalized ---");
        } catch (error) {
            writeAuditLog('CRITICAL', `[FATAL_SYSTEM_ERROR] Vesting Job Crash: ${error.message}`);
            throw error;
        }
    }
}

export default VestingJob;
