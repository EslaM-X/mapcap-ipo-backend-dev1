/**
 * PaymentService - Unified A2UaaS Engine (Spec-Compliant v1.7.5)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * ---------------------------------------------------------
 * ROLE: 
 * Orchestrates all App-to-User (A2U) Pi transfers.
 * Adjusted to handle final IPO settlements and whale refunds seamlessly.
 * ---------------------------------------------------------
 */

import axios from 'axios';
import MathHelper from '../utils/math.helper.js';
import Transaction from '../models/transaction.model.js';

class PaymentService {
  /**
   * @method transferPi
   * @desc Executes a secure Pi transfer via A2UaaS protocol.
   * Works for VESTING, DIVIDENDS, and Philip's FINAL_WHALE_REFUND.
   */
  static async transferPi(payeeAddress, grossAmount, type = 'VESTING_RELEASE') {
    /**
     * 1. MANDATORY GAS FEE DEDUCTION
     * Requirement: [Page 5, Line 84] - Fees are deducted from the payout.
     * Guaranteed precision using MathHelper to satisfy Daniel's audit.
     */
    const PI_NETWORK_FEE = 0.01; 
    const netAmount = MathHelper.toPiPrecision(grossAmount - PI_NETWORK_FEE);

    if (netAmount <= 0) {
      console.warn(`[A2UaaS_REJECTED] Amount ${grossAmount} is too low for fees.`);
      return { success: false, reason: "Below fee threshold" };
    }

    /**
     * 2. AUDIT LOGGING (Pre-execution)
     * Requirement: Daniel's Transparency Standard. 
     * Logs 'PENDING' state to prevent double-spending or lost records.
     */
    const auditRecord = await Transaction.create({
      piAddress: payeeAddress,
      amount: netAmount,
      type: type,
      status: 'PENDING',
      memo: `MapCap A2UaaS - Net: ${netAmount} Pi (Type: ${type})`
    });

    try {
      /**
       * 3. SECURE BLOCKCHAIN EXECUTION
       * Interfacing with Pi Network Mainnet API.
       */
      const response = await axios.post('https://api.minepi.com/v2/payments', {
        payment: {
          amount: netAmount,
          memo: `MapCap IPO: ${type}`,
          metadata: { transactionId: auditRecord._id },
          uid: payeeAddress 
        }
      }, {
        headers: { 
          'Authorization': `Key ${process.env.PI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      // 4. LEDGER RECONCILIATION
      // Captures the official PiTxId for immutable record keeping.
      auditRecord.status = 'COMPLETED';
      auditRecord.piTxId = response.data.identifier; 
      await auditRecord.save();

      console.log(`[PAYMENT_SUCCESS] ${netAmount} Pi sent to ${payeeAddress}. TXID: ${auditRecord.piTxId}`);
      return { success: true, txId: auditRecord.piTxId };

    } catch (error) {
      /**
       * 5. CRITICAL EXCEPTION INTERCEPTOR
       * Failures are logged as 'FAILED' for manual reconciliation.
       */
      auditRecord.status = 'FAILED';
      auditRecord.memo = `Error: ${error.response?.data?.message || error.message}`;
      await auditRecord.save();

      console.error(`[A2UaaS_FATAL] Transfer failure for ${payeeAddress}:`, auditRecord.memo);
      throw new Error(`A2UaaS Pipeline Breach: ${auditRecord.memo}`);
    }
  }
}

export default PaymentService;
