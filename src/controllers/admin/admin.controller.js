/**
 * AdminController - Management & Settlement Operations v1.4.5
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Post-IPO Whale Enforcement
 * -------------------------------------------------------------------------
 * PURPOSE:
 * Provides administrative overrides for the MapCap IPO ecosystem.
 * Enforces the "10% Whale Cap" rule ONLY after the IPO period ends,
 * as per Philip's requirement for dynamic participation flexibility.
 * -------------------------------------------------------------------------
 */

import Investor from '../../models/investor.model.js';
import SettlementJob from '../../jobs/settlement.job.js';
import ResponseHelper from '../../utils/response.helper.js';

class AdminController {
    /**
     * @method triggerFinalSettlement
     * @desc Finalizes the IPO by calculating final total liquidity and triggering
     * automatic refunds for any pioneer exceeding the 10% stake ceiling.
     * @access Private (Admin Only)
     */
    static async triggerFinalSettlement(req, res) {
        try {
            // AUDIT LOG: Crucial for Daniel's compliance standards.
            console.log(`[ADMIN_ACTION] Manual Post-IPO Settlement triggered at ${new Date().toISOString()}`);

            /**
             * 1. DATA AGGREGATION: 
             * Calculates the FINAL total Pi pool. This addresses Philip's point: 
             * the 10% is based on the final 'Water-Level' after all moves are done.
             */
            const aggregation = await Investor.aggregate([
                { 
                    $group: { 
                        _id: null, 
                        total: { $sum: "$totalPiContributed" },
                        count: { $sum: 1 }
                    } 
                }
            ]);
            
            const totalPiPool = aggregation.length > 0 ? aggregation[0].total : 0;
            const investorCount = aggregation.length > 0 ? aggregation[0].count : 0;

            // 2. INTEGRITY CHECK: Prevent execution on an empty pool.
            if (totalPiPool === 0) {
                return ResponseHelper.error(res, "Settlement Aborted: No liquidity detected for audit.", 400);
            }

            /**
             * 3. EXECUTION: Anti-Whale Refund Engine.
             * This only runs now (Post-IPO) to allow maximum flexibility during the cycle.
             * Triggers A2UaaS transfers for excess Pi.
             */
            const investors = await Investor.find(); 
            const report = await SettlementJob.executeWhaleTrimBack(investors, totalPiPool);

            // 4. REPORTING: Structure preserved for Admin Dashboard (Frontend) compatibility.
            return ResponseHelper.success(res, "Post-IPO settlement and Whale trim-back protocol executed.", {
                executionTimestamp: new Date().toISOString(),
                metrics: {
                    totalPoolProcessed: totalPiPool,
                    investorsAudited: investorCount,
                    refundsIssued: report.totalRefunded,
                    whalesImpacted: report.whalesImpacted
                },
                status: "COMPLETED"
            });

        } catch (error) {
            /**
             * CRITICAL ERROR HANDLING:
             * Logs failures for Daniel's manual reconciliation if the A2U pipeline fails.
             */
            console.error("[CRITICAL_SETTLEMENT_FAILURE]:", error.message);
            return ResponseHelper.error(res, `Settlement engine failure: ${error.message}`, 500);
        }
    }

    /**
     * @method getAuditLogs
     * @desc Interface for Daniel's audit review. 
     */
    static async getAuditLogs(req, res) {
        return ResponseHelper.success(res, "Audit logs retrieved.", { logs: [] });
    }
}

export default AdminController;
