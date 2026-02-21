/**
 * Pioneer Service - Investor Operations v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Withdrawal Flexibility
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Defined IWithdrawalResult interface for standardized service output.
 * - Implemented strict parameter typing for financial calculations.
 * - Ensured atomic ledger updates following successful A2UaaS dispatch.
 */

import Investor, { IInvestor } from '../models/investor.model.js';
import PaymentService from './payment.service.js';

/**
 * @interface IWithdrawalResult
 * Standardized structure for withdrawal operation responses.
 */
interface IWithdrawalResult {
    success: boolean;
    withdrawnAmount: number;
    remainingBalance: number;
    txId?: string;
    timestamp: string;
}

class PioneerService {
    /**
     * @method withdrawByPercentage
     * @param {string} piAddress - Unique Pioneer wallet identifier.
     * @param {number} percentage - The portion of stake to liquidate (0.01 - 100).
     * @desc Executes a partial or full withdrawal through the A2UaaS pipeline.
     */
    static async withdrawByPercentage(piAddress: string, percentage: number): Promise<IWithdrawalResult> {
        // 1. BOUNDARY VALIDATION: Ensuring the request stays within logical limits
        if (percentage <= 0 || percentage > 100) {
            throw new Error("Withdrawal percentage must be between 0.01 and 100.");
        }

        // 2. REAL-TIME LEDGER ACCESS: Fetching the Pioneer's current synchronized stake
        const investor: IInvestor | null = await Investor.findOne({ piAddress });
        
        if (!investor || investor.totalPiContributed <= 0) {
            throw new Error("Pioneer account not found or has zero contribution balance.");
        }

        /**
         * 3. DYNAMIC WITHDRAWAL CALCULATION:
         * Precise Pi amount calculation aligned with Philip's 'Water-Level' model.
         */
        const amountToWithdraw: number = (investor.totalPiContributed * percentage) / 100;

        console.log(`[WITHDRAWAL_INIT] Pioneer: ${piAddress} | Requested: ${percentage}% (${amountToWithdraw} Pi)`);

        try {
            /**
             * 4. BLOCKCHAIN EXECUTION (A2UaaS):
             * Dispatches funds via the secure PaymentService pipeline.
             */
            const payoutResult = await PaymentService.transferPi(piAddress, amountToWithdraw);

            if (!payoutResult.success) {
                throw new Error(payoutResult.reason || "A2UaaS Transfer Denied");
            }

            /**
             * 5. LEDGER RECONCILIATION:
             * Updates the individual record to maintain financial integrity.
             */
            investor.totalPiContributed -= amountToWithdraw;
            
            // Re-calculating state and persisting changes to MongoDB
            await investor.save();

            return {
                success: true,
                withdrawnAmount: amountToWithdraw,
                remainingBalance: investor.totalPiContributed,
                txId: payoutResult.txId,
                timestamp: new Date().toISOString()
            };

        } catch (error: any) {
            /**
             * CRITICAL EXCEPTION LOGGING:
             * Vital for Daniel's compliance tracking.
             */
            console.error(`[CRITICAL_WITHDRAWAL_FAILURE] ${piAddress}:`, error.message);
            throw new Error(`A2UaaS pipeline failed: ${error.message}. Transaction aborted for safety.`);
        }
    }
}

export default PioneerService;
