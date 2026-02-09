/**
 * Vesting Job - IPO Token Release Engine v1.5
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Automates the monthly release of MapCap tokens to IPO Pioneers.
 * Releases 10% of total allocation per month over a 10-month cycle
 * to ensure long-term stability and discourage market dumping.
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import PaymentService from '../services/payment.service.js';

class VestingJob {
    /**
     * @method executeMonthlyVesting
     * @desc Calculates and transfers the monthly 10% tranche of allocated MapCap.
     * Formula: (Total Allocated MapCap / 10) per month.
     */
    static async executeMonthlyVesting() {
        console.log("--- [FINANCIAL_ENGINE] Starting Monthly MapCap Vesting Cycle ---");

        try {
            // Fetch all pioneers who participated in the IPO cycle
            const investors = await Investor.find({ totalPiContributed: { $gt: 0 } });

            for (const investor of investors) {
                /**
                 * CALCULATION:
                 * Releasing a fixed 10% tranche based on the initial allocation.
                 * Requirement: Page 5, Sec 87-88.
                 */
                const monthlyRelease = investor.allocatedMapCap * 0.10;

                if (monthlyRelease > 0) {
                    try {
                        /**
                         * EXECUTION:
                         * Utilizing the A2UaaS (App-to-User) service via Pi SDK.
                         * This guarantees secure and transparent ledger transfers.
                         */
                        await PaymentService.transferPi(investor.piAddress, monthlyRelease);
                        
                        // LOGGING: Crucial for Daniel's audit trail
                        console.log(`[VESTING_SUCCESS] Released ${monthlyRelease} MapCap to ${investor.piAddress}`);
                        
                    } catch (err) {
                        /**
                         * RECOVERY LOGIC:
                         * Failures are logged for administrative review in the audit.log.
                         */
                        console.error(`[CRITICAL_ERROR] Vesting failed for ${investor.piAddress}:`, err.message);
                    }
                }
            }
            console.log("--- [SUCCESS] Monthly Vesting Cycle Completed ---");
        } catch (error) {
            console.error("[FATAL_ERROR] Vesting Job Aborted:", error.message);
            throw error;
        }
    }
}

export default VestingJob;
