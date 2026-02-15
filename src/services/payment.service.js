/**
 * PaymentService - Unified A2UaaS Engine (Spec-Compliant v1.7.6)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE: 
 * Orchestrates all App-to-User (A2U) Pi transfers via Pi Network SDK.
 * Handles final IPO settlements, Whale Refunds, and Vesting releases.
 * -------------------------------------------------------------------------
 */

import axios from 'axios';
import MathHelper from '../utils/math.helper.js';
import Transaction from '../models/Transaction.js'; // PATH FIXED: Linked to unified Transaction model

class PaymentService {
  /**
   * @method transferPi
   * @desc Executes a secure Pi transfer via A2UaaS protocol.
   * Supports: VESTING_RELEASE, DIVIDEND, and Philip's FINAL_WHALE_REFUND.
   * @access Internal System Layer
   */
  static async transferPi(payeeAddress, grossAmount, type = 'VESTING_RELEASE') {
    /**
     * 1. MANDATORY NETWORK FEE DEDUCTION
     * Requirement: [Spec Page 5] - Transaction fees are deducted from the payout.
     * Enforces 6-decimal precision to satisfy Daniel's financial audit.
     */
    const PI_NETWORK_FEE = 0.01; 
    const netAmount = MathHelper.toPiPrecision(grossAmount - PI_NETWORK_FEE);

    // Safety Gate: Prevent processing if amount doesn't cover the network fee
    if (netAmount <= 0) {
      console.warn(`[A2UaaS_REJECTED] Amount ${grossAmount} is below the 0.01 Pi fee threshold.`);
      return { success: false, reason: "Below fee threshold" };
    }

    /**
     * 2. PRE-EXECUTION AUDIT LOGGING
     * Daniel's Transparency Standard: Create 'PENDING' record before API call
     * to prevent "lost" transactions in case of network timeouts.
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
       * 3. SECURE BLOCKCHAIN INTERFACE
       * Communicating with the Pi Network Mainnet Production API.
       */
      const response = await axios.post('https://api.minepi.com/v2/payments', {
        payment: {
          amount: netAmount,
          memo: `MapCap IPO Settlement: ${type}`,
          metadata: { internalId: auditRecord._id },
          uid: payeeAddress 
        }
      }, {
        headers: { 
          'Authorization': `Key ${process.env.PI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      /**
       * 4. LEDGER RECONCILIATION
       * Updates the record with the official Pi Blockchain Hash (TxID).
       */
      auditRecord.status = 'COMPLETED';
      auditRecord.piTxId = response.data.identifier; 
      await auditRecord.save();

      console.log(`[PAYMENT_SUCCESS] ${netAmount} Pi delivered to ${payeeAddress}. TXID: ${auditRecord.piTxId}`);
      return { success: true, txId: auditRecord.piTxId };

    } catch (error) {
      /**
       * 5. CRITICAL EXCEPTION HANDLING
       * Marks transaction as 'FAILED' for Daniel's manual reconciliation.
       */
      auditRecord.status = 'FAILED';
      const errorMessage = error.response?.data?.message || error.message;
      auditRecord.memo = `A2UaaS Failure: ${errorMessage}`;
      await auditRecord.save();

      console.error(`[A2UaaS_FATAL] Transfer failed for ${payeeAddress}:`, errorMessage);
      
      // Return structured failure instead of crashing the entire Job pipeline
      return { success: false, reason: errorMessage };
    }
  }
}

export default PaymentService;
