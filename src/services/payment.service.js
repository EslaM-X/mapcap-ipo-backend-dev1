/**
 * PaymentService - Unified A2UaaS Engine (Spec-Compliant v1.6)
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings [Page 5, 84]
 * * ROLE: 
 * Orchestrates all outgoing Pi transfers (Vesting, Dividends, Refunds).
 * Enforces mandatory fee deductions to maintain liquidity integrity.
 * ---------------------------------------------------------
 */

import axios from 'axios';

class PaymentService {
  /**
   * @method transferPi
   * @desc Executes a secure Pi transfer with mandatory network fee deduction.
   * @param {string} payeeAddress - The Pioneer's Pi wallet address.
   * @param {number} grossAmount - Total amount before fees.
   * @returns {Object} Pi Network API response.
   */
  static async transferPi(payeeAddress, grossAmount) {
    /**
     * 1. MANDATORY GAS FEE DEDUCTION (Spec Requirement)
     * Logic: (Gross Amount - Network Fee) = Net Transfer.
     * Standard Pi Network Fee: 0.01 Pi.
     */
    const PI_NETWORK_FEE = 0.01; 
    const netAmount = grossAmount - PI_NETWORK_FEE;

    // Safety check to ensure the amount is viable for transfer
    if (netAmount <= 0) {
      console.warn(`[A2UaaS_REJECTED] Amount ${grossAmount} Pi is insufficient to cover the 0.01 network fee.`);
      return { success: false, reason: "Insufficient balance for network fees" };
    }

    /**
     * DANIEL'S SECURITY PROTOCOL:
     * Credentials injected from .env to ensure zero-exposure of private keys.
     */
    const payerAddress = process.env.APP_WALLET_ADDRESS;
    
    // Payload preparation for the Pi SDK / API
    const payload = {
      payer: payerAddress,
      payee: payeeAddress,
      amount: parseFloat(netAmount.toFixed(6)), // 6-decimal precision for financial accuracy
      metadata: { 
        type: "IPO_DISTRIBUTION",
        source: "MapCap_Financial_Engine"
      }
    };

    try {
      /**
       * SECURE A2UaaS API EXECUTION
       * Communicating with the official Pi Network V2 Payment endpoint.
       */
      const response = await axios.post('https://api.minepi.com/v2/payments/a2uaas', payload, {
        headers: { 
          'Authorization': `Key ${process.env.PI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`[PAYMENT_SUCCESS] Transferred ${netAmount} Pi to ${payeeAddress}. Transaction Fee: ${PI_NETWORK_FEE}`);
      return response.data;

    } catch (error) {
      /**
       * CRITICAL ERROR LOGGING:
       * Errors here must be captured for the Audit Trail required by Daniel.
       */
      const errorMsg = error.response?.data?.message || error.message;
      console.error(`[A2UaaS_FATAL_ERROR] Transaction Failed: ${errorMsg}`);
      throw new Error(`A2UaaS Transfer Disrupted: ${errorMsg}`);
    }
  }
}

export default PaymentService;
