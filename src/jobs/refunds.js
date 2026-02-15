/**
 * Whale Refund Job - Anti-Whale Enforcement Protocol v1.7.5
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Dynamic Post-IPO Settlement
 * ---------------------------------------------------------
 * LOGIC:
 * Executed ONLY after the 4-week IPO period. It calculates the final 
 * 'Water-Level' and trims back any stake exceeding the 10% ceiling.
 */

import PaymentService from '../services/payment.service.js';

/**
 * Executes the Whale Refund logic at the end of the IPO phase.
 * @param {number} totalPiPool - The final aggregate Pi collected.
 * @param {Array} investors - Dataset of IPO pioneers.
 */
export const runWhaleRefunds = async (totalPiPool, investors) => {
    // Requirement [90]: Cap set at 10% of the FINAL total balance.
    // This allows flexibility during the IPO as per Philip's requirement.
    const WHALE_CAP_LIMIT = totalPiPool * 0.10; 

    console.log(`--- [AUDIT] Initiating Post-IPO Anti-Whale Refund Sequence ---`);
    console.log(`--- [POOL STATS] Final Pool: ${totalPiPool} Pi | 10% Cap: ${WHALE_CAP_LIMIT} Pi ---`);

    for (let investor of investors) {
        // Use totalPiContributed from the model to check against the final limit
        const contribution = investor.totalPiContributed || investor.amountPi;

        if (contribution > WHALE_CAP_LIMIT) {
            const excessAmount = contribution - WHALE_CAP_LIMIT;
            
            console.log(`[WHALE_TRIM_REQUIRED] Pioneer: ${investor.piAddress} | Excess: ${excessAmount} Pi`);
            
            try {
                /**
                 * Executing the refund via A2UaaS (App-to-User).
                 * SPEC COMPLIANCE: Fees (0.01 Pi) are deducted from this refund amount.
                 */
                await PaymentService.transferPi(investor.piAddress, excessAmount, 'WHALE_EXCESS_REFUND');
                
                console.log(`[SUCCESS] Trim-back refund dispatched to ${investor.piAddress}`);
            } catch (error) {
                // Daniel's Requirement: Log for manual audit if blockchain transfer fails.
                console.error(`[CRITICAL_REFUND_FAIL] ${investor.piAddress}:`, error.message);
            }
        }
    }
    
    console.log("--- [SYSTEM] Post-IPO Settlement Sequence Finalized ---");
};

export default { runWhaleRefunds };
