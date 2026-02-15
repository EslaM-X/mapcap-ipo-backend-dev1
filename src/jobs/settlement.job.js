/**
 * SettlementJob - Final Post-IPO Whale-Shield & Reconciliation v1.6.6
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Post-IPO Capping Logic
 * ---------------------------------------------------------
 * ARCHITECTURAL ROLE: 
 * Acts as the orchestration layer for the final 10% decentralization audit.
 * This job ensures the "Water-Level" logic is applied only after the IPO 
 * concludes, allowing for maximum flexibility during active participation.
 * ---------------------------------------------------------
 */

import MathHelper from '../utils/math.helper.js';
import PayoutService from '../services/payout.service.js';
import { writeAuditLog } from '../config/logger.js';

class SettlementJob {
    /**
     * @method executeWhaleTrimBack
     * @desc Triggers the final audit and refund sequence for all Pioneers.
     * Enforces the 10% ceiling based on the FINAL aggregate pool liquidity.
     * @param {Array} investors - Dataset of IPO participants from MongoDB.
     * @param {number} totalPool - The finalized total Pi amount upon IPO closure.
     * @returns {Object} Settlement metrics for the Admin Dashboard.
     */
    static async executeWhaleTrimBack(investors, totalPool) {
        // Log initiation for Daniel's compliance and audit trails
        console.log("--- [COMPLIANCE] Initiating Post-IPO Final Settlement Sequence ---");
        writeAuditLog('INFO', `Whale Settlement Triggered. Final Water-Level: ${totalPool} Pi`);

        /**
         * PHILIP'S STRATEGIC CEILING (10%):
         * Calculated against the terminal pool value to account for all 
         * dynamic fluctuations that occurred during the 4-week IPO period.
         */
        const whaleThreshold = totalPool * 0.10;
        let refundCount = 0;
        let totalRefundedPi = 0;

        for (let investor of investors) {
            // Evaluate individual stake against the final 10% ceiling
            const contribution = investor.totalPiContributed || 0;

            if (contribution > whaleThreshold) {
                
                // 1. SURPLUS CALCULATION: Identify the excess amount to be trimmed
                const excessAmount = contribution - whaleThreshold;
                
                // 2. PRECISION PROTECTION: Utilize MathHelper to prevent decimal drift
                const preciseRefund = MathHelper.toPiPrecision(excessAmount);

                console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);

                try {
                    /**
                     * 3. AUTOMATED A2U REFUND PIPELINE
                     * Returns the surplus Pi to the Pioneer via the PayoutService (A2UaaS).
                     * Compliance: Transaction fees are handled within the service layer.
                     */
                    await PayoutService.executeA2UPayout(investor.piAddress, preciseRefund, 'WHALE_EXCESS_REFUND');
                    
                    /**
                     * 4. LEDGER SYNCHRONIZATION
                     * Updates the investor record to reflect the compliant 10% balance.
                     * We set isWhale: false post-refund to indicate compliance status.
                     */
                    investor.totalPiContributed = whaleThreshold;
                    investor.isWhale = false; 
                    investor.lastSettlementDate = new Date();
                    
                    await investor.save();

                    totalRefundedPi = MathHelper.toPiPrecision(totalRefundedPi + preciseRefund);
                    refundCount++;

                    writeAuditLog('INFO', `Settlement Success: ${preciseRefund} Pi returned to ${investor.piAddress}. Threshold maintained.`);

                } catch (error) {
                    /**
                     * DANIEL'S AUDIT PROTOCOL:
                     * Critical failures are logged for manual reconciliation.
                     */
                    writeAuditLog('CRITICAL', `SETTLEMENT_ERROR for ${investor.piAddress}: ${error.message}`);
                    console.error(`[CRITICAL_FAILURE] Settlement failed for ${investor.piAddress}`);
                }
            }
        }

        const summaryLog = `Settlement Finalized. Total Refunded: ${totalRefundedPi} | Accounts Capped: ${refundCount}`;
        console.log(`--- [SUMMARY] ${summaryLog} ---`);
        writeAuditLog('INFO', summaryLog);

        /**
         * DATA MAPPING FOR FRONTEND:
         * These keys match the AdminController metrics to ensure Dashboard stability.
         */
        return { 
            refundCount: refundCount,
            totalRefundedPi: totalRefundedPi,
            whalesImpacted: refundCount // Alias for UI compatibility
        };
    }
}

export default SettlementJob;
