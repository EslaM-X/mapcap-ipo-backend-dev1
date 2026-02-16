/**
 * AdminController - Management & Settlement Operations v1.5.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Post-IPO Whale Enforcement
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Orchestrates administrative-level financial operations, specifically the
 * final IPO settlement and anti-whale protocol enforcement.
 * -------------------------------------------------------------------------
 */

import Investor from '../../models/investor.model.js';
import SettlementJob from '../../jobs/settlement.job.js'; 
import ResponseHelper from '../../utils/response.helper.js';

class AdminController {
    /**
     * @method triggerFinalSettlement
     * @desc Orchestrates manual IPO finalization based on final 'Water-Level'.
     * Triggers the whale trim-back mechanism to enforce the 10% ceiling.
     * @access Private (Super Admin Only)
     */
    static async triggerFinalSettlement(req, res) {
        try {
            console.log(`[ADMIN_ACTION] Manual Post-IPO Settlement sequence initiated at ${new Date().toISOString()}`);

            /**
             * STEP 1: GLOBAL LIQUIDITY AGGREGATION (High-Performance)
             * Uses MongoDB Aggregation to handle large datasets without memory overflow.
             * Provides the definitive 'Water-Level' baseline for precise calculations.
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
             * Dispatches liquidity data to the SettlementJob for atomic enforcement.
             */
            const report = await SettlementJob.executeWhaleTrimBack(totalPiPool);

            if (!report || !report.success) {
                throw new Error(report?.error || "Internal Settlement Engine Disruption");
            }

            /**
             * STEP 4: FRONTEND & TEST SYNCHRONIZATION
             * STABLE MAPPING: Maintains 'metrics' and 'refundsIssued' keys to prevent 
             * breaking AdminDashboard.jsx and admin.ops.test.js.
             */
            return ResponseHelper.success(res, "Post-IPO settlement and Whale trim-back protocol executed.", {
                executionTimestamp: new Date().toISOString(),
                metrics: {
                    totalPoolProcessed: totalPiPool,
                    investorsAudited: investorCount,
                    // CRITICAL: Matches existing Integration Test expectations
                    refundsIssued: report.whalesImpacted || 0, 
                    totalRefundedPi: report.totalRefunded || 0    
                },
                status: "COMPLETED"
            });

        } catch (error) {
            /**
             * CRITICAL FAILURE LOGGING
             */
            console.error("[CRITICAL_SETTLEMENT_FAILURE]:", error.message);
            return ResponseHelper.error(res, `Settlement engine failure: ${error.message}`, 500);
        }
    }

    /**
     * @method getSystemStatus
     * @desc Returns system metrics for management review.
     * @access Private (Admin Only)
     */
    static async getSystemStatus(req, res) {
        try {
            const investorsCount = await Investor.countDocuments();
            
            return ResponseHelper.success(res, "System metrics retrieved successfully.", {
                status: "Operational",
                engine: "MapCap Audit Engine v1.5.0",
                metrics: {
                    active_investors: investorsCount,
                    deployment: "Production-Synchronized"
                }
            });
        } catch (error) {
            return ResponseHelper.error(res, "Failed to retrieve system status.", 500);
        }
    }

    /**
     * @method getAuditLogs
     * @desc Future-proofed endpoint for compliance monitoring interface.
     */
    static async getAuditLogs(req, res) {
        return ResponseHelper.success(res, "Administrative audit logs retrieved.", { 
            logs: [],
            count: 0 
        });
    }
}

export default AdminController;
