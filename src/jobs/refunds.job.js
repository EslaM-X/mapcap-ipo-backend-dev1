/**
 * Whale Refund Job - Anti-Whale Enforcement Protocol v1.5
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Enforces the 10% investment cap as per the "Anti-Whale Processes" 
 * defined in the MapCapIPO Use Case [Page 5, Section 6].
 * ---------------------------------------------------------
 */

import PaymentService from '../services/payment.service.js';
import { writeAuditLog } from '../config/logger.js';

/**
 * @function runWhaleRefunds
 * @desc Executes the Whale Refund logic at the end of the IPO phase.
 * @param {number} totalPiPool - The aggregate Pi collected from all pioneers.
 * @param {Array} investors - Dataset of IPO pioneers (Address, Contribution).
 */
export const runWhaleRefunds = async (totalPiPool, investors) => {
    /**
     * REQUIREMENT [90]: Cap set at 10% of the total liquidity.
     * This is the "Ceiling" that maintains ecosystem health.
     */
    const WHALE_CAP_LIMIT = totalPiPool * 0.10; 

    console.log(`--- [AUDIT] Initiating Anti-Whale Refund Sequence ---`);
    writeAuditLog('INFO', `Anti-Whale sequence started. Pool: ${totalPiPool} Pi | Cap: ${WHALE_CAP_LIMIT} Pi`);

    let refundCount = 0;
    let totalRefundedPi = 0;

    for (let investor of investors) {
        // Normalizing data fields from the Investor model
        const contribution = investor.totalPiContributed || investor.amountPi || 0;

        if (contribution > WHALE_CAP_LIMIT) {
            const excessAmount = contribution - WHALE_CAP_LIMIT;
            
            console.warn(`[WHALE_DETECTED] Pioneer: ${investor.piAddress} | Excess: ${excessAmount.toFixed(4)} Pi`);
            
            try {
                /**
                 * EXECUTION:
                 * Triggering the A2UaaS (App-to-User) transfer protocol.
                 * SPEC COMPLIANCE: Fees are handled within PaymentService.
                 */
                await PaymentService.transferPi(investor.piAddress, excessAmount);
                
                refundCount++;
                totalRefundedPi += excessAmount;

                writeAuditLog('INFO', `Refund Successful: ${excessAmount} Pi returned to ${investor.piAddress}`);
                
                // Future Hook: Update the investor's document in DB to reflect the new balance
                investor.totalPiContributed = WHALE_CAP_LIMIT;
                investor.isWhale = true; // Flag for Daniel's final audit report
                await investor.save();

            } catch (error) {
                /**
                 * DANIEL'S AUDIT REQUIREMENT:
                 * Failed refunds are logged as CRITICAL for manual admin intervention.
                 */
                writeAuditLog('CRITICAL', `Refund FAILED for ${investor.piAddress}: ${error.message}`);
                console.error(`[CRITICAL_AUDIT_FAILURE] Payment Pipeline Error:`, error.message);
            }
        }
    }

    

    writeAuditLog('INFO', `Anti-Whale Refund Completed. Total Refunded: ${totalRefundedPi} Pi across ${refundCount} accounts.`);
    console.log(`--- [SYSTEM] Process Finished. ${refundCount} Refunds issued. ---`);
    
    return { refundCount, totalRefundedPi };
};
