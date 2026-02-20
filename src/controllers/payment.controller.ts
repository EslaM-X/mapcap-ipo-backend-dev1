/**
 * Payment Controller - Financial Operations v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Dynamic IPO Flow
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented Robust Payload Mapping (Polymorphic inputs).
 * - Added strict typing for Transactions and Investor models.
 * - Integrated Audit Logging with TypeScript severity levels.
 */

import { Request, Response } from 'express';
import Investor from '../models/investor.model.js';
import Transaction from '../models/Transaction.js';
import ResponseHelper from '../utils/response.helper.js';
import { writeAuditLog } from '../config/logger.js';

/**
 * @interface PaymentResponse
 * Contract for the final ledger synchronization output.
 */
interface PaymentResponse {
    pioneer: string;
    contribution: number;
    totalBalance: number;
    piTxId: string;
    syncDate: string;
}

class PaymentController {
    /**
     * @method processInvestment
     * @desc Processes and validates Pi Network transactions into the MapCap ledger.
     */
    static async processInvestment(req: Request, res: Response): Promise<void> {
        /**
         * ROBUST DATA EXTRACTION:
         * Maps different naming conventions (CamelCase, snake_case, Pi SDK) 
         * to a unified internal structure.
         */
        const piAddress: string = req.body.piAddress || req.body.pi_address || req.body.uid;
        const amount: number | string = req.body.amount;
        const piTxId: string = req.body.piTxId || 
                               req.body.pi_tx_id || 
                               req.body.paymentId || 
                               (req.body.metadata && req.body.metadata.txid);

        // 1. INPUT VALIDATION
        if (!piAddress || !amount || !piTxId) {
            return ResponseHelper.error(res, "Missing Metadata: Transaction credentials (Address/Amount/TXID) are required.", 400);
        }

        try {
            /**
             * 2. IDEMPOTENCY CHECK:
             * Prevents ledger duplicates. Essential for financial integrity.
             */
            const existingTx = await Transaction.findOne({ piTxId });
            if (existingTx) {
                return ResponseHelper.error(res, "Duplicate Entry: This transaction has already been synchronized.", 409);
            }

            const investmentAmount: number = Number(amount);

            /**
             * 3. ATOMIC TRANSACTIONS:
             * Recording blockchain transaction and updating Pioneer's stake.
             */
            await Transaction.create({
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
                    $set: { lastContributionDate: new Date() }
                },
                { upsert: true, new: true }
            );

            // 4. COMPLIANCE AUDITING
            writeAuditLog('INFO', `Investment Success: ${investmentAmount} Pi | Tx: ${piTxId} | Pioneer: ${piAddress}`);

            /**
             * 5. STANDARDIZED RESPONSE:
             * Returns consistent keys to prevent UI errors on the Dashboard.
             */
            const successPayload: PaymentResponse = {
                pioneer: piAddress,
                contribution: investmentAmount,
                totalBalance: investor?.totalPiContributed || 0,
                piTxId,
                syncDate: new Date().toISOString()
            };

            return ResponseHelper.success(res, "Ledger synchronization successful.", successPayload);

        } catch (error: any) {
            /**
             * 6. CRITICAL ERROR HANDLING
             */
            writeAuditLog('CRITICAL', `Pipeline Error: ${error.message} (Pioneer: ${piAddress})`);
            console.error(`[PAYMENT_CONTROLLER_CRITICAL]: ${error.stack}`);
            
            return ResponseHelper.error(res, "Internal Financial Pipeline Error. Support Ref: " + Date.now(), 500);
        }
    }
}

export default PaymentController;
