/**
 * Whale Refund Job - Anti-Whale Enforcement Protocol v1.5.5
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Dynamic Post-IPO Settlement
 * ---------------------------------------------------------
 * PURPOSE:
 * Enforces the 10% investment cap only after the IPO concludes.
 * Ensures decentralization while allowing flexibility during the cycle.
 */

import PaymentService from '../services/payment.service.js';
import { writeAuditLog } from '../config/logger.js';

/**
 * @function runWhaleRefunds
 * @desc Executes the Whale Refund logic based on the final pool total.
 * @param {number} totalPiPool - Final aggregate Pi in the IPO wallet.
 * @param {Array} investors - Dataset of IPO pioneers.
 */
export const runWhaleRefunds = async (totalPiPool, investors) => {
    /**
     * REQUIREMENT [90]: Cap set at 10% of the final total liquidity.
     * This Addresses Philip's point: "Total overall IPO pi balance will continuously vary".
     */
    const WHALE_CAP_LIMIT = totalPiPool * 0.10; 

    console.log(`--- [AUDIT] Initiating Post-IPO Anti-Whale Refund Sequence ---`);
    writeAuditLog('INFO', `Anti-Whale sequence started. Pool: ${totalPiPool} Pi | Cap: ${WHALE_CAP_LIMIT} Pi`);

    let refundCount = 0;
    let totalRefundedPi = 0;

    for (let investor of investors) {
        // Data normalization for safe processing
        const contribution = investor.totalPiContributed || investor.amountPi || 0;

        if (contribution > WHALE_CAP_LIMIT) {
            const excessAmount = contribution - WHALE_CAP_LIMIT;
            
            console.warn(`[WHALE_DETECTED] Pioneer: ${investor.piAddress} | Excess: ${excessAmount.toFixed(4)} Pi`);
            
            try {
                /**
                 * EXECUTION (A2UaaS):
                 * Transferring excess funds back to the Pioneer's wallet.
                 * Fees are handled by PaymentService per Daniel's standards.
                 */
                await PaymentService.transferPi(investor.piAddress, excessAmount, 'WHALE_EXCESS_REFUND');
                
                refundCount++;
                totalRefundedPi += excessAmount;

                writeAuditLog('INFO', `Refund Successful: ${excessAmount} Pi returned to ${investor.piAddress}`);
                
                // Updates the investor's document to reflect the compliant balance
                investor.totalPiContributed = WHALE_CAP_LIMIT;
                investor.isWhale = false; // Post-refund, they are no longer above the 10% cap
                await investor.save();

            } catch (error) {
                // Daniel's Requirement: Critical logging for manual audit.
                writeAuditLog('CRITICAL', `Refund FAILED for ${investor.piAddress}: ${error.message}`);
                console.error(`[CRITICAL_AUDIT_FAILURE] Payment Pipeline Error:`, error.message);
            }
        }
    }

    writeAuditLog('INFO', `Anti-Whale Refund Completed. Total Refunded: ${totalRefundedPi} Pi across ${refundCount} accounts.`);
    console.log(`--- [SYSTEM] Process Finished. ${refundCount} Refunds issued. ---`);
    
    return { refundCount, totalRefundedPi };
};

export default { runWhaleRefunds };
