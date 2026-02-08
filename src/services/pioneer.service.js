/**
 * Pioneer Service - Investor Operations
 * -------------------------------------------------------------------------
 * Handles the logic for pioneer withdrawals based on percentages (0-100%)
 * as specified in Philip's Use Case document.
 */

const Investor = require('../models/Investor');
const PaymentService = require('./payment.service'); [span_6](start_span)// Using A2UaaS for transfers[span_6](end_span)

class PioneerService {
    /**
     * Executes a withdrawal based on a percentage of the user's total balance.
     * @param {string} piAddress - The pioneer's wallet address.
     * @param {number} percentage - Value between 0.01 and 100.
     */
    static async withdrawByPercentage(piAddress, percentage) {
        [span_7](start_span)// 1. Validate the percentage range[span_7](end_span)
        if (percentage <= 0 || percentage > 100) {
            throw new Error("Withdrawal percentage must be between 0 and 100.");
        }

        // 2. Fetch the current investor record
        const investor = await Investor.findOne({ piAddress });
        if (!investor || investor.totalPiContributed <= 0) {
            throw new Error("No balance available for withdrawal.");
        }

        /**
         * 3. [span_8](start_span)Calculate the exact Pi amount to withdraw.[span_8](end_span)
         * Formula: (Total Balance * Percentage) / 100
         */
        const amountToWithdraw = (investor.totalPiContributed * percentage) / 100;

        try {
            /**
             * 4. [span_9](start_span)Perform the A2UaaS transfer to the pioneer's wallet.[span_9](end_span)
             * [span_10](start_span)Note: Fees are deducted from the transferred amount as per instructions.[span_10](end_span)
             */
            await PaymentService.transferPi(piAddress, amountToWithdraw);

            // 5. Update the investor's balance in the database
            investor.totalPiContributed -= amountToWithdraw;
            await investor.save();

            return {
                success: true,
                withdrawnAmount: amountToWithdraw,
                remainingBalance: investor.totalPiContributed
            };
        } catch (error) {
            console.error(`[WITHDRAWAL ERROR] ${piAddress}:`, error.message);
            throw new Error("Failed to process withdrawal via A2UaaS.");
        }
    }
}

module.exports = PioneerService;
