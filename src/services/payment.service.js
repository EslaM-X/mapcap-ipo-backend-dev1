/**
 * PaymentService - Unified A2UaaS (App-to-User-as-a-Service) Engine
 * * This service handles all outgoing Pi transfers from the App wallet to users.
 * Following Philip's architectural vision, it uses a standardized (Payer, Payee, Amount) 
 * flow for Vesting, Dividends, and Anti-Whale Refunds.
 */
const axios = require('axios');

class PaymentService {
  /**
   * Executes a Pi transfer using the Pi Network A2UaaS API.
   * * @param {string} payeeAddress - The destination Pi wallet address.
   * @param {number} amount - The amount of Pi to transfer.
   * @returns {Promise<object>} - The API response data.
   */
  static async transferPi(payeeAddress, amount) {
    // App wallet address is pulled from environment variables to support White-Label flexibility
    const payerAddress = process.env.APP_WALLET_ADDRESS || "GDWY6ATRSIWA2PEP7QFPFDBYXX443BOKDXUWJNH5XFE3NBWRVYPEX22X";
    
    // Standardized payload structure as requested by Philip
    const payload = {
      payer: payerAddress,
      payee: payeeAddress,
      amount: amount
    };

    try {
      /**
       * Secure API call using the API Key provided by Daniel.
       * The endpoint follows the A2UaaS protocol for seamless App-to-User payments.
       */
      const response = await axios.post('https://api.minepi.com/v2/payments/a2uaas', payload, {
        headers: { 
          'Authorization': `Key ${process.env.PI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`Payment Successful: ${amount} Pi sent to ${payeeAddress}`);
      return response.data;
    } catch (error) {
      // Clean error logging for easier debugging in the early build phase
      console.error("A2UaaS Transfer Error:", error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = PaymentService;
