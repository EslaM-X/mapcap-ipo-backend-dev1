/**
 * Payment Controller - Financial Operations v1.5
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Financial Audit Standards
 * * PURPOSE:
 * Processes incoming investment payments, synchronizes the Ledger, 
 * and maintains the immutable transaction history for the IPO.
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import Transaction from '../models/transaction.model.js';
import ResponseHelper from '../utils/response.helper.js';

class PaymentController {
    /**
     * @method processInvestment
     * @desc Records the transaction and updates the Pioneer's equity stake.
     * Called post-transaction via the Pi Network Frontend SDK callback.
     */
    static async processInvestment(req, res) {
        const { piAddress, amount, piTxId } = req.body;

        // 1. INPUT VALIDATION: Basic integrity check before DB operations
        if (!piAddress || !amount || !piTxId) {
            return ResponseHelper.error(res, "Missing transaction metadata (Wallet, Amount, or TXID).", 400);
        }

        try {
            /**
             * 2. AUDIT LOGGING:
             * Daniel's Requirement: Record the movement *before* updating balances.
             * This ensures we have a trace even if the investor update fails.
             */
            const newTransaction = await Transaction.create({
                piAddress,
                amount,
                type: 'INVESTMENT',
                status: 'COMPLETED',
                piTxId,
                memo: `IPO Contribution - Week ${Math.ceil((new Date().getDate()) / 7)}`
            });

            /**
             * 3. LEDGER SYNCHRONIZATION:
             * Updates or initializes the Investor's profile in the MapCap Ecosystem.
             */
            let investor = await Investor.findOne({ piAddress });

            if (investor) {
                investor.totalPiContributed += Number(amount);
                investor.lastContributionDate = Date.now();
            } else {
                investor = new Investor({
                    piAddress,
                    totalPiContributed: Number(amount)
                });
            }

            // Save the updated state to MongoDB
            await investor.save();

            

            // 4. SUCCESS RESPONSE: Informing the UI to refresh the 'Water-Level'
            return ResponseHelper.success(res, "Investment successfully synchronized with MapCap Ledger.", {
                transactionId: newTransaction._id,
                piTxId: piTxId,
                newTotalBalance: investor.totalPiContributed,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            /**
             * 5. ERROR HANDLING:
             * Specifically catch duplicate piTxId to prevent double-spending attacks.
             */
            if (error.code === 11000) {
                return ResponseHelper.error(res, "Duplicate Transaction: This PiTxId has already been processed.", 409);
            }

            console.error(`[PAYMENT_FAILURE]: ${error.message}`);
            return ResponseHelper.error(res, "Financial Pipeline Interrupted. Please contact support.", 500);
        }
    }
}

export default PaymentController;
