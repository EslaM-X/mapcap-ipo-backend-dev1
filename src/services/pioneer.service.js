/**
 * Pioneer Service - Investor Operations v1.3
 * -------------------------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Withdrawal Flexibility
 * * PURPOSE:
 * Handles the logic for pioneer withdrawals based on percentages (0-100%).
 * Integrates with A2UaaS for secure blockchain execution.
 * -------------------------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import PaymentService from './payment.service.js';

class PioneerService {
    /**
     * @method withdrawByPercentage
     * @desc Executes a withdrawal based on a percentage of the user's total balance.
     * @param {string} piAddress - The pioneer's unique wallet address.
     * @param {number} percentage - Value between 0.01 and 100.
     */
    static async withdrawByPercentage(piAddress, percentage) {
        // 1. VALIDATION: Ensure the percentage is within the allowed bounds
        if (percentage <= 0 || percentage > 100) {
            throw new Error("Withdrawal percentage must be between 0.01 and 100.");
        }

        // 2. DATA RETRIEVAL: Fetch the current investor record
        const investor = await Investor.findOne({ piAddress });
        if (!investor || investor.totalPiContributed <= 0) {
            throw new Error("Pioneer account not found or has zero balance.");
        }

        /**
         * 3. CALCULATION:
         * Determines the exact Pi amount to withdraw.
         * Formula: (Total Balance * Percentage) / 100
         */
        const amountToWithdraw = (investor.totalPiContributed * percentage) / 100;

        console.log(`[WITHDRAWAL_INIT] Pioneer: ${piAddress} | Amount: ${amountToWithdraw} Pi (${percentage}%)`);

        try {
            /**
             * 4. EXECUTION (A2UaaS):
             * Perform the transfer to the pioneer's wallet.
             * Requirement: Fees (0.01 Pi) are deducted within PaymentService.
             */
            await PaymentService.transferPi(piAddress, amountToWithdraw);

            /**
             * 5. LEDGER UPDATE:
             * Subtract the withdrawn amount from the total contribution in DB.
             * This maintains the integrity of the 'Water-Level' metrics.
             */
            investor.totalPiContributed -= amountToWithdraw;
            await investor.save();

            return {
                success: true,
                withdrawnAmount: amountToWithdraw,
                remainingBalance: investor.totalPiContributed,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            /**
             * ERROR HANDLING:
             * Critical for Daniel's audit logging.
             */
            console.error(`[CRITICAL_WITHDRAWAL_FAILURE] ${piAddress}:`, error.message);
            throw new Error("A2UaaS pipeline failed to process the request. Please try again later.");
        }
    }
}

// Exporting as ES Module for compatibility with the modern Node.js stack
export default PioneerService;
