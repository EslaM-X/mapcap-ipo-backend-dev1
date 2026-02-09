/**
 * Vesting Job - IPO Token Release Engine v1.6
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Automates the monthly 10% release of MapCap tokens.
 * Enforces a 10-month linear vesting schedule to ensure 
 * ecosystem stability and discourage market volatility.
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import PaymentService from '../services/payment.service.js';
import MathHelper from '../utils/math.helper.js';
import { writeAuditLog } from '../config/logger.js';

class VestingJob {
    /**
     * @method executeMonthlyVesting
     * @desc Calculates and transfers the monthly 10% tranche via A2UaaS.
     * Tracks tranche progress to prevent over-distribution.
     */
    static async executeMonthlyVesting() {
        console.log("--- [VESTING_ENGINE] Starting Monthly Distribution Cycle ---");
        writeAuditLog('INFO', 'Monthly Vesting Cycle Initiated.');

        try {
            // 1. Fetch only investors who haven't completed their 10-month cycle
            const investors = await Investor.find({ 
                totalPiContributed: { $gt: 0 },
                vestingMonthsCompleted: { $lt: 10 } 
            });

            if (investors.length === 0) {
                console.log("[SYSTEM] No pending vesting tranches found.");
                return;
            }

            for (const investor of investors) {
                /**
                 * 2. PROPORTIONAL CALCULATION [Requirement 87-88]
                 * Releasing exactly 10% of the total stake.
                 */
                const monthlyRelease = MathHelper.toPiPrecision(investor.allocatedMapCap * 0.10);

                if (monthlyRelease > 0) {
                    try {
                        /**
                         * 3. BLOCKCHAIN EXECUTION (A2UaaS)
                         * Direct App-to-User payout via the Pi Network SDK.
                         */
                        await PaymentService.transferPi(investor.piAddress, monthlyRelease);
                        
                        // 4. LEDGER UPDATE: Increment the completion counter
                        investor.vestingMonthsCompleted += 1;
                        investor.lastVestingDate = new Date();
                        await investor.save();

                        writeAuditLog('INFO', `[VESTING_SUCCESS] Released Tranche ${investor.vestingMonthsCompleted}/10 to ${investor.piAddress}`);
                        
                    } catch (err) {
                        /**
                         * DANIEL'S AUDIT PROTOCOL:
                         * Failed tranches are flagged for manual reconciliation.
                         */
                        writeAuditLog('CRITICAL', `Vesting FAILED for ${investor.piAddress}: ${err.message}`);
                        console.error(`[CRITICAL_ERROR] Payout Pipeline Interrupted:`, err.message);
                    }
                }
            }

            

            console.log("--- [SUCCESS] Monthly Vesting Cycle Completed ---");
            writeAuditLog('INFO', 'Monthly Vesting Cycle Finished Successfully.');

        } catch (error) {
            writeAuditLog('CRITICAL', `Vesting Job Fatal Error: ${error.message}`);
            console.error("[FATAL_ERROR] Vesting Job Aborted:", error.message);
            throw error;
        }
    }
}

export default VestingJob;
