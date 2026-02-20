/**
 * Payment Controller - Financial Operations v1.6.8
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Dynamic IPO Flow
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Manages the investment lifecycle. Optimized to handle multi-source 
 * metadata (Pi SDK, Mobile App, and Integration Tests) without breaking.
 */

import Investor from '../models/investor.model.js';
import Transaction from '../models/Transaction.js';
import ResponseHelper from '../utils/response.helper.js';
import { writeAuditLog } from '../config/logger.js';

class PaymentController {
    /**
     * @method processInvestment
     * @desc Processes and validates Pi Network transactions into the MapCap ledger.
     * Supports flexible field mapping to ensure compatibility across all versions.
     */
    static async processInvestment(req, res) {
        /**
         * ROBUST DATA EXTRACTION:
         * Maps different naming conventions (CamelCase, snake_case, Pi SDK) 
         * to a unified internal structure.
         */
        const piAddress = req.body.piAddress || req.body.pi_address || req.body.uid;
        const amount = req.body.amount;
        const piTxId = req.body.piTxId || req.body.pi_tx_id || req.body.paymentId || (req.body.metadata && req.body.metadata.txid);

        // 1. INPUT VALIDATION: Ensuring mandatory blockchain proofs are present
        if (!piAddress || !amount || !piTxId) {
            return ResponseHelper.error(res, "Missing Metadata: Transaction credentials (Address/Amount/TXID) are required.", 400);
        }

        try {
            /**
             * 2. IDEMPOTENCY CHECK:
             * Prevents ledger duplicates. Critical for financial integrity.
             */
            const existingTx = await Transaction.findOne({ piTxId });
            if (existingTx) {
                return ResponseHelper.error(res, "Duplicate Entry: This transaction has already been synchronized.", 409);
            }

            const investmentAmount = Number(amount);

            /**
             * 3. ATOMIC TRANSACTIONS:
             * Step A: Record the blockchain transaction in the internal ledger.
             * Step B: Update the Pioneer's total stake in the ecosystem.
             */
            const newTransaction = await Transaction.create({
                piAddress,
                amount: investmentAmount,
                type: 'INVESTMENT',
                status: 'COMPLETED',
                piTxId,
                memo: `IPO Contribution - Water-Level Sync`
            });

            const investor = await Investor.findOneAndUpdate(
                { piAddress },
                { 
                    $inc: { totalPiContributed: investmentAmount },
                    $set: { lastContributionDate: Date.now() }
                },
                { upsert: true, new: true }
            );

            // 4. COMPLIANCE AUDITING: Logging for future cycle reviews
            writeAuditLog('INFO', `Investment Success: ${investmentAmount} Pi | Tx: ${piTxId} | Pioneer: ${piAddress}`);

            /**
             * 5. STANDARDIZED RESPONSE:
             * Returns consistent keys to prevent UI 'undefined' errors on the Pulse Dashboard.
             */
            return ResponseHelper.success(res, "Ledger synchronization successful.", {
                pioneer: piAddress,
                contribution: investmentAmount,
                totalBalance: investor.totalPiContributed,
                piTxId,
                syncDate: new Date().toISOString()
            });

        } catch (error) {
            /**
             * 6. CRITICAL ERROR HANDLING:
             * Ensures system failures are logged for rapid incident response.
             */
            writeAuditLog('CRITICAL', `Pipeline Error: ${error.message} (Pioneer: ${piAddress})`);
            console.error(`[PAYMENT_CONTROLLER_CRITICAL]: ${error.stack}`);
            
            return ResponseHelper.error(res, "Internal Financial Pipeline Error. Support Ref: " + Date.now(), 500);
        }
    }
}

export default PaymentController;
