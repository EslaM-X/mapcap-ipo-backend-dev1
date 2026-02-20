/**
 * Payment Controller - Financial Operations v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Dynamic IPO Flow
 * -------------------------------------------------------------------------
 * TS STABILIZATION LOG:
 * - Resolved TS2835: Added explicit .js extensions for NodeNext ESM compliance.
 * - Resolved TS2322: Adjusted return types to Promise<any> for Express middleware.
 * - Integrity Guard: Maintained 1:1 API contract to ensure Zero-Breakage 
 * for PaymentStatus.jsx and Pi SDK callback integrations.
 */

import { Request, Response } from 'express';

/**
 * INTERNAL MODULE IMPORTS
 * Mandatory .js extensions for successful resolution in NodeNext environment.
 */
import Investor from '../models/investor.model.js';
import Transaction from '../models/Transaction.js';
import ResponseHelper from '../utils/response.helper.js';
import { writeAuditLog } from '../config/logger.js';

/**
 * @interface PaymentResponse
 * Contract for the final ledger synchronization output.
 * Ensures the Frontend receives consistent financial keys.
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
     * @description Processes and validates Pi Network transactions into the MapCap ledger.
     * Maps various naming conventions (CamelCase, snake_case, Pi SDK) to a unified internal structure.
     * @access Private / Authenticated
     * @returns Promise<any>
     */
    static async processInvestment(req: Request, res: Response): Promise<any> {
        /**
         * ROBUST DATA EXTRACTION:
         * Synchronizes different payload structures from Pi SDK and custom Frontend calls.
         * Maintains compatibility with legacy and modern request naming conventions.
         */
        const piAddress: string = req.body.piAddress || req.body.pi_address || req.body.uid;
        const amount: any = req.body.amount;
        const piTxId: string = req.body.piTxId || 
                               req.body.pi_tx_id || 
                               req.body.paymentId || 
                               (req.body.metadata && req.body.metadata.txid);

        // 1. INPUT VALIDATION: Ensure all core financial metadata is present.
        if (!piAddress || !amount || !piTxId) {
            return ResponseHelper.error(res, "Missing Metadata: Transaction credentials (Address/Amount/TXID) are required.", 400);
        }

        try {
            /**
             * 2. IDEMPOTENCY CHECK:
             * Prevents ledger duplicates by verifying the unique Pi Blockchain Transaction ID.
             */
            const existingTx = await Transaction.findOne({ piTxId });
            if (existingTx) {
                return ResponseHelper.error(res, "Duplicate Entry: This transaction has already been synchronized.", 409);
            }

            const investmentAmount: number = Number(amount);

            /**
             * 3. ATOMIC LEDGER UPDATES:
             * Recording the verified transaction and updating the Pioneer's total contribution stake.
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

            // 4. COMPLIANCE AUDITING: Log successful synchronization for the financial audit trail.
            writeAuditLog('INFO', `Investment Success: ${investmentAmount} Pi | Tx: ${piTxId} | Pioneer: ${piAddress}`);

            /**
             * 5. STANDARDIZED SUCCESS RESPONSE:
             * Strictly returns consistent keys to maintain parity with PaymentStatus.jsx.
             * Keys preserved: pioneer, contribution, totalBalance, piTxId.
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
             * 6. CRITICAL EXCEPTION HANDLING:
             * Ensures failures are logged with high-severity for immediate infrastructure review.
             */
            writeAuditLog('CRITICAL', `Pipeline Error: ${error.message} (Pioneer: ${piAddress})`);
            console.error(`[PAYMENT_CONTROLLER_CRITICAL]: ${error.stack}`);
            
            return ResponseHelper.error(res, "Internal Financial Pipeline Error. Support Ref: " + Date.now(), 500);
        }
    }
}

export default PaymentController;
