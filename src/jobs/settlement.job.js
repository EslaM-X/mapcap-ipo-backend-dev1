/**
 * SettlementJob - Final Post-IPO Whale-Shield & Reconciliation v1.6.5
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Post-IPO Capping Logic
 * ---------------------------------------------------------
 * PURPOSE: 
 * Executes the 10% Decentralization Ceiling only after the IPO ends.
 * This aligns with Philip's requirement to allow flexibility during 
 * active participation while ensuring strict compliance before LP transfer.
 */

import MathHelper from '../utils/math.helper.js';
import PayoutService from '../services/payout.service.js';
import { writeAuditLog } from '../config/logger.js';

class SettlementJob {
    /**
     * @method executeWhaleTrimBack
     * @desc Triggers the final audit and refund process for all participants.
     * Enforces the 10% cap based on the FINAL total pool value.
     * @param {Array} investors - Collection of investor documents from MongoDB.
     * @param {number} totalPool - The finalized total Pi amount after IPO closure.
     */
    static async executeWhaleTrimBack(investors, totalPool) {
        // Log initiation for transparency and audit trails
        console.log("--- [COMPLIANCE] Initiating Post-IPO Final Settlement & Whale-Capping ---");
        writeAuditLog('INFO', `Whale Settlement Triggered. Final Pool: ${totalPool} Pi`);

        /**
         * PHILIP'S STRATEGIC CEILING (10%):
         * Calculated based on the finalized pool to handle dynamic fluctuations 
         * that occurred during the 4-week IPO period.
         */
        const whaleThreshold = totalPool * 0.10;
        let totalRefundedInSession = 0;
        let whalesImpacted = 0;

        for (let investor of investors) {
            // Evaluates each investor against the final 10% threshold
            if (investor.totalPiContributed > whaleThreshold) {
                
                // 1. Calculate the exact surplus beyond the 10% ceiling
                const excessAmount = investor.totalPiContributed - whaleThreshold;
                
                // 2. Prevent precision loss using MathHelper (Daniel's Value Protection Standard)
                const preciseRefund = MathHelper.toPiPrecision(excessAmount);

                console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus to Refund: ${preciseRefund} Pi`);

                try {
                    /**
                     * 3. AUTOMATED A2U REFUND PIPELINE
                     * Returns the surplus Pi back to the Pioneer's original wallet.
                     * This ensures the investor only holds exactly 10% of the final equity.
                     */
                    await PayoutService.executeA2UPayout(investor.piAddress, preciseRefund);
                    
                    /**
                     * 4. LEDGER FINALIZATION
                     * Caps the contribution at the threshold and marks the 'isWhale' flag
                     * for final transparent reporting in the Frontend Dashboard.
                     */
                    investor.totalPiContributed = whaleThreshold;
                    investor.isWhale = true;
                    investor.lastSettlementDate = new Date();
                    
                    await investor.save();

                    totalRefundedInSession = MathHelper.toPiPrecision(totalRefundedInSession + preciseRefund);
                    whalesImpacted++;

                    writeAuditLog('INFO', `Settlement Success: ${preciseRefund} Pi returned to ${investor.piAddress}. Threshold maintained.`);

                } catch (error) {
                    /**
                     * CRITICAL EXCEPTION HANDLING:
                     * Any failure here triggers an audit alert. The vesting cycle 
                     * will not proceed for this user until manual reconciliation.
                     */
                    writeAuditLog('CRITICAL', `SETTLEMENT_ERROR for ${investor.piAddress}: ${error.message}`);
                    console.error(`[CRITICAL_ERROR] Settlement failed for ${investor.piAddress}:`, error.message);
                }
            }
        }

        const summaryLog = `Final Settlement Complete. Total Pi Refunded: ${totalRefundedInSession} | Whales Capped: ${whalesImpacted}`;
        console.log(`--- [FINAL SUMMARY] ${summaryLog} ---`);
        writeAuditLog('INFO', summaryLog);

        return { 
            success: true, 
            totalRefunded: totalRefundedInSession,
            whalesImpacted: whalesImpacted
        };
    }
}

export default SettlementJob;
