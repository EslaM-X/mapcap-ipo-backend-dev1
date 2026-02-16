/**
 * AdminController - Management & Settlement Operations v1.5.2
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Post-IPO Whale Enforcement
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Orchestrates administrative-level financial operations, specifically the
 * final IPO settlement and anti-whale protocol enforcement.
 * -------------------------------------------------------------------------
 * UPDATED: Corrected relative import paths for new directory structure.
 */

// Core Model & Utility Imports (Paths updated for src/controllers/admin/ context)
import Investor from '../../models/investor.model.js';
import SettlementJob from '../../jobs/settlement.job.js'; 
import ResponseHelper from '../../utils/response.helper.js';

class AdminController {
    /**
     * @method triggerFinalSettlement
     * @description Orchestrates manual IPO finalization based on final 'Water-Level'.
     * Triggers the whale trim-back mechanism to enforce the 10% ceiling.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Promise<Object>} JSON response with execution metrics.
     * @access Private (Super Admin Only)
     */
    static async triggerFinalSettlement(req, res) {
        try {
            console.log(`[ADMIN_ACTION] Manual Post-IPO Settlement sequence initiated at ${new Date().toISOString()}`);

            /**
             * PHASE 1: GLOBAL LIQUIDITY AGGREGATION
             * Utilizes MongoDB Aggregation pipeline for high-performance data processing.
             * Defines the 'Water-Level' baseline for whale protocol calculations.
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
             * PHASE 2: INTEGRITY VALIDATION
             * Prevents execution if no liquidity is present in the pool.
             */
            if (totalPiPool === 0) {
                return ResponseHelper.error(res, "Settlement Aborted: No liquidity detected in the IPO pool.", 400);
            }

            /**
             * PHASE 3: CORE FINANCIAL EXECUTION
             * Dispatches data to SettlementJob for atomic enforcement of the 10% ceiling.
             */
            const report = await SettlementJob.executeWhaleTrimBack(totalPiPool);

            if (!report || !report.success) {
                throw new Error(report?.error || "Internal Settlement Engine Disruption");
            }

            /**
             * PHASE 4: FRONTEND SYNCHRONIZATION (STABLE MAPPING)
             * CRITICAL: Preserves 'metrics' and 'refundsIssued' keys to maintain 
             * compatibility with AdminDashboard.jsx and existing test suites.
             */
            return ResponseHelper.success(res, "Post-IPO settlement and Whale trim-back protocol executed.", {
                executionTimestamp: new Date().toISOString(),
                metrics: {
                    totalPoolProcessed: totalPiPool,
                    investorsAudited: investorCount,
                    // DO NOT MODIFY: Key dependency for integration tests and UI
                    refundsIssued: report.whalesImpacted || 0, 
                    totalRefundedPi: report.totalRefunded || 0    
                },
                status: "COMPLETED"
            });

        } catch (error) {
            /**
             * CRITICAL FAILURE LOGGING & RECOVERY
             */
            console.error("[CRITICAL_SETTLEMENT_FAILURE]:", error.message);
            return ResponseHelper.error(res, `Settlement engine failure: ${error.message}`, 500);
        }
    }

    /**
     * @method getSystemStatus
     * @description Fetches real-time system metrics for administrative oversight.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
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
            console.error("[STATUS_RETRIEVAL_ERROR]:", error.message);
            return ResponseHelper.error(res, "Failed to retrieve system status.", 500);
        }
    }

    /**
     * @method getAuditLogs
     * @description Compliance monitoring interface (Placeholder for future audit trail).
     */
    static async getAuditLogs(req, res) {
        return ResponseHelper.success(res, "Administrative audit logs retrieved.", { 
            logs: [],
            count: 0 
        });
    }
}

export default AdminController;
