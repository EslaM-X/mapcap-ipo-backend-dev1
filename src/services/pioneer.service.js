/**
 * Pioneer Service - Investor Operations v1.7.5
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Withdrawal Flexibility
 * -------------------------------------------------------------------------
 * PURPOSE:
 * Handles dynamic withdrawal logic. Designed to maintain ledger integrity 
 * even when pool fluctuations affect individual share percentages.
 * -------------------------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import PaymentService from './payment.service.js';

class PioneerService {
    /**
     * @method withdrawByPercentage
     * @desc Executes a partial or full withdrawal (0.01% - 100%).
     * @param {string} piAddress - Unique Pioneer wallet.
     * @param {number} percentage - The portion of stake to liquidate.
     */
    static async withdrawByPercentage(piAddress, percentage) {
        // 1. BOUNDARY VALIDATION
        if (percentage <= 0 || percentage > 100) {
            throw new Error("Withdrawal percentage must be between 0.01 and 100.");
        }

        // 2. REAL-TIME LEDGER ACCESS
        const investor = await Investor.findOne({ piAddress });
        if (!investor || investor.totalPiContributed <= 0) {
            throw new Error("Pioneer account not found or has zero balance.");
        }

        /**
         * 3. DYNAMIC CALCULATION:
         * Calculates Pi amount based on the current balance. 
         * Important: This allows investors to re-align their 10% cap 
         * voluntarily during the IPO phase if they choose.
         */
        const amountToWithdraw = (investor.totalPiContributed * percentage) / 100;

        console.log(`[WITHDRAWAL_INIT] Pioneer: ${piAddress} | Amount: ${amountToWithdraw} Pi`);

        try {
            /**
             * 4. BLOCKCHAIN EXECUTION (A2UaaS):
             * Dispatches funds via the secure PaymentService pipeline.
             */
            await PaymentService.transferPi(piAddress, amountToWithdraw);

            /**
             * 5. LEDGER RECONCILIATION:
             * Updates totalPiContributed. Note: sharePercentage in the 
             * Dashboard will auto-recalculate based on the new 'Water-Level'.
             */
            investor.totalPiContributed -= amountToWithdraw;
            
            // Per Philip's Use Case: isWhale status will be re-evaluated 
            // by the final Settlement Job at the end of the IPO cycle.
            await investor.save();

            return {
                success: true,
                withdrawnAmount: amountToWithdraw,
                remainingBalance: investor.totalPiContributed,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            // Audit Logging for Daniel's compliance tracking
            console.error(`[CRITICAL_WITHDRAWAL_FAILURE] ${piAddress}:`, error.message);
            throw new Error("A2UaaS pipeline failed. Transaction aborted for safety.");
        }
    }
}

export default PioneerService;
