/**
 * Whale Refund Job - Anti-Whale Enforcement Protocol v1.7.5 (TS)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Dynamic Post-IPO Settlement
 * ---------------------------------------------------------
 * TS CONVERSION LOG:
 * - Defined IRefundResult interface for consistent report generation.
 * - Enforced strict numeric typing for WHALE_CAP_LIMIT and excess calculations.
 * - Maintained the dynamic logic where the cap is 10% of the *final* pool.
 */

import PaymentService from '../services/payment.service.js';
import { writeAuditLog } from '../config/logger.js';

/**
 * @interface IRefundResult
 * Standardizes the output for administrative reports and audit logs.
 */
interface IRefundResult {
    refundCount: number;
    totalRefundedPi: number;
}

/**
 * @function runWhaleRefunds
 * @desc Executes the Whale Refund logic based on the final pool total.
 * @param totalPiPool - Final aggregate Pi in the IPO wallet.
 * @param investors - Dataset of IPO pioneers (Mongoose Document Array).
 */
export const runWhaleRefunds = async (totalPiPool: number, investors: any[]): Promise<IRefundResult> => {
    /**
     * REQUIREMENT [90]: Cap set at 10% of the final total liquidity.
     * This ensures the 10% ceiling is calculated against the stabilized pool.
     */
    const WHALE_CAP_LIMIT: number = totalPiPool * 0.10; 

    console.log(`--- [AUDIT] Initiating Post-IPO Anti-Whale Refund Sequence ---`);
    writeAuditLog('INFO', `Anti-Whale sequence started. Pool: ${totalPiPool} Pi | Cap: ${WHALE_CAP_LIMIT} Pi`);

    let refundCount: number = 0;
    let totalRefundedPi: number = 0;

    for (let investor of investors) {
        // Data normalization for safe processing (handles multiple source schemas)
        const contribution: number = investor.totalPiContributed || investor.amountPi || 0;

        if (contribution > WHALE_CAP_LIMIT) {
            const excessAmount: number = contribution - WHALE_CAP_LIMIT;
            
            console.warn(`[WHALE_DETECTED] Pioneer: ${investor.piAddress} | Excess: ${excessAmount.toFixed(4)} Pi`);
            
            try {
                /**
                 * EXECUTION (A2UaaS):
                 * Transferring excess funds back to the Pioneer's wallet via the Pi API.
                 */
                await PaymentService.transferPi(investor.piAddress, excessAmount, 'WHALE_EXCESS_REFUND');
                
                refundCount++;
                totalRefundedPi += excessAmount;

                writeAuditLog('INFO', `Refund Successful: ${excessAmount} Pi returned to ${investor.piAddress}`);
                
                /**
                 * DATABASE UPDATE:
                 * Adjusts the investor's ledger to reflect the post-settlement balance.
                 */
                investor.totalPiContributed = WHALE_CAP_LIMIT;
                investor.isWhale = false; 
                await investor.save();

            } catch (error: any) {
                // Daniel's Requirement: Critical logging for manual audit on failure.
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
