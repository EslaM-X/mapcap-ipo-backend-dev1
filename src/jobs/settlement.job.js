/**
 * Settlement & Whale-Shield Engine v1.6.7
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Compliance: Post-IPO Enforcement Only (Philip's Requirement)
 * -------------------------------------------------------------------------
 * FIXED: Return keys (totalRefunded) and argument mapping for Jest stability.
 */

import Investor from '../models/investor.model.js';
import PayoutService from '../services/payout.service.js';
import { writeAuditLog } from '../config/logger.js';
import MathHelper from '../utils/math.helper.js';

class SettlementJob {
    /**
     * EXECUTE WHALE TRIM-BACK
     * Logic: Trims individual holdings to 10% of the total pool and refunds excess via A2U.
     */
    static async executeWhaleTrimBack(totalPoolAmount) {
        console.log('--- [COMPLIANCE] Initiating Post-IPO Final Settlement Sequence ---');
        writeAuditLog('INFO', `Whale Settlement Triggered. Final Water-Level: ${totalPoolAmount} Pi`);

        const threshold = totalPoolAmount * 0.10; 
        let totalRefunded = 0;
        let whalesImpacted = 0;

        try {
            // 1. Fetch investors who exceeded the final 10% ceiling
            const whales = await Investor.find({ totalPiContributed: { $gt: threshold } });

            for (const investor of whales) {
                const excessAmount = investor.totalPiContributed - threshold;
                const preciseRefund = MathHelper.toPiPrecision(excessAmount);

                console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);

                try {
                    // 2. Execute actual Pi refund via PayoutService
                    await PayoutService.executeA2UPayout(investor.piAddress, preciseRefund, 'WHALE_EXCESS_REFUND');

                    // 3. Update Ledger: Maintain 'isWhale: true' for Frontend Badge visibility
                    investor.totalPiContributed = threshold;
                    investor.isWhale = true; 
                    investor.lastSettlementDate = new Date();
                    await investor.save();

                    totalRefunded = MathHelper.toPiPrecision(totalRefunded + preciseRefund);
                    whalesImpacted++;

                    writeAuditLog('INFO', `Settlement Success: ${preciseRefund} Pi returned to ${investor.piAddress}. Threshold maintained.`);
                } catch (payoutError) {
                    writeAuditLog('CRITICAL', `PAYOUT_FAILED for ${investor.piAddress}: ${payoutError.message}`);
                    console.error(`[CRITICAL_FAILURE] Settlement failed for ${investor.piAddress}`);
                }
            }

            console.log(`--- [SUMMARY] Settlement Finalized. Total Refunded: ${totalRefunded} | Accounts Capped: ${whalesImpacted} ---`);
            writeAuditLog('INFO', `Settlement Finalized. Total Refunded: ${totalRefunded} | Accounts Capped: ${whalesImpacted}`);

            // Return keys must match EXACTLY what the Tests and Admin Controller expect
            return {
                success: true,
                totalRefunded,
                whalesImpacted
            };

        } catch (error) {
            writeAuditLog('CRITICAL', `SETTLEMENT_ERROR: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
}

export default SettlementJob;
