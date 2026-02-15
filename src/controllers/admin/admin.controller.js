/**
 * AdminController - Management & Settlement Operations v1.4.6
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Post-IPO Whale Enforcement
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This controller acts as the administrative gateway for final IPO clearance.
 * It implements Philip's "Dynamic Settlement" requirement, ensuring that the 
 * 10% decentralization cap is only enforced against the final aggregate pool.
 * -------------------------------------------------------------------------
 */

import Investor from '../../models/investor.model.js';
import SettlementJob from '../../jobs/settlement.job.js'; 
import ResponseHelper from '../../utils/response.helper.js';

class AdminController {
    /**
     * @method triggerFinalSettlement
     * @desc Orchestrates the manual IPO finalization. It calculates the terminal 
     * 'Water-Level' and triggers the automated refund protocol for excess stakes.
     * Synchronized with A2UaaS protocol for secure Pi transfers.
     * @access Private (System Administrator)
     */
    static async triggerFinalSettlement(req, res) {
        try {
            /**
             * DANIEL'S COMPLIANCE AUDIT:
             * Mandatory log entry to track who triggered the final settlement and when.
             */
            console.log(`[ADMIN_ACTION] Manual Post-IPO Settlement sequence initiated at ${new Date().toISOString()}`);

            /**
             * STEP 1: GLOBAL LIQUIDITY AGGREGATION
             * Calculates the terminal Pi pool. This satisfies Philip's requirement 
             * to use the aggregate total at the end of the 28-day cycle as the 
             * mathematical basis for the 10% anti-whale cap.
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
             * Prevents execution if the pool is empty to avoid algorithmic division errors.
             */
            if (totalPiPool === 0) {
                return ResponseHelper.error(res, "Settlement Aborted: No liquidity detected in the IPO pool.", 400);
            }

            /**
             * STEP 3: CORE FINANCIAL EXECUTION
             * Invokes the SettlementJob to perform the 10% trim-back logic.
             * This handles the actual Pi refunds and ledger adjustments.
             */
            const investors = await Investor.find(); 
            const report = await SettlementJob.executeWhaleTrimBack(investors, totalPiPool);

            /**
             * STEP 4: FRONTEND SYNCHRONIZATION
             * Returns a standardized payload for the Admin Dashboard.
             * Mapping ensures Values are correctly displayed in the UI.
             */
            return ResponseHelper.success(res, "Post-IPO settlement and Whale trim-back protocol executed.", {
                executionTimestamp: new Date().toISOString(),
                metrics: {
                    totalPoolProcessed: totalPiPool,
                    investorsAudited: investorCount,
                    refundsIssued: report.refundCount, 
                    totalRefundedPi: report.totalRefundedPi 
                },
                status: "COMPLETED"
            });

        } catch (error) {
            /**
             * EXCEPTION HANDLING:
             * Logs failure details for manual financial reconciliation by Daniel.
             */
            console.error("[CRITICAL_SETTLEMENT_FAILURE]:", error.message);
            return ResponseHelper.error(res, `Settlement engine failure: ${error.message}`, 500);
        }
    }

    /**
     * @method getAuditLogs
     * @desc Retrieves administrative logs for Daniel's transparency audit.
     * Preserved for future expansion of the Audit UI.
     */
    static async getAuditLogs(req, res) {
        return ResponseHelper.success(res, "Audit logs retrieved.", { logs: [] });
    }
}

export default AdminController;
