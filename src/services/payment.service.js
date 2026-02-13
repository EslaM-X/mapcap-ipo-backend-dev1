/**
 * PaymentService - Unified A2UaaS Engine (Spec-Compliant v1.7)
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings [Page 5, 84]
 * * ROLE: 
 * Orchestrates all App-to-User (A2U) Pi transfers.
 * Enforces mandatory fee deductions and high-precision math.
 * ---------------------------------------------------------
 */

import axios from 'axios';
import MathHelper from '../utils/math.helper.js';
import Transaction from '../models/transaction.model.js';

class PaymentService {
  /**
   * @method transferPi
   * @desc Executes a secure Pi transfer via A2UaaS protocol.
   * @param {string} payeeAddress - Pioneer's wallet address.
   * @param {number} grossAmount - Amount before fee deduction.
   * @param {string} type - Transaction type (REFUND, DIVIDEND, VESTING).
   */
  static async transferPi(payeeAddress, grossAmount, type = 'VESTING_RELEASE') {
    /**
     * 1. MANDATORY GAS FEE DEDUCTION
     * Requirement: [Page 5, Line 84] - Fees are deducted from the payout.
     */
    const PI_NETWORK_FEE = 0.01; 
    const netAmount = MathHelper.toPiPrecision(grossAmount - PI_NETWORK_FEE);

    if (netAmount <= 0) {
      console.warn(`[A2UaaS_REJECTED] Amount ${grossAmount} is too low for fees.`);
      return { success: false, reason: "Below fee threshold" };
    }

    /**
     * 2. AUDIT LOGGING (Pre-execution)
     * Creating a PENDING record to ensure no transaction is "lost" in transit.
     */
    const auditRecord = await Transaction.create({
      piAddress: payeeAddress,
      amount: netAmount,
      type: type,
      status: 'PENDING',
      memo: `A2UaaS Payment - Net: ${netAmount} Pi`
    });

    

    try {
      /**
       * 3. SECURE BLOCKCHAIN EXECUTION
       * Utilizing Pi Network V2 API for App-to-User payouts.
       */
      const response = await axios.post('https://api.minepi.com/v2/payments', {
        payment: {
          amount: netAmount,
          memo: `MapCap IPO: ${type}`,
          metadata: { transactionId: auditRecord._id },
          uid: payeeAddress // Assuming piAddress as the UID for the SDK
        }
      }, {
        headers: { 
          'Authorization': `Key ${process.env.PI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      // 4. LEDGER RECONCILIATION
      // Update our internal log with the real PiTxId from the blockchain.
      auditRecord.status = 'COMPLETED';
      auditRecord.piTxId = response.data.identifier; // The official TX Hash
      await auditRecord.save();

      console.log(`[PAYMENT_SUCCESS] ${netAmount} Pi sent to ${payeeAddress}. TXID: ${auditRecord.piTxId}`);
      return { success: true, txId: auditRecord.piTxId };

    } catch (error) {
      /**
       * 5. CRITICAL ERROR HANDLING
       * Captures API errors for manual reconciliation by Daniel.
       */
      auditRecord.status = 'FAILED';
      auditRecord.memo = `Error: ${error.response?.data?.message || error.message}`;
      await auditRecord.save();

      console.error(`[A2UaaS_FATAL] Transfer failed for ${payeeAddress}:`, auditRecord.memo);
      throw new Error(`A2UaaS Pipeline Breach: ${auditRecord.memo}`);
    }
  }
}

export default PaymentService;
