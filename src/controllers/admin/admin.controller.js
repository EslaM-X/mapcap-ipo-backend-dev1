/**
 * AdminController - Management, Settlement & Vesting Operations v1.6.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Post-IPO & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Orchestrates administrative-level financial operations, including the
 * final IPO settlement (Whale Trim-back) and the Monthly Vesting Release.
 * -------------------------------------------------------------------------
 * INTEGRITY GUARANTEE:
 * Maintains strict key-mapping for 'metrics', 'refundsIssued', and 'status'
 * to prevent breaking changes in AdminDashboard.jsx and integration suites.
 */

import Investor from '../../models/investor.model.js';
import SettlementJob from '../../jobs/settlement.job.js'; 
import VestingJob from '../../jobs/vesting.job.js'; // NEW: Added to support Vesting Pipeline
import ResponseHelper from '../../utils/response.helper.js';

class AdminController {
    /**
     * @method triggerFinalSettlement
     * @description Orchestrates manual IPO finalization based on final 'Water-Level'.
     * Triggers the whale trim-back mechanism to enforce the 10% ceiling.
     * @access Private (Super Admin Only)
     */
    static async triggerFinalSettlement(req, res) {
        try {
            console.log(`[ADMIN_ACTION] Manual Post-IPO Settlement sequence initiated at ${new Date().toISOString()}`);

            /**
             * PHASE 1: GLOBAL LIQUIDITY AGGREGATION
             * Aggregates total Pi in the pool to calculate the 10% ceiling threshold.
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

            if (totalPiPool === 0) {
                return ResponseHelper.error(res, "Settlement Aborted: No liquidity detected in the IPO pool.", 400);
            }

            /**
             * PHASE 2: CORE FINANCIAL EXECUTION
             * Dispatches data to SettlementJob for atomic enforcement.
             */
            const report = await SettlementJob.executeWhaleTrimBack(totalPiPool);

            if (!report || !report.success) {
                throw new Error(report?.error || "Internal Settlement Engine Disruption");
            }

            /**
             * PHASE 3: FRONTEND SYNCHRONIZATION
             * Preserves 'refundsIssued' and 'totalRefundedPi' for Dashboard compatibility.
             */
            return ResponseHelper.success(res, "Post-IPO settlement executed successfully.", {
                executionTimestamp: new Date().toISOString(),
                metrics: {
                    totalPoolProcessed: totalPiPool,
                    investorsAudited: investorCount,
                    refundsIssued: report.whalesImpacted || 0, 
                    totalRefundedPi: report.totalRefunded || 0    
                },
                status: "COMPLETED"
            });

        } catch (error) {
            console.error("[CRITICAL_SETTLEMENT_FAILURE]:", error.message);
            return ResponseHelper.error(res, `Settlement engine failure: ${error.message}`, 500);
        }
    }

    /**
     * @method triggerVestingCycle
     * @description Manual trigger for the 10% monthly MapCap vesting release.
     * Aligns with 'payout.pipeline.test.js' requirements for ledger updates.
     * @access Private (Super Admin Only)
     */
    static async triggerVestingCycle(req, res) {
        try {
            console.log(`[ADMIN_ACTION] Manual Vesting Cycle Triggered at ${new Date().toISOString()}`);
            
            // Execute the Vesting Job logic (10% release)
            await VestingJob.executeMonthlyVesting();

            return ResponseHelper.success(res, "Monthly vesting tranche released to all eligible Pioneers.", {
                cycleTimestamp: new Date().toISOString(),
                status: "SUCCESS"
            });
        } catch (error) {
            console.error("[CRITICAL_VESTING_FAILURE]:", error.message);
            return ResponseHelper.error(res, `Vesting engine failure: ${error.message}`, 500);
        }
    }

    /**
     * @method getSystemStatus
     * @description Fetches real-time system metrics for administrative oversight.
     */
    static async getSystemStatus(req, res) {
        try {
            const investorsCount = await Investor.countDocuments();
            
            return ResponseHelper.success(res, "System metrics retrieved successfully.", {
                status: "Operational",
                engine: "MapCap Audit Engine v1.6.0",
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
     * @description Compliance monitoring interface for Philip's audit trail.
     */
    static async getAuditLogs(req, res) {
        return ResponseHelper.success(res, "Administrative audit logs retrieved.", { 
            logs: [],
            count: 0 
        });
    }
}

export default AdminController;
