/**
 * SettlementJob - Anti-Whale Refund & Precision Engine v1.5
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Strictly enforces the "10% Strategic Cap" rule. Integrates 
 * MathHelper for precision and PayoutService for the final 
 * App-to-User (A2U) payout execution.
 * ---------------------------------------------------------
 */

import MathHelper from '../utils/math.helper.js';
import PayoutService from '../services/payout.service.js';

class SettlementJob {
    /**
     * Executes the final trim-back process for all investors.
     * Ensures no single Pioneer exceeds 10% of the total IPO pool.
     * * @param {Array} investors - List of all investor documents.
     * @param {number} totalPool - Total Pi accumulated in the 4-week cycle.
     */
    static async executeWhaleTrimBack(investors, totalPool) {
        console.log("--- [COMPLIANCE] Starting Final Whale Settlement & Refund Cycle ---");

        // PHILIP'S 10% STRATEGIC CAP RULE:
        // No single entity should dominate the MapCap equity.
        const whaleThreshold = totalPool * 0.10;
        let totalRefundedInSession = 0;

        for (let investor of investors) {
            // Check if investor exceeds the 10% pool limit
            if (investor.totalPiContributed > whaleThreshold) {
                
                // 1. Calculate the exact excess amount to be returned
                const excessAmount = investor.totalPiContributed - whaleThreshold;
                
                // 2. Apply MathHelper to prevent floating-point errors (Daniel's Value Protection)
                const preciseRefund = MathHelper.toPiPrecision(excessAmount);

                console.warn(`[WHALE_DETECTED] Wallet: ${investor.piAddress} | Excess: ${preciseRefund} Pi`);

                try {
                    /**
                     * 3. AUTOMATED PAYOUT EXECUTION
                     * Triggering the A2U (App-to-User) payout via the Pi SDK wrapper.
                     */
                    await PayoutService.executeA2UPayout(investor.piAddress, preciseRefund);
                    
                    /**
                     * 4. LEDGER RECONCILIATION
                     * Truncate contribution to the max limit and flag the account.
                     */
                    investor.totalPiContributed = whaleThreshold;
                    investor.isWhale = true;
                    await investor.save();

                    totalRefundedInSession += preciseRefund;
                    console.log(`[SETTLEMENT_SUCCESS] Refunded ${preciseRefund} Pi. Account capped at 10%.`);

                } catch (error) {
                    /**
                     * CRITICAL AUDIT LOGGING:
                     * Failures here must be reported to the dashboard's admin panel.
                     */
                    console.error(`[CRITICAL_SETTLEMENT_FAILURE] Failed to refund ${investor.piAddress}:`, error.message);
                }
            }
        }

        console.log(`--- [SUMMARY] Settlement Complete. Total Recovered: ${totalRefundedInSession} Pi ---`);
        return { success: true, totalRefunded: totalRefundedInSession };
    }
}

export default SettlementJob;
