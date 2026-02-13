/**
 * SettlementJob - Anti-Whale Refund & Precision Engine v1.6
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
import { writeAuditLog } from '../config/logger.js';

class SettlementJob {
    /**
     * @method executeWhaleTrimBack
     * @desc Executes the final trim-back process for all investors.
     * Ensures no single Pioneer exceeds 10% of the total IPO pool.
     * @param {Array} investors - List of all investor documents.
     * @param {number} totalPool - Total Pi accumulated in the 4-week cycle.
     */
    static async executeWhaleTrimBack(investors, totalPool) {
        console.log("--- [COMPLIANCE] Starting Final Whale Settlement & Refund Cycle ---");
        writeAuditLog('INFO', `Whale Settlement Initiated. Pool: ${totalPool} Pi`);

        // PHILIP'S 10% STRATEGIC CAP RULE:
        // No single entity should dominate the MapCap equity [Page 6, Sec 92].
        const whaleThreshold = totalPool * 0.10;
        let totalRefundedInSession = 0;
        let whalesImpacted = 0;

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
                     * 3. AUTOMATED PAYOUT EXECUTION (A2UaaS)
                     * Triggering the automated App-to-User payout pipeline.
                     * Fee logic is handled within the PayoutService as per Philip's specs.
                     */
                    await PayoutService.executeA2UPayout(investor.piAddress, preciseRefund);
                    
                    /**
                     * 4. LEDGER RECONCILIATION
                     * Truncate contribution to the max limit and flag the account for auditing.
                     */
                    investor.totalPiContributed = whaleThreshold;
                    investor.isWhale = true;
                    investor.lastSettlementDate = new Date();
                    
                    await investor.save();

                    totalRefundedInSession = MathHelper.toPiPrecision(totalRefundedInSession + preciseRefund);
                    whalesImpacted++;

                    writeAuditLog('INFO', `Settlement Success: ${preciseRefund} Pi refunded to ${investor.piAddress}. Capped at 10%.`);

                } catch (error) {
                    /**
                     * CRITICAL AUDIT LOGGING:
                     * Failures here block the 10-month vesting cycle. Manual review required.
                     */
                    writeAuditLog('CRITICAL', `SETTLEMENT_FAILURE for ${investor.piAddress}: ${error.message}`);
                    console.error(`[CRITICAL_SETTLEMENT_FAILURE]`, error.message);
                }
            }
        }

        

        const summaryLog = `Settlement Complete. Total Recovered: ${totalRefundedInSession} Pi | Whales Impacted: ${whalesImpacted}`;
        console.log(`--- [SUMMARY] ${summaryLog} ---`);
        writeAuditLog('INFO', summaryLog);

        return { 
            success: true, 
            totalRefunded: totalRefundedInSession,
            whalesImpacted: whalesImpacted
        };
    }
}

export default SettlementJob;
