/**
 * AdminController - Management & Settlement Operations v1.4.7
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Post-IPO Whale Enforcement
 * -------------------------------------------------------------------------
 * FIXED: Synchronized with SettlementJob v1.6.7 and Jest Test expectations.
 */

import Investor from '../../models/investor.model.js';
import SettlementJob from '../../jobs/settlement.job.js'; 
import ResponseHelper from '../../utils/response.helper.js';

class AdminController {
    /**
     * @method triggerFinalSettlement
     * @desc Orchestrates the manual IPO finalization based on final 'Water-Level'.
     */
    static async triggerFinalSettlement(req, res) {
        try {
            console.log(`[ADMIN_ACTION] Manual Post-IPO Settlement sequence initiated at ${new Date().toISOString()}`);

            /**
             * STEP 1: GLOBAL LIQUIDITY AGGREGATION
             * Basis for the 10% anti-whale cap calculation.
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

            /**
             * STEP 2: INTEGRITY GATEKEEPER
             */
            if (totalPiPool === 0) {
                return ResponseHelper.error(res, "Settlement Aborted: No liquidity detected in the IPO pool.", 400);
            }

            /**
             * STEP 3: CORE FINANCIAL EXECUTION
             * Updated to pass only totalPiPool as per the optimized SettlementJob.
             */
            const report = await SettlementJob.executeWhaleTrimBack(totalPiPool);

            if (!report.success) {
                throw new Error(report.error || "Unknown settlement error");
            }

            /**
             * STEP 4: FRONTEND & TEST SYNCHRONIZATION
             * Mapping ensures keys match both the Dashboard and the Integration Tests.
             */
            return ResponseHelper.success(res, "Post-IPO settlement and Whale trim-back protocol executed.", {
                executionTimestamp: new Date().toISOString(),
                metrics: {
                    totalPoolProcessed: totalPiPool,
                    investorsAudited: investorCount,
                    refundsIssued: report.whalesImpacted, // Consistent with Test expectations
                    totalRefundedPi: report.totalRefunded    // Consistent with Test expectations
                },
                status: "COMPLETED"
            });

        } catch (error) {
            console.error("[CRITICAL_SETTLEMENT_FAILURE]:", error.message);
            return ResponseHelper.error(res, `Settlement engine failure: ${error.message}`, 500);
        }
    }

    /**
     * @method getAuditLogs
     */
    static async getAuditLogs(req, res) {
        // Future-proofing for Daniel's Audit UI
        return ResponseHelper.success(res, "Audit logs retrieved.", { logs: [] });
    }
}

export default AdminController;
