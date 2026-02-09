/**
 * PayoutService - Managed Fund Distribution (A2UaaS v1.6)
 * -------------------------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Implements the App-to-User-as-a-Service (A2UaaS) protocol.
 * Ensures secure, automated withdrawals and mandatory whale refunds 
 * via the EscrowPi API integration [Spec Page 5].
 * -------------------------------------------------------------------------
 */

import axios from 'axios';

class PayoutService {
    /**
     * @method executeA2UPayout
     * @desc Executes a withdrawal/refund via EscrowPi A2UaaS API.
     * @param {string} userWallet - The pioneer's destination Pi wallet address.
     * @param {number} piAmount - The net amount of Pi to be transferred.
     */
    static async executeA2UPayout(userWallet, piAmount) {
        // Fetching secure credentials from environment variables (Daniel's Standard)
        const apiKey = process.env.ESCROW_PI_API_KEY;
        const apiBaseUrl = process.env.ESCROW_PI_URL || 'https://api.escrowpi.com/v1/a2uaas';

        /**
         * SAFETY CHECK:
         * Prevents zero or negative transfers which could trigger API errors.
         */
        if (!piAmount || piAmount <= 0) {
            console.warn(`[A2UaaS_SKIP] Invalid amount: ${piAmount} for wallet ${userWallet}`);
            return { success: false, message: "Invalid transfer amount" };
        }

        try {
            /**
             * UNIFIED A2UaaS EXECUTION:
             * This handles both individual pioneer withdrawals and 
             * mandatory whale excess refunds (above 10% cap).
             */
            const response = await axios.post(apiBaseUrl, {
                recipient: userWallet, 
                amount: piAmount,
                memo: "MapCap IPO - Authorized Withdrawal/Refund",
                metadata: {
                    project: "MapCap_IPO",
                    type: "A2UaaS_Financial_Engine",
                    timestamp: new Date().toISOString()
                }
            }, {
                headers: { 
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(`[A2UaaS_SUCCESS] ${piAmount} Pi transferred to ${userWallet}`);
            return response.data;

        } catch (error) {
            /**
             * CRITICAL AUDIT LOGGING:
             * Detailed failure reporting for Daniel's compliance monitoring.
             */
            const errorDetails = error.response?.data || error.message;
            console.error("[CRITICAL_A2U_FAILURE]:", errorDetails);
            
            throw new Error(`A2UaaS pipeline disrupted. Details: ${JSON.stringify(errorDetails)}`);
        }
    }

    /**
     * @method simpleWithdraw
     * @desc Simplified wrapper for basic withdrawal requests.
     */
    static async simpleWithdraw(userWallet, amount) {
        return await this.executeA2UPayout(userWallet, amount);
    }
}

// Exported as ES Module for seamless integration with the financial engine
export default PayoutService;
