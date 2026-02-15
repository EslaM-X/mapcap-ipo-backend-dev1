/**
 * PayoutService - Managed Fund Distribution (A2UaaS v1.6.5)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Dynamic Settlement Logic
 * -------------------------------------------------------------------------
 * PURPOSE:
 * Implements the A2UaaS protocol for secure withdrawals and whale refunds.
 * * NOTE: This service executes the final 10% trim-back refunds only after 
 * the IPO concludes, as per the updated decentralization use case.
 */

import axios from 'axios';

class PayoutService {
    /**
     * @method executeA2UPayout
     * @desc Executes a withdrawal/refund via EscrowPi A2UaaS API.
     */
    static async executeA2UPayout(userWallet, piAmount) {
        const apiKey = process.env.ESCROW_PI_API_KEY;
        const apiBaseUrl = process.env.ESCROW_PI_URL || 'https://api.escrowpi.com/v1/a2uaas';

        if (!piAmount || piAmount <= 0) {
            console.warn(`[A2UaaS_SKIP] Invalid amount: ${piAmount} for wallet ${userWallet}`);
            return { success: false, message: "Invalid transfer amount" };
        }

        try {
            const response = await axios.post(apiBaseUrl, {
                recipient: userWallet, 
                amount: piAmount,
                memo: "MapCap IPO - Authorized Settlement Refund",
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
            const errorDetails = error.response?.data || error.message;
            console.error("[CRITICAL_A2U_FAILURE]:", errorDetails);
            throw new Error(`A2UaaS pipeline disrupted: ${JSON.stringify(errorDetails)}`);
        }
    }

    static async simpleWithdraw(userWallet, amount) {
        return await this.executeA2UPayout(userWallet, amount);
    }
}

export default PayoutService;
