/**
 * PayoutService - Handling User Withdrawals & Distributions
 * This service provides a simplified interface for sending Pi to users.
 * Built with the "Keep It Simple" principle requested by Daniel and Philip.
 */
const axios = require('axios');

class PayoutService {
    /**
     * Executes a simple withdrawal/payout to a user's wallet.
     * @param {string} userWallet - The destination Pi wallet address.
     * @param {number} piAmount - The amount of Pi to be sent.
     * @returns {Promise<object>} - The API response from Pi Network.
     */
    static async simpleWithdraw(userWallet, piAmount) {
        // API Key provided by Daniel for the MapCap ecosystem
        const apiKey = process.env.PI_API_KEY;
        
        // Payer address is managed via environment variables for easy White-Labeling
        const payerAddress = process.env.APP_WALLET_ADDRESS || "APP_WALLET_ADDRESS";

        try {
            /**
             * Unified A2UaaS Flow: (Payer, Payee, Amount)
             * This structure ensures no interference with other batch jobs as per Philip's design.
             */
            const response = await axios.post('https://api.minepi.com/v2/payments/a2uaas', {
                payer: payerAddress, 
                payee: userWallet,
                amount: piAmount
            }, {
                headers: { 
                    'Authorization': `Key ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(`Payout Successful: ${piAmount} Pi delivered to ${userWallet}`);
            return response.data;
        } catch (error) {
            // Straightforward error handling for fast debugging during the 4-week IPO
            console.error("Payout Execution Failed:", error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = PayoutService;
