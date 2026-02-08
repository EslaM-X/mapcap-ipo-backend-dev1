/**
 * SettlementJob - Anti-Whale Refund & Precision Engine
 * ---------------------------------------------------------
 * This job strictly enforces Philip's "10% Cap" rule.
 * It integrates MathHelper for absolute decimal precision and 
 * PayoutService for the final A2UaaS execution.
 * * Daniel's Transparency Note: All actions are logged for the audit trail.
 */

const MathHelper = require('../utils/math.helper');
const PayoutService = require('../services/payout.service');

class SettlementJob {
    /**
     * Executes the final trim-back process for all investors.
     * Ensures no single Pioneer exceeds 10% of the total IPO pool.
     * * @param {Array} investors - List of all investor documents.
     * @param {number} totalPool - Total Pi accumulated in the 4-week cycle.
     */
    static async executeWhaleTrimBack(investors, totalPool) {
        console.log("--- [SYSTEM] Starting Final Whale Settlement & Refund Cycle ---");

        // Philip's 10% Strategic Cap Rule
        const whaleThreshold = totalPool * 0.10;
        let totalRefundedInSession = 0;

        for (let investor of investors) {
            if (investor.totalPiContributed > whaleThreshold) {
                // 1. Calculate the exact excess amount
                const excessAmount = investor.totalPiContributed - whaleThreshold;
                
                // 2. Apply MathHelper to prevent floating-point errors (Value Protection)
                const preciseRefund = MathHelper.toPiPrecision(excessAmount);

                console.log(`[WHALE ALERT] Wallet: ${investor.piAddress} | Excess: ${preciseRefund} Pi`);

                try {
                    // 3. Execute the automated A2UaaS Payout via Escrow-Pi Protocol
                    await PayoutService.executeA2UPayout(investor.piAddress, preciseRefund);
                    
                    // 4. Update Database: Set to max allowed limit and flag as Whale
                    investor.totalPiContributed = whaleThreshold;
                    investor.isWhale = true;
                    await investor.save();

                    totalRefundedInSession += preciseRefund;
                    console.log(`[SUCCESS] Refunded ${preciseRefund} Pi. Investor capped at 10%.`);

                } catch (error) {
                    // Critical logging for Daniel's audit.log
                    console.error(`[CRITICAL ERROR] Failed to refund Whale ${investor.piAddress}:`, error.message);
                }
            }
        }

        console.log(`--- [SUMMARY] Settlement Complete. Total Refunded: ${totalRefundedInSession} Pi ---`);
        return { success: true, totalRefunded: totalRefundedInSession };
    }
}

module.exports = SettlementJob;
