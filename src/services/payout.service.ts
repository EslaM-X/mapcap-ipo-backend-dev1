/**
 * PayoutService - Managed Fund Distribution (A2UaaS v1.7.5 TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Dynamic Settlement Logic
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented strict Promise return types for async operations.
 * - Enforced AxiosResponse typing for EscrowPi integration.
 * - Confirmed 2-Parameter Signature: (userWallet, piAmount).
 * - Maintained legacy aliases (simpleWithdraw) for Frontend-Backend bridge stability.
 */

import axios, { AxiosResponse } from 'axios';

/**
 * @interface IA2UResponse
 * Represents the expected response structure from EscrowPi API.
 * Flex-enabled for various blockchain metadata.
 */
interface IA2UResponse {
    success: boolean;
    transactionId?: string;
    message?: string;
    [key: string]: any; 
}

class PayoutService {
    /**
     * @method executeA2UPayout
     * @param {string} userWallet - The recipient's Pi wallet address.
     * @param {number} piAmount - The net amount of Pi to be transferred.
     * @desc Executes a secure withdrawal/refund via EscrowPi A2UaaS API.
     * Note: This service automatically appends project metadata and compliance memos.
     * @returns Promise<IA2UResponse>
     */
    static async executeA2UPayout(userWallet: string, piAmount: number): Promise<IA2UResponse> {
        /**
         * SECURE CREDENTIAL FETCHING:
         * Satisfying Daniel's Level 4 Security Audit for financial transactions.
         */
        const apiKey: string | undefined = process.env.ESCROW_PI_API_KEY;
        const apiBaseUrl: string = process.env.ESCROW_PI_URL || 'https://api.escrowpi.com/v1/a2uaas';

        /**
         * VALIDATION GATE: 
         * Prevents zero or negative transfers at the service level to avoid API overhead.
         */
        if (!piAmount || piAmount <= 0) {
            console.warn(`[A2UaaS_SKIP] Invalid amount detected: ${piAmount} for wallet ${userWallet}`);
            return { success: false, message: "Invalid transfer amount" };
        }

        try {
            /**
             * API SYNCHRONIZATION:
             * Communicates with the EscrowPi gateway to finalize the transfer.
             * The payload is structured to satisfy Pi Network mainnet requirements.
             */
            const response: AxiosResponse<IA2UResponse> = await axios.post(apiBaseUrl, {
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
             * Returns the standard EscrowPi response object to the caller (e.g., SettlementJob).
             */
            return response.data;

        } catch (error: any) {
            /**
             * EXCEPTION HANDLING:
             * Detailed logging for Daniel's financial reconciliation reports.
             * Propagates errors to caller to ensure atomic job failure on critical issues.
             */
            const errorDetails = error.response?.data || error.message;
            console.error("[CRITICAL_A2U_FAILURE]:", errorDetails);
            
            throw new Error(`A2UaaS pipeline disrupted: ${JSON.stringify(errorDetails)}`);
        }
    }

    /**
     * @method simpleWithdraw
     * @param {string} userWallet - Target Pi wallet.
     * @param {number} amount - Amount to withdraw.
     * @desc Legacy Alias for executeA2UPayout.
     * Ensures zero breakage across the existing Frontend components.
     */
    static async simpleWithdraw(userWallet: string, amount: number): Promise<IA2UResponse> {
        return await this.executeA2UPayout(userWallet, amount);
    }
}

export default PayoutService;
