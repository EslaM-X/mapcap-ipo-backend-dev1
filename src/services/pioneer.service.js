/**
 * Pioneer Service - Investor Operations v1.7.6
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Withdrawal Flexibility
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Handles dynamic withdrawal logic. Designed to maintain ledger integrity 
 * even when pool fluctuations affect individual share percentages.
 * Allows Pioneers to voluntarily re-align their stakes during the IPO phase.
 * -------------------------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import PaymentService from './payment.service.js';

class PioneerService {
    /**
     * @method withdrawByPercentage
     * @param {string} piAddress - Unique Pioneer wallet identifier.
     * @param {number} percentage - The portion of stake to liquidate (0.01 - 100).
     * @desc Executes a partial or full withdrawal. This service interfaces with 
     * the A2UaaS pipeline to return Pi to the Pioneer's wallet.
     */
    static async withdrawByPercentage(piAddress, percentage) {
        // 1. BOUNDARY VALIDATION: Ensuring the request stays within logical limits
        if (percentage <= 0 || percentage > 100) {
            throw new Error("Withdrawal percentage must be between 0.01 and 100.");
        }

        // 2. REAL-TIME LEDGER ACCESS: Fetching the Pioneer's current synchronized stake
        const investor = await Investor.findOne({ piAddress });
        if (!investor || investor.totalPiContributed <= 0) {
            throw new Error("Pioneer account not found or has zero contribution balance.");
        }

        /**
         * 3. DYNAMIC WITHDRAWAL CALCULATION:
         * Calculates the precise Pi amount based on the current ledger balance. 
         * Important: This supports Philip's 'Water-Level' fluctuation model.
         */
        const amountToWithdraw = (investor.totalPiContributed * percentage) / 100;

        console.log(`[WITHDRAWAL_INIT] Pioneer: ${piAddress} | Requested: ${percentage}% (${amountToWithdraw} Pi)`);

        try {
            /**
             * 4. BLOCKCHAIN EXECUTION (A2UaaS):
             * Dispatches funds via the secure PaymentService pipeline.
             * Note: PaymentService handles the mandatory network fee deduction.
             */
            const payoutResult = await PaymentService.transferPi(piAddress, amountToWithdraw);

            if (!payoutResult.success) {
                throw new Error(payoutResult.reason || "A2UaaS Transfer Denied");
            }

            /**
             * 5. LEDGER RECONCILIATION:
             * Subtracts the withdrawn amount from the individual's totalPiContributed.
             * The Frontend Dashboard will auto-reflect the updated sharePercentage.
             */
            investor.totalPiContributed -= amountToWithdraw;
            
            // Per Philip's Use Case: Individual 'isWhale' status is recalculated 
            // dynamically upon the next dashboard refresh.
            await investor.save();

            return {
                success: true,
                withdrawnAmount: amountToWithdraw,
                remainingBalance: investor.totalPiContributed,
                txId: payoutResult.txId,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            /**
             * CRITICAL EXCEPTION LOGGING:
             * Vital for Daniel's compliance tracking to ensure no fund leakage.
             */
            console.error(`[CRITICAL_WITHDRAWAL_FAILURE] ${piAddress}:`, error.message);
            throw new Error(`A2UaaS pipeline failed: ${error.message}. Transaction aborted for safety.`);
        }
    }
}

export default PioneerService;
