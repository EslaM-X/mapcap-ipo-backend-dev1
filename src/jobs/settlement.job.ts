/**
 * FINANCIAL SETTLEMENT & ANTI-WHALE ENFORCEMENT ENGINE v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * LEAD ARCHITECT: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Post-IPO Compliance
 * -------------------------------------------------------------------------
 * TS STABILIZATION LOG:
 * - Resolved TS2554: Aligned PayoutService.executeA2UPayout with 2-arg signature.
 * - Resolved TS2835: Appended mandatory .js extensions for NodeNext ESM compliance.
 * - Resolved TS2322: Enforced strict ISettlementResult return type for Audit parity.
 * - Integrity Guard: Preserved financial keys to ensure Zero-Breakage for 
 * AdminDashboard.jsx telemetry and compliance reporting.
 */

import Investor from '../models/investor.model.js';
import PayoutService from '../services/payout.service.js';
import { writeAuditLog } from '../config/logger.js';
import MathHelper from '../utils/math.helper.js';

/**
 * @interface ISettlementResult
 * Contract for administrative report consistency and frontend telemetry.
 * Ensures the Backend and Frontend agree on the structure of financial results.
 */
interface ISettlementResult {
    success: boolean;
    totalRefunded: number;
    whalesImpacted: number;
    error?: string;
}

class SettlementJob {
    /**
     * @method executeWhaleTrimBack
     * @param totalPoolAmount - The total aggregated Pi in the IPO pool.
     * @description Trims individual holdings to 10% of the total pool and refunds excess.
     * Logic aligned with Philip's Dynamic Liquidity Spec Page 4.
     * @returns Promise<ISettlementResult>
     */
    static async executeWhaleTrimBack(totalPoolAmount: number): Promise<ISettlementResult> {
        console.log('--- [COMPLIANCE] Initiating Post-IPO Final Settlement Sequence ---');
        
        // Data Sanitization: Prevent NaN propagation in the ledger during calculation
        const sanitizedPool: number = Number(totalPoolAmount) || 0;
        writeAuditLog('INFO', `Whale Settlement Triggered. Final Water-Level: ${sanitizedPool} Pi`);

        // Mandatory 10% Ceiling Rule: Ensures ecosystem decentralization.
        const threshold: number = sanitizedPool * 0.10; 
        let totalRefunded: number = 0;
        let whalesImpacted: number = 0;

        try {
            /**
             * STEP 1: WHALE IDENTIFICATION
             * Fetching investors who exceeded the dynamic 10% ceiling threshold.
             */
            const whales = await Investor.find({ totalPiContributed: { $gt: threshold } });

            for (const investor of whales) {
                const currentContribution: number = Number(investor.totalPiContributed) || 0;
                const excessAmount: number = currentContribution - threshold;
                const preciseRefund: number = MathHelper.toPiPrecision(excessAmount);

                if (preciseRefund <= 0) continue;

                console.warn(`[WHALE_CAP_TRIGGERED] Wallet: ${investor.piAddress} | Surplus: ${preciseRefund} Pi`);

                try {
                    /**
                     * STEP 2: BLOCKCHAIN EXECUTION
                     * FIXED TS2554: Aligned with PayoutService signature (2 arguments expected).
                     * Refunding surplus Pi via A2U Protocol to the Pioneer's wallet.
                     */
                    await PayoutService.executeA2UPayout(investor.piAddress, preciseRefund);

                    /**
                     * STEP 3: ATOMIC LEDGER UPDATE
                     * Normalizing the investor's stake to the maximum allowed threshold.
                     */
                    investor.totalPiContributed = threshold;
                    investor.isWhale = true; 
                    investor.lastSettlementDate = new Date();
                    await investor.save();

                    totalRefunded = MathHelper.toPiPrecision(totalRefunded + preciseRefund);
                    whalesImpacted++;

                    writeAuditLog('INFO', `Settlement Success: ${preciseRefund} Pi returned to ${investor.piAddress}.`);
                } catch (payoutError: any) {
                    /**
                     * EXCEPTION HANDLING:
                     * Ensures one failed payout doesn't stall the entire settlement engine.
                     */
                    writeAuditLog('CRITICAL', `PAYOUT_FAILED for ${investor.piAddress}: ${payoutError.message}`);
                    console.error(`[CRITICAL_FAILURE] Settlement execution error for ${investor.piAddress}`);
                }
            }

            console.log(`--- [SUMMARY] Settlement Finalized. Total Refunded: ${totalRefunded} | Accounts Capped: ${whalesImpacted} ---`);
            writeAuditLog('INFO', `Settlement Finalized. Total Refunded: ${totalRefunded} | Accounts Capped: ${whalesImpacted}`);

            /**
             * FINAL REPORT GENERATION:
             * Data structure preserved for AdminDashboard.jsx telemetry.
             * Keys maintained: success, totalRefunded, whalesImpacted.
             */
            return {
                success: true,
                totalRefunded: Number(totalRefunded),
                whalesImpacted: Number(whalesImpacted)
            };

        } catch (error: any) {
            /**
             * FATAL ENGINE FAILURE:
             * Logs systemic errors for immediate administrative intervention.
             */
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
