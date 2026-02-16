/**
 * Payment Controller - Financial Operations v1.6.7
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 */

import Investor from '../models/investor.model.js';
import Transaction from '../models/Transaction.js';
import ResponseHelper from '../utils/response.helper.js';
import { writeAuditLog } from '../config/logger.js';

class PaymentController {
    /**
     * @method processInvestment
     * @desc Standardizes incoming metadata from Frontend and Pi SDK.
     */
    static async processInvestment(req, res) {
        // REFINEMENT: Support both flat body and nested metadata structures
        const piAddress = req.body.piAddress || req.body.uid;
        const amount = req.body.amount;
        const piTxId = req.body.piTxId || req.body.paymentId || (req.body.metadata && req.body.metadata.txid);

        // 1. INPUT VALIDATION: Standardized for Map-of-Pi Protocol
        if (!piAddress || !amount || !piTxId) {
            return ResponseHelper.error(res, "Missing Metadata: 'piAddress', 'amount', and 'piTxId' are required for ledger sync.", 400);
        }

        try {
            // 2. IDEMPOTENCY: Prevent double-spending
            const existingTx = await Transaction.findOne({ piTxId });
            if (existingTx) {
                return ResponseHelper.error(res, "Duplicate Transaction: This TXID is already recorded.", 409);
            }

            const investmentAmount = Number(amount);

            // 3. ATOMIC UPDATES: Ledger and Investor Balance
            const newTransaction = await Transaction.create({
                piAddress,
                amount: investmentAmount,
                type: 'INVESTMENT',
                status: 'COMPLETED',
                piTxId,
                memo: `IPO Contribution - Dynamic Water-Level`
            });

            const investor = await Investor.findOneAndUpdate(
                { piAddress },
                { 
                    $inc: { totalPiContributed: investmentAmount },
                    $set: { lastContributionDate: Date.now() }
                },
                { upsert: true, new: true }
            );

            // 4. COMPLIANCE: Daniel's Audit Log
            writeAuditLog('INFO', `Investment Verified: ${investmentAmount} Pi | Tx: ${piTxId}`);

            // 5. RESPONSE: Preserved structure for Frontend compatibility
            return ResponseHelper.success(res, "Investment successfully synchronized.", {
                pioneer: piAddress,
                contribution: investmentAmount,
                totalBalance: investor.totalPiContributed,
                piTxId
            });

        } catch (error) {
            writeAuditLog('CRITICAL', `Payment Pipeline Failure: ${error.message}`);
            return ResponseHelper.error(res, "Internal Ledger Error. Reference ID: " + Date.now(), 500);
        }
    }
}

export default PaymentController;
