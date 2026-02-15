/**
 * Payment Controller - Financial Operations v1.6.5
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Dynamic IPO Flexibility
 * ---------------------------------------------------------
 * PURPOSE:
 * Processes incoming investment payments (U2A). Updated to allow 
 * contributions to flow freely during the IPO phase, deferring 
 * whale capping to the final settlement stage per Philip's Spec.
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import Transaction from '../models/transaction.model.js';
import ResponseHelper from '../utils/response.helper.js';
import { writeAuditLog } from '../config/logger.js';

class PaymentController {
    /**
     * @method processInvestment
     * @desc Records transaction and updates Pioneer stake.
     * Logic: Accepts all valid Pi transfers without hard-capping at 10% 
     * during this phase to account for pool fluctuations.
     */
    static async processInvestment(req, res) {
        const { piAddress, amount, piTxId } = req.body;

        // 1. INPUT VALIDATION
        if (!piAddress || !amount || !piTxId) {
            return ResponseHelper.error(res, "Missing transaction metadata.", 400);
        }

        try {
            /**
             * 2. IDEMPOTENCY CHECK:
             * Ensures no double-crediting of the same blockchain transaction.
             */
            const existingTx = await Transaction.findOne({ piTxId });
            if (existingTx) {
                return ResponseHelper.error(res, "Duplicate Transaction: TXID already processed.", 409);
            }

            /**
             * 3. ATOMIC LEDGER UPDATE:
             * Per Philip's requirement: We increment the total contribution 
             * WITHOUT enforcing the 10% ceiling here. This allows the 
             * "Water-Level" to fluctuate naturally.
             */
            const investmentAmount = Number(amount);

            const newTransaction = await Transaction.create({
                piAddress,
                amount: investmentAmount,
                type: 'INVESTMENT',
                status: 'COMPLETED',
                piTxId,
                memo: `IPO Contribution - Dynamic Sync`
            });

            // Update Investor Balance - No 'isWhale' check here to prevent UX friction
            const investor = await Investor.findOneAndUpdate(
                { piAddress },
                { 
                    $inc: { totalPiContributed: investmentAmount },
                    $set: { lastContributionDate: Date.now() }
                },
                { upsert: true, new: true }
            );

            /**
             * 4. AUDIT LOGGING:
             * Daniel's Standard: Every successful contribution is logged 
             * for the final 4-week cycle audit.
             */
            writeAuditLog('INFO', `Investment Processed: ${investmentAmount} Pi from ${piAddress} (TX: ${piTxId})`);

            // 5. SUCCESS RESPONSE: Structure preserved for Frontend Dashboard compatibility
            return ResponseHelper.success(res, "Ledger Synchronized Successfully.", {
                pioneer: piAddress,
                contribution: investmentAmount,
                totalBalance: investor.totalPiContributed,
                piTxId
            });

        } catch (error) {
            /**
             * 6. EXCEPTION HANDLING:
             * Critical for Daniel's monitoring.
             */
            writeAuditLog('CRITICAL', `Payment Processing Failed for ${piAddress}: ${error.message}`);
            console.error(`[PAYMENT_FAILURE]: ${error.message}`);
            return ResponseHelper.error(res, "Financial Pipeline Error. Support ID: " + Date.now(), 500);
        }
    }
}

export default PaymentController;
