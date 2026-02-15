/**
 * PayoutService - Managed Fund Distribution (A2UaaS v1.6.6)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Dynamic Settlement Logic
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Implements the A2UaaS protocol for secure withdrawals and whale refunds.
 * NOTE: This service is the primary engine for the 10% trim-back refunds 
 * that occur post-IPO, ensuring decentralization compliance.
 * -------------------------------------------------------------------------
 */

import axios from 'axios';

class PayoutService {
    /**
     * @method executeA2UPayout
     * @param {String} userWallet - The recipient's Pi wallet address.
     * @param {Number} piAmount - The net amount of Pi to be transferred.
     * @desc Executes a secure withdrawal/refund via EscrowPi A2UaaS API.
     * Integrated with Philip's dynamic settlement requirements.
     */
    static async executeA2UPayout(userWallet, piAmount) {
        /**
         * SECURE CREDENTIAL FETCHING:
         * Uses environment variables to prevent API key exposure, 
         * satisfying Daniel's Level 4 Security Audit.
         */
        const apiKey = process.env.ESCROW_PI_API_KEY;
        const apiBaseUrl = process.env.ESCROW_PI_URL || 'https://api.escrowpi.com/v1/a2uaas';

        // VALIDATION GATE: Prevent zero or negative transfers at the service level
        if (!piAmount || piAmount <= 0) {
            console.warn(`[A2UaaS_SKIP] Invalid amount: ${piAmount} for wallet ${userWallet}`);
            return { success: false, message: "Invalid transfer amount" };
        }

        try {
            /**
             * API SYNCHRONIZATION:
             * Communicates with the EscrowPi gateway to finalize the transfer.
             * Memo and metadata are preserved for transparent audit trails.
             */
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

            console.log(`[A2UaaS_SUCCESS] ${piAmount} Pi successfully transferred to ${userWallet}`);
            
            /**
             * SUCCESS RESPONSE: 
             * Returns the standard EscrowPi response object to the caller.
             */
            return response.data;

        } catch (error) {
            /**
             * EXCEPTION HANDLING:
             * Detailed logging for Daniel's financial reconciliation reports.
             */
            const errorDetails = error.response?.data || error.message;
            console.error("[CRITICAL_A2U_FAILURE]:", errorDetails);
            
            // Critical failures are thrown to stop automated jobs and prevent inconsistent states
            throw new Error(`A2UaaS pipeline disrupted: ${JSON.stringify(errorDetails)}`);
        }
    }

    /**
     * @method simpleWithdraw
     * @desc Alias for executeA2UPayout to maintain compatibility with legacy controllers.
     * Ensures zero breakage across the existing Frontend-Backend bridge.
     */
    static async simpleWithdraw(userWallet, amount) {
        return await this.executeA2UPayout(userWallet, amount);
    }
}

export default PayoutService;
