/**
 * PaymentService - Unified A2UaaS Engine (Spec-Compliant v1.5)
 * ---------------------------------------------------------
 * Architect: Eslam Kora | Spec: Philip Jennings [Page 5, 84]
 * Role: Handles all outgoing Pi transfers (Vesting, Dividends, Refunds).
 */
const axios = require('axios');

class PaymentService {
  /**
   * Executes a Pi transfer with mandatory fee deduction.
   * Logic: (Gross Amount - Network Fee) = Net Transfer.
   */
  static async transferPi(payeeAddress, grossAmount) {
    [span_1](start_span)// 1. Mandatory Gas Fee Deduction per Spec[span_1](end_span)
    const PI_NETWORK_FEE = 0.01; 
    const netAmount = grossAmount - PI_NETWORK_FEE;

    // Safety check to ensure the amount covers the fee
    if (netAmount <= 0) {
      console.error(`[A2UaaS] Amount ${grossAmount} too low to cover fees.`);
      return { success: false, reason: "Insufficient for gas fees" };
    }

    const payerAddress = process.env.APP_WALLET_ADDRESS;
    
    // Standardized payload structure
    const payload = {
      payer: payerAddress,
      payee: payeeAddress,
      amount: parseFloat(netAmount.toFixed(4)) // Ensuring Pi precision
    };

    try {
      /**
       * Secure A2UaaS API Call
       * Authorized by Daniel's Security Protocol.
       */
      const response = await axios.post('https://api.minepi.com/v2/payments/a2uaas', payload, {
        headers: { 
          'Authorization': `Key ${process.env.PI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`[SUCCESS] Sent ${netAmount} Pi to ${payeeAddress} (Fee ${PI_NETWORK_FEE} deducted)`);
      return response.data;
    } catch (error) {
      console.error("A2UaaS Transfer Error:", error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = PaymentService;
