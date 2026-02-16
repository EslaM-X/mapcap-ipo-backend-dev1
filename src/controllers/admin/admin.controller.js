/**
 * AdminController - Management & Settlement Operations v1.4.8
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Post-IPO Whale Enforcement
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Orchestrates administrative-level financial operations, specifically the
 * final IPO settlement and anti-whale protocol enforcement.
 * -------------------------------------------------------------------------
 * UPDATES:
 * - Integration: Fully synchronized with SettlementJob v1.6.7 logic.
 * - Test Parity: Preserved 'refundsIssued' and 'totalRefundedPi' for Jest.
 * - Stability: Guaranteed 100% Frontend Dashboard key compatibility.
 */

import Investor from '../../models/investor.model.js';
import SettlementJob from '../../jobs/settlement.job.js'; 
import ResponseHelper from '../../utils/response.helper.js';

class AdminController {
    /**
     * @method triggerFinalSettlement
     * @desc Orchestrates the manual IPO finalization based on final 'Water-Level'.
     * Triggers the whale trim-back mechanism to enforce the 10% ceiling.
     * @access Private (Super Admin Only)
     */
    static async triggerFinalSettlement(req, res) {
        try {
            console.log(`[ADMIN_ACTION] Manual Post-IPO Settlement sequence initiated at ${new Date().toISOString()}`);

            /**
             * STEP 1: GLOBAL LIQUIDITY AGGREGATION
             * Provides the definitive 'Water-Level' baseline required for 
             * precise 10% anti-whale redistribution calculations.
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
             * Prevents execution if the pool is empty to avoid division-by-zero 
             * anomalies in the settlement engine.
             */
            if (totalPiPool === 0) {
                return ResponseHelper.error(res, "Settlement Aborted: No liquidity detected in the IPO pool.", 400);
            }

            /**
             * STEP 3: CORE FINANCIAL EXECUTION
             * Dispatches the total liquidity to the SettlementJob for atomic 
             * whale-cap enforcement and refund ledger generation.
             */
            const report = await SettlementJob.executeWhaleTrimBack(totalPiPool);

            if (!report.success) {
                throw new Error(report.error || "Internal Settlement Engine Disruption");
            }

            /**
             * STEP 4: FRONTEND & TEST SYNCHRONIZATION
             * Key mapping strictly maintained to support:
             * 1. AdminDashboard.jsx (UI Metrics)
             * 2. admin.ops.test.js (Integration Assertions)
             */
            return ResponseHelper.success(res, "Post-IPO settlement and Whale trim-back protocol executed.", {
                executionTimestamp: new Date().toISOString(),
                metrics: {
                    totalPoolProcessed: totalPiPool,
                    investorsAudited: investorCount,
                    refundsIssued: report.whalesImpacted, // CRITICAL: Matches Integration Test expectations
                    totalRefundedPi: report.totalRefunded    // CRITICAL: Matches Integration Test expectations
                },
                status: "COMPLETED"
            });

        } catch (error) {
            /**
             * CRITICAL FAILURE LOGGING:
             * Vital for Daniel's security audit and financial forensic review.
             */
            console.error("[CRITICAL_SETTLEMENT_FAILURE]:", error.message);
            return ResponseHelper.error(res, `Settlement engine failure: ${error.message}`, 500);
        }
    }

    /**
     * @method getAuditLogs
     * @desc Future-proofed endpoint for Daniel's compliance monitoring interface.
     */
    static async getAuditLogs(req, res) {
        // Placeholder for real-time audit log stream integration
        return ResponseHelper.success(res, "Administrative audit logs retrieved.", { logs: [] });
    }
}

export default AdminController;
