/**
 * Vesting Job - IPO Token Release Engine
 * ---------------------------------------------------------
 * Executed monthly after the LP open trading commences. 
 * Transfers 10% of the allocated MapCap to each IPO Pioneer 
 * [span_4](start_span)over a 10-month duration.[span_4](end_span)
 */

const PaymentService = require('../services/payment.service');
const Investor = require('../models/Investor');

class VestingJob {
    /**
     * Executes the monthly vesting transfer.
     * [span_5](start_span)Calculated as: (Total MapCap for User / 10) per month.[span_5](end_span)
     */
    static async executeMonthlyVesting() {
        console.log("--- [SYSTEM] Starting Monthly MapCap Vesting Process ---");

        try {
            const investors = await Investor.find({ totalPiContributed: { $gt: 0 } });

            for (const investor of investors) {
                [span_6](start_span)// Calculate 10% of the total MapCap allocated to the pioneer[span_6](end_span)
                const monthlyRelease = investor.allocatedMapCap * 0.10;

                if (monthlyRelease > 0) {
                    try {
                        /**
                         * Using A2UaaS for the secure vesting transfer.
                         * [span_7](start_span)Ensures the pioneer receives their vested MapCap directly.[span_7](end_span)
                         */
                        await PaymentService.transferPi(investor.piAddress, monthlyRelease);
                        console.log(`[VESTING] Released ${monthlyRelease} MapCap to ${investor.piAddress}`);
                    } catch (err) {
                        console.error(`[ERROR] Vesting failed for ${investor.piAddress}:`, err.message);
                    }
                }
            }
            console.log("--- [SUCCESS] Monthly Vesting Cycle Completed ---");
        } catch (error) {
            console.error("[CRITICAL] Vesting Job Failure:", error.message);
        }
    }
}

module.exports = VestingJob;

