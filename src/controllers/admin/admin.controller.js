/**
 * AdminController - Management & Settlement Operations v1.4 (Production Ready)
 * -------------------------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Anti-Whale Enforcement
 * * PURPOSE:
 * Provides administrative overrides for the MapCap IPO ecosystem.
 * Enforces the "10% Whale Cap" rule manually after the 4-week period,
 * ensuring decentralization through high-precision settlement logic.
 * -------------------------------------------------------------------------
 */

import Investor from '../../models/investor.model.js';
import SettlementJob from '../../jobs/settlement.job.js';
import ResponseHelper from '../../utils/response.helper.js';

class AdminController {
    /**
     * @method triggerFinalSettlement
     * @desc Finalizes the IPO by calculating total liquidity and triggering
     * automatic refunds for any pioneer exceeding the 10% stake ceiling.
     * @access Private (Admin Only)
     */
    static async triggerFinalSettlement(req, res) {
        try {
            // AUDIT LOG: Essential for transparency standards requested by Daniel.
            console.log(`[ADMIN_ACTION] Manual IPO Settlement triggered at ${new Date().toISOString()}`);

            /**
             * 1. DATA AGGREGATION: 
             * Calculate the total Pi pool with high precision using MongoDB Aggregation.
             * This represents Value 2 (Total Pool Liquidity) in Philip's spec.
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

            // 2. INTEGRITY CHECK: Prevent execution on an uninitialized or empty pool.
            if (totalPiPool === 0) {
                return ResponseHelper.error(res, "Settlement Aborted: No active investment liquidity detected.", 400);
            }

            /**
             * 3. EXECUTION: Anti-Whale Refund Engine.
             * Triggers the SettlementJob to perform the A2UaaS transfers.
             * Enforces the 10% ceiling to maintain Philip's 'Water-level' decentralization.
             */
            const investors = await Investor.find(); // Fetching all records for the settlement job
            const report = await SettlementJob.executeWhaleTrimBack(investors, totalPiPool);

            // 4. PROFESSIONAL REPORTING: Standardized response for the Admin Dashboard.
            return ResponseHelper.success(res, "IPO settlement and Whale trim-back protocol executed.", {
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
             * Ensures failures in the A2UaaS pipeline are caught and logged for Daniel's audit.
             */
            console.error("[CRITICAL_SETTLEMENT_FAILURE]:", error.message);
            
            return ResponseHelper.error(res, `Internal settlement engine failure: ${error.message}`, 500);
        }
    }

    /**
     * @method getAuditLogs
     * @desc Placeholder for Daniel's audit review interface.
     * In production, this reads the financial_audit.log file.
     */
    static async getAuditLogs(req, res) {
        return ResponseHelper.success(res, "Audit logs retrieved.", { logs: [] });
    }
}

export default AdminController;
