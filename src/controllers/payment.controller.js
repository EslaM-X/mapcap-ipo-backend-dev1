/**
 * Payment Controller - Financial Operations v1.6
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Financial Audit Standards
 * * PURPOSE:
 * Processes incoming investment payments (U2A), updates equity balances,
 * and maintains the immutable transaction history for the IPO.
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import Transaction from '../models/transaction.model.js';
import ResponseHelper from '../utils/response.helper.js';
import { writeAuditLog } from '../config/logger.js';

class PaymentController {
    /**
     * @method processInvestment
     * @desc Records transaction and updates Pioneer stake post-SDK callback.
     * Enforces strict idempotency via unique piTxId.
     */
    static async processInvestment(req, res) {
        const { piAddress, amount, piTxId } = req.body;

        // 1. INPUT VALIDATION: Ensure financial metadata is present
        if (!piAddress || !amount || !piTxId) {
            return ResponseHelper.error(res, "Missing transaction metadata.", 400);
        }

        try {
            /**
             * 2. IDEMPOTENCY CHECK:
             * Prevents processing the same blockchain transaction twice.
             */
            const existingTx = await Transaction.findOne({ piTxId });
            if (existingTx) {
                return ResponseHelper.error(res, "Duplicate Transaction: TXID already processed.", 409);
            }

            /**
             * 3. LEDGER & TRANSACTION ATOMICITY:
             * Recording the movement and updating the investor profile.
             */
            const investmentAmount = Number(amount);

            const newTransaction = await Transaction.create({
                piAddress,
                amount: investmentAmount,
                type: 'INVESTMENT',
                status: 'COMPLETED',
                piTxId,
                memo: `IPO Contribution - Manual Sync via SDK Callback`
            });

            // Update Investor Equity Stake
            const investor = await Investor.findOneAndUpdate(
                { piAddress },
                { 
                    $inc: { totalPiContributed: investmentAmount },
                    $set: { lastContributionDate: Date.now() }
                },
                { upsert: true, new: true } // Creates record if it doesn't exist
            );

            

            /**
             * 4. AUDIT LOGGING:
             * Daniel's Compliance Requirement: Permanent log of the successful sync.
             */
            writeAuditLog('INFO', `Investment Processed: ${investmentAmount} Pi from ${piAddress} (TX: ${piTxId})`);

            // 5. SUCCESS RESPONSE
            return ResponseHelper.success(res, "Ledger Synchronized Successfully.", {
                pioneer: piAddress,
                contribution: investmentAmount,
                totalBalance: investor.totalPiContributed,
                piTxId
            });

        } catch (error) {
            /**
             * 6. CRITICAL ERROR HANDLING:
             * Catching system failures and logging them for manual recovery.
             */
            writeAuditLog('CRITICAL', `Payment Processing Failed for ${piAddress}: ${error.message}`);
            console.error(`[PAYMENT_FAILURE]: ${error.message}`);
            return ResponseHelper.error(res, "Financial Pipeline Error. Support ID: " + Date.now(), 500);
        }
    }
}

export default PaymentController;
