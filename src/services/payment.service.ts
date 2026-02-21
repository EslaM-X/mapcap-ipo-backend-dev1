/**
 * PaymentService - Unified A2UaaS Engine (Spec-Compliant v1.7.5 TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented IPaymentResponse interface for consistent service results.
 * - Formalized axios headers and payload types for Pi SDK integration.
 * - Maintained strict precision handling via MathHelper.
 */

import axios, { AxiosResponse } from 'axios';
import MathHelper from '../utils/math.helper.js';
import Transaction, { ITransaction, TransactionType, TransactionStatus } from '../models/Transaction.js';

/**
 * @interface IPaymentResponse
 * Standardized return structure for internal payment methods.
 */
interface IPaymentResponse {
    success: boolean;
    txId?: string;
    reason?: string;
}

class PaymentService {
    /**
     * @method transferPi
     * @desc Executes a secure Pi transfer via A2UaaS protocol.
     * Supports: VESTING_RELEASE, DIVIDEND, and Philip's FINAL_WHALE_REFUND.
     */
    static async transferPi(
        payeeAddress: string, 
        grossAmount: number, 
        type: TransactionType = TransactionType.VESTING_RELEASE
    ): Promise<IPaymentResponse> {
        /**
         * 1. MANDATORY NETWORK FEE DEDUCTION
         * Requirement: [Spec Page 5] - Enforces 6-decimal precision.
         */
        const PI_NETWORK_FEE: number = 0.01; 
        const netAmount: number = MathHelper.toPiPrecision(grossAmount - PI_NETWORK_FEE);

        // Safety Gate: Prevent processing if amount doesn't cover the network fee
        if (netAmount <= 0) {
            console.warn(`[A2UaaS_REJECTED] Amount ${grossAmount} is below the 0.01 Pi fee threshold.`);
            return { success: false, reason: "Below fee threshold" };
        }

        /**
         * 2. PRE-EXECUTION AUDIT LOGGING
         * Daniel's Transparency Standard: Create 'PENDING' record before API call.
         */
        const auditRecord: ITransaction = await Transaction.create({
            piAddress: payeeAddress,
            amount: netAmount,
            type: type,
            status: TransactionStatus.PENDING,
            memo: `MapCap A2UaaS - Net: ${netAmount} Pi (Type: ${type})`
        });

        try {
            /**
             * 3. SECURE BLOCKCHAIN INTERFACE
             * Communicating with the Pi Network Mainnet Production API.
             */
            const response: AxiosResponse = await axios.post(
                'https://api.minepi.com/v2/payments',
                {
                    payment: {
                        amount: netAmount,
                        memo: `MapCap IPO Settlement: ${type}`,
                        metadata: { internalId: auditRecord._id },
                        uid: payeeAddress 
                    }
                },
                {
                    headers: { 
                        'Authorization': `Key ${process.env.PI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            /**
             * 4. LEDGER RECONCILIATION
             * Updates the record with the official Pi Blockchain Hash (TxID).
             */
            auditRecord.status = TransactionStatus.COMPLETED;
            auditRecord.piTxId = response.data.identifier; 
            await auditRecord.save();

            console.log(`[PAYMENT_SUCCESS] ${netAmount} Pi delivered to ${payeeAddress}. TXID: ${auditRecord.piTxId}`);
            return { success: true, txId: auditRecord.piTxId };

        } catch (error: any) {
            /**
             * 5. CRITICAL EXCEPTION HANDLING
             * Marks transaction as 'FAILED' for manual reconciliation.
             */
            auditRecord.status = TransactionStatus.FAILED;
            const errorMessage: string = error.response?.data?.message || error.message;
            auditRecord.memo = `A2UaaS Failure: ${errorMessage}`;
            await auditRecord.save();

            console.error(`[A2UaaS_FATAL] Transfer failed for ${payeeAddress}:`, errorMessage);
            
            return { success: false, reason: errorMessage };
        }
    }
}

export default PaymentService;
