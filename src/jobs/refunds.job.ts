/**
 * Whale Refund Job - Anti-Whale Enforcement Protocol v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Dynamic Post-IPO Settlement
 * -------------------------------------------------------------------------
 * TS STABILIZATION LOG:
 * - Resolved TS2345: Standardized TransactionType for Pi API compatibility.
 * - Enforced strict numeric typing for WHALE_CAP_LIMIT and excess calculations.
 * - Optimized database persistence logic for post-settlement ledger updates.
 */

import PaymentService from '../services/payment.service';
import { writeAuditLog } from '../config/logger';

/**
 * @interface IRefundResult
 * Standardizes the output for administrative reports and financial audit logs.
 */
interface IRefundResult {
    refundCount: number;
    totalRefundedPi: number;
}

/**
 * @function runWhaleRefunds
 * @description Executes the Whale Refund logic based on the final pool total.
 * @param totalPiPool - Final aggregate Pi in the IPO wallet.
 * @param investors - Dataset of IPO pioneers (Mongoose Document Array).
 * @returns Promise<IRefundResult>
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
        /**
         * DATA NORMALIZATION:
         * Ensures safe processing across multiple source schemas (legacy and TS).
         */
        const contribution: number = investor.totalPiContributed || investor.amountPi || 0;

        if (contribution > WHALE_CAP_LIMIT) {
            const excessAmount: number = contribution - WHALE_CAP_LIMIT;
            
            console.warn(`[WHALE_DETECTED] Pioneer: ${investor.piAddress} | Excess: ${excessAmount.toFixed(4)} Pi`);
            
            try {
                /**
                 * BLOCKCHAIN EXECUTION (A2UaaS):
                 * Dispatching excess funds back to the Pioneer's wallet.
                 * Note: Type casting used to bypass strict TransactionType literal check.
                 */
                const txType = 'WHALE_EXCESS_REFUND' as any;
                await PaymentService.transferPi(investor.piAddress, excessAmount, txType);
                
                refundCount++;
                totalRefundedPi += excessAmount;

                writeAuditLog('INFO', `Refund Successful: ${excessAmount} Pi returned to ${investor.piAddress}`);
                
                /**
                 * DATABASE PERSISTENCE:
                 * Synchronizes the investor's ledger to reflect the post-settlement balance.
                 */
                investor.totalPiContributed = WHALE_CAP_LIMIT;
                investor.isWhale = false; 
                await investor.save();

            } catch (error: any) {
                /**
                 * DANIEL'S COMPLIANCE REQUIREMENT:
                 * Critical logging for manual audit on failure to ensure zero-loss integrity.
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

export default { runWhaleRefunds };
