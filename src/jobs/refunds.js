/**
 * Whale Refund Job - Anti-Whale Enforcement Protocol v1.4
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Enforces the 10% investment cap as per the "Anti-Whale Processes" 
 * defined in the MapCapIPO Use Case [Page 5, Section 6].
 * ---------------------------------------------------------
 */

import PaymentService from '../services/payment.service.js';

/**
 * @function runWhaleRefunds
 * @desc Executes the Whale Refund logic at the end of the IPO phase.
 * @param {number} totalPiPool - The aggregate Pi collected from all pioneers.
 * @param {Array} investors - Dataset of IPO pioneers (Address, Contribution).
 */
export const runWhaleRefunds = async (totalPiPool, investors) => {
    // REQUIREMENT [90]: Cap set at 10% of the total balance in the MapCapIPO wallet.
    const WHALE_CAP_LIMIT = totalPiPool * 0.10; 

    console.log(`--- [AUDIT] Initiating Anti-Whale Refund Sequence ---`);
    console.log(`--- [POOL_STATS] Total: ${totalPiPool} Pi | Cap: ${WHALE_CAP_LIMIT} Pi ---`);

    for (let investor of investors) {
        /**
         * EVALUATION:
         * We compare the contribution against the 10% threshold. 
         * Note: 'amountPi' corresponds to 'totalPiContributed' in our model.
         */
        const contribution = investor.amountPi || investor.totalPiContributed;

        if (contribution > WHALE_CAP_LIMIT) {
            const excessAmount = contribution - WHALE_CAP_LIMIT;
            
            console.warn(`[WHALE_DETECTED] Pioneer: ${investor.piAddress} | Excess: ${excessAmount} Pi`);
            
            try {
                /**
                 * EXECUTION:
                 * Using the unified A2UaaS (App-to-User) service.
                 * SPEC COMPLIANCE [Page 5, Line 84]: 
                 * "Transaction/gas fees are deducted from the amount transferred."
                 */
                await PaymentService.transferPi(investor.piAddress, excessAmount);
                
                console.log(`[SUCCESS] Refund processed for ${investor.piAddress}. Ledger updated.`);
            } catch (error) {
                /**
                 * DANIEL'S AUDIT REQUIREMENT:
                 * Failed refunds are logged for manual reconciliation before 
                 * the 10-month vesting cycle begins.
                 */
                console.error(`[CRITICAL_AUDIT_FAILURE] Refund failed for ${investor.piAddress}:`, error.message);
            }
        }
    }
    
    console.log("--- [SYSTEM] Anti-Whale Refund Process Completed Successfully ---");
};
