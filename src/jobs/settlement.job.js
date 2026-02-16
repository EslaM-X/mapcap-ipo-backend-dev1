/**
 * FINANCIAL SETTLEMENT & ANTI-WHALE ENFORCEMENT ENGINE
 * -------------------------------------------------------------------------
 * LEAD ARCHITECT: EslaM-X | AppDev @Map-of-Pi
 * VERSION: 1.6.7 (Stable - Post-IPO Compliance)
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This engine enforces the "10% Ceiling Rule" mandated for system liquidity 
 * stability. It identifies 'Whale' accounts, calculates surplus Pi, and 
 * executes high-precision refunds via the A2U (App-to-User) protocol.
 * -------------------------------------------------------------------------
 * INTEGRITY NOTE: 
 * Ensures zero-breakage for Frontend integration by maintaining 
 * standardized return keys: { success, totalRefunded, whalesImpacted }.
 */

import Investor from '../models/investor.model.js';
import PayoutService from '../services/payout.service.js';
import { writeAuditLog } from '../config/logger.js';
import MathHelper from '../utils/math.helper.js';

class SettlementJob {
    /**
     * EXECUTE WHALE TRIM-BACK
     * @param {Number} totalPoolAmount - The total aggregated Pi in the IPO pool.
     * Logic: Trims individual holdings to 10% of the total pool and refunds excess.
     */
    static async executeWhaleTrimBack(totalPoolAmount) {
        console.log('--- [COMPLIANCE] Initiating Post-IPO Final Settlement Sequence ---');
        
        // Data Sanitization: Ensure totalPoolAmount is a valid number to prevent NaN propagation
        const sanitizedPool = Number(totalPoolAmount) || 0;
        writeAuditLog('INFO', `Whale Settlement Triggered. Final Water-Level: ${sanitizedPool} Pi`);

        // Mandatory 10% Ceiling: No single entity can own more than 10% of the circulating IPO supply
        const threshold = sanitizedPool * 0.10; 
        let totalRefunded = 0;
        let whalesImpacted = 0;

        try {
            // 1. Identification: Fetch investors who exceeded the calculated ceiling
            const whales = await Investor.find({ totalPiContributed: { $gt: threshold } });

            for (const investor of whales) {
                // Calculation: Determine surplus amount with high decimal precision
                const currentContribution = Number(investor.totalPiContributed) || 0;
                const excessAmount = currentContribution - threshold;
                const preciseRefund = MathHelper.toPiPrecision(excessAmount);

                if (preciseRefund <= 0) continue;

                console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);

                try {
                    /**
                     * 2. Execution: Refund surplus Pi back to the Pioneer's wallet.
                     * 'WHALE_EXCESS_REFUND' metadata is critical for Daniel's financial audit.
                     */
                    await PayoutService.executeA2UPayout(investor.piAddress, preciseRefund, 'WHALE_EXCESS_REFUND');

                    // 3. Ledger Update: Cap the investment at threshold and flag for UI badges
                    investor.totalPiContributed = threshold;
                    investor.isWhale = true; // Maintains badge visibility on Frontend
                    investor.lastSettlementDate = new Date();
                    await investor.save();

                    totalRefunded = MathHelper.toPiPrecision(totalRefunded + preciseRefund);
                    whalesImpacted++;

                    writeAuditLog('INFO', `Settlement Success: ${preciseRefund} Pi returned to ${investor.piAddress}. Threshold maintained.`);
                } catch (payoutError) {
                    writeAuditLog('CRITICAL', `PAYOUT_FAILED for ${investor.piAddress}: ${payoutError.message}`);
                    console.error(`[CRITICAL_FAILURE] Settlement execution error for ${investor.piAddress}`);
                }
            }

            console.log(`--- [SUMMARY] Settlement Finalized. Total Refunded: ${totalRefunded} | Accounts Capped: ${whalesImpacted} ---`);
            writeAuditLog('INFO', `Settlement Finalized. Total Refunded: ${totalRefunded} | Accounts Capped: ${whalesImpacted}`);

            /**
             * COMPATIBILITY LAYER:
             * Returning standardized keys to prevent breaking Admin Controller or Frontend Dashboards.
             */
            return {
                success: true,
                totalRefunded: Number(totalRefunded),
                whalesImpacted: Number(whalesImpacted)
            };

        } catch (error) {
            writeAuditLog('CRITICAL', `SETTLEMENT_ERROR: ${error.message}`);
            return { 
                success: false, 
                error: error.message,
                totalRefunded: 0,
                whalesImpacted: 0
            };
        }
    }
}

export default SettlementJob;
