/**
 * Whale Refund Job - Anti-Whale Enforcement Protocol
 * ---------------------------------------------------------
 * Architect: Eslam Kora | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Enforces the 10% investment cap as per the "Anti-Whale Processes" 
 * defined in the MapCapIPO Use Case [Page 5, Section 6].
 * * LOGIC:
 * 1. Identifies pioneers exceeding 10% of the total IPO pool.
 * 2. Calculates the excess Pi balance.
 * 3. Triggers A2UaaS refunds for the excess amount.
 * 4. Compliance: Transaction fees are deducted during the transfer.
 */

const PaymentService = require('../services/payment.service');

/**
 * Executes the Whale Refund logic at the end of the IPO phase.
 * * @param {number} totalPiPool - The aggregate Pi collected from all pioneers.
 * @param {Array} investors - Dataset of IPO pioneers (Address, Contribution).
 */
const runWhaleRefunds = async (totalPiPool, investors) => {
    // Requirement [90]: Cap set at 10% of the total balance in the MapCapIPO wallet.
    const WHALE_CAP_LIMIT = totalPiPool * 0.10; 

    console.log(`--- [AUDIT] Initiating Anti-Whale Refund Sequence ---`);
    console.log(`--- [POOL STATS] Total: ${totalPiPool} Pi | Cap: ${WHALE_CAP_LIMIT} Pi ---`);

    for (let investor of investors) {
        // Evaluate against the 10% threshold [Requirement 90]
        if (investor.amountPi > WHALE_CAP_LIMIT) {
            const excessAmount = investor.amountPi - WHALE_CAP_LIMIT;
            
            console.log(`[WHALE DETECTED] Pioneer: ${investor.piAddress} | Excess: ${excessAmount} Pi`);
            
            try {
                /**
                 * Executing the refund using the unified A2UaaS service.
                 * * SPEC COMPLIANCE [Page 5, Line 84]: 
                 * "Transaction/gas fees are deducted from the amount transferred."
                 * The PaymentService handles this deduction to ensure ledger accuracy.
                 */
                await PaymentService.transferPi(investor.piAddress, excessAmount);
                
                console.log(`[SUCCESS] Refunded net amount (Excess - Fees) to ${investor.piAddress}`);
            } catch (error) {
                /**
                 * ERROR HANDLING [Daniel's Audit Requirement]:
                 * Failed refunds must be logged for manual reconciliation prior 
                 * to the commencement of the vesting process.
                 */
                console.error(`[CRITICAL] Refund failure for ${investor.piAddress}:`, error.message);
            }
        }
    }
    
    console.log("--- [SYSTEM] Anti-Whale Refund Process Completed Successfully ---");
};

module.exports = { runWhaleRefunds };
