// src/services/payment.service.js

const axios = require('axios');

class PaymentService {
  /**
   * Unified A2UaaS Call
   * Used for: Vesting, Dividends, and Whale Refunds
   */
  static async transferPi(payeeAddress, amount) {
    const payerAddress = "GDWY6ATRSIWA2PEP7QFPFDBYXX443BOKDXUWJNH5XFE3NBWRVYPEX22X"; // App Testnet Wallet
    
    const payload = {
      payer: payerAddress,
      payee: payeeAddress,
      amount: amount
    };

    try {
      // استدعاء API الـ Pi باستخدام المفتاح الذي أرسله دانيال
      const response = await axios.post('https://api.minepi.com/v2/payments/a2uaas', payload, {
        headers: { 'Authorization': `Key ${process.env.PI_API_KEY}` }
      });
      return response.data;
    } catch (error) {
      console.error("Transfer Error:", error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = PaymentService;

