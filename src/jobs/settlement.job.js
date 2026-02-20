/**
 * FINANCIAL SETTLEMENT & ANTI-WHALE ENFORCEMENT ENGINE
 * -------------------------------------------------------------------------
 * LEAD ARCHITECT: EslaM-X | AppDev @Map-of-Pi
 * VERSION: 1.6.8 (Stable - Post-IPO Compliance)
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
     * @method executeWhaleTrimBack
     * @param {Number} totalPoolAmount - The total aggregated Pi in the IPO pool.
     * @desc Trims individual holdings to 10% of the total pool and refunds excess.
     */
    static async executeWhaleTrimBack(totalPoolAmount) {
        console.log('--- [COMPLIANCE] Initiating Post-IPO Final Settlement Sequence ---');
        
        // Data Sanitization: Prevent NaN propagation
        const sanitizedPool = Number(totalPoolAmount) || 0;
        writeAuditLog('INFO', `Whale Settlement Triggered. Final Water-Level: ${sanitizedPool} Pi`);

        // Mandatory 10% Ceiling Rule
        const threshold = sanitizedPool * 0.10; 
        let totalRefunded = 0;
        let whalesImpacted = 0;

        try {
            // 1. Identification: Fetch investors who exceeded the calculated ceiling
            // Using 'totalPiContributed' to match the AdminController's aggregation field
            const whales = await Investor.find({ totalPiContributed: { $gt: threshold } });

            for (const investor of whales) {
                const currentContribution = Number(investor.totalPiContributed) || 0;
                const excessAmount = currentContribution - threshold;
                const preciseRefund = MathHelper.toPiPrecision(excessAmount);

                if (preciseRefund <= 0) continue;

                console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);

                try {
                    /**
                     * 2. Execution: Refund surplus Pi via A2U Protocol.
                     * Metadata 'WHALE_EXCESS_REFUND' is required for financial forensic audits.
                     */
                    await PayoutService.executeA2UPayout(investor.piAddress, preciseRefund, 'WHALE_EXCESS_REFUND');

                    // 3. Ledger Update: Atomic update to maintain threshold
                    investor.totalPiContributed = threshold;
                    investor.isWhale = true; // Enables Frontend 'Whale' badge/status
                    investor.lastSettlementDate = new Date();
                    await investor.save();

                    totalRefunded = MathHelper.toPiPrecision(totalRefunded + preciseRefund);
                    whalesImpacted++;

                    writeAuditLog('INFO', `Settlement Success: ${preciseRefund} Pi returned to ${investor.piAddress}.`);
                } catch (payoutError) {
                    writeAuditLog('CRITICAL', `PAYOUT_FAILED for ${investor.piAddress}: ${payoutError.message}`);
                    console.error(`[CRITICAL_FAILURE] Settlement execution error for ${investor.piAddress}`);
                }
            }

            console.log(`--- [SUMMARY] Settlement Finalized. Total Refunded: ${totalRefunded} | Accounts Capped: ${whalesImpacted} ---`);
            writeAuditLog('INFO', `Settlement Finalized. Total Refunded: ${totalRefunded} | Accounts Capped: ${whalesImpacted}`);

            /**
             * COMPATIBILITY LAYER:
             * Strictly maintaining keys to ensure AdminController and Frontend stability.
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
