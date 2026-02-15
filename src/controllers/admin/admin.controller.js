/**
 * AdminController - Management & Settlement Operations v1.4.5
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
     * @access Private (System Administrator)
     * @returns {JSON} Execution metrics and settlement status.
     */
    static async triggerFinalSettlement(req, res) {
        try {
            // AUDIT LOG: Mandatory entry for Daniel's compliance monitoring
            console.log(`[ADMIN_ACTION] Manual Post-IPO Settlement triggered at ${new Date().toISOString()}`);

            /**
             * STEP 1: LIQUIDITY AGGREGATION
             * Calculate the final total Pi pool across all pioneers. 
             * This satisfies Philip's requirement to use the aggregate total 
             * at the end of the 4-week cycle as the basis for the 10% cap.
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
             * Abort execution if no liquidity exists to prevent algorithmic errors.
             */
            if (totalPiPool === 0) {
                return ResponseHelper.error(res, "Settlement Aborted: No liquidity detected in the IPO pool.", 400);
            }

            /**
             * STEP 3: FINANCIAL ENGINE EXECUTION
             * Invokes the SettlementJob which interfaces with the 'refunds.job.js' 
             * professional engine to handle A2UaaS payouts and ledger updates.
             */
            const investors = await Investor.find(); 
            const report = await SettlementJob.executeWhaleTrimBack(investors, totalPiPool);

            /**
             * STEP 4: FRONTEND SYNCHRONIZATION
             * Returns a standardized payload for the Dashboard. 
             * Metrics are mapped to match the 'refunds.job.js' output schema.
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
             * Logs failure details for Daniel's manual financial reconciliation.
             */
            console.error("[CRITICAL_SETTLEMENT_FAILURE]:", error.message);
            return ResponseHelper.error(res, `Settlement engine failure: ${error.message}`, 500);
        }
    }

    /**
     * @method getAuditLogs
     * @desc Retrieves administrative logs for Daniel's transparency audit.
     */
    static async getAuditLogs(req, res) {
        return ResponseHelper.success(res, "Audit logs retrieved.", { logs: [] });
    }
}

export default AdminController;
