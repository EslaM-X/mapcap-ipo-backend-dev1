/**
 * PayoutService - Managed Fund Distribution (A2UaaS)
 * -------------------------------------------------------------------------
 * This service implements the App-to-User-as-a-Service (A2UaaS) protocol.
 * Per Philip's Use Case (Page 5), it uses the EscrowPi API to ensure 
 * [span_2](start_span)[span_3](start_span)secure, automated withdrawals and whale refunds.[span_2](end_span)[span_3](end_span)
 */
const axios = require('axios');

class PayoutService {
    /**
     * Executes a withdrawal via EscrowPi A2UaaS API.
     * [span_4](start_span)Transaction fees are deducted from the transferred amount as per Page 5.[span_4](end_span)
     * * [span_5](start_span)@param {string} userWallet - The pioneer's destination Pi wallet.[span_5](end_span)
     * [span_6](start_span)@param {number} piAmount - The amount of Pi to be transferred.[span_6](end_span)
     */
    static async executeA2UPayout(userWallet, piAmount) {
        // Fetching secure credentials from environment variables
        const apiKey = process.env.ESCROW_PI_API_KEY;
        const apiBaseUrl = process.env.ESCROW_PI_URL || 'https://api.escrowpi.com/v1/a2uaas';

        try {
            /**
             * Unified A2UaaS Execution:
             * [span_7](start_span)This handles both individual pioneer withdrawals (0-100%)[span_7](end_span)
             * [span_8](start_span)and mandatory whale excess refunds (above 10% cap).[span_8](end_span)
             */
            const response = await axios.post(apiBaseUrl, {
                recipient: userWallet, 
                amount: piAmount,
                memo: "MapCap IPO - Authorized Withdrawal/Refund",
                metadata: {
                    project: "MapCapIPO",
                    type: "A2UaaS_Transfer"
                }
            }, {
                headers: { 
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(`[A2UaaS SUCCESS] ${piAmount} Pi transferred to ${userWallet}`);
            return response.data;

        } catch (error) {
            // Detailed error logging for Philip & Daniel's auditing
            console.error("[CRITICAL] Payout Transfer Failed:", error.response?.data || error.message);
            throw new Error("A2UaaS Transfer failed. Please check EscrowPi connectivity.");
        }
    }
}

module.exports = PayoutService;
