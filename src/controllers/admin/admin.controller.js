/**
 * AdminController - Management & Settlement Operations v1.3
 * -------------------------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Anti-Whale Enforcement
 * * PURPOSE:
 * Provides administrative overrides for the MapCap IPO ecosystem.
 * Primary responsibility: Managing the end-of-cycle settlement and 
 * enforcing the "10% Whale Cap" rule manually after the 4-week period.
 * -------------------------------------------------------------------------
 */

import Investor from '../../models/investor.model.js';
import SettlementJob from '../../jobs/settlement.job.js';

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

            // 1. DATA AGGREGATION: Calculate the total Pi pool with high precision
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

            // 2. INTEGRITY CHECK: Ensure settlement doesn't run on an empty or uninitialized pool
            if (totalPiPool === 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Settlement Aborted: No active investment liquidity detected." 
                });
            }

            /**
             * 3. EXECUTION: Anti-Whale Refund Engine.
             * Triggers the SettlementJob to perform the A2UaaS transfers.
             * This enforces the 'Water-level' logic to maintain decentralization.
             */
            const investors = await Investor.find(); // Fetching full documents for the Job
            const report = await SettlementJob.executeWhaleTrimBack(investors, totalPiPool);

            // 4. PROFESSIONAL REPORTING: Data structure for the Admin Dashboard UI
            return res.status(200).json({
                success: true,
                message: "IPO settlement and Whale trim-back protocol executed.",
                data: {
                    executionTimestamp: new Date().toISOString(),
                    metrics: {
                        totalPoolProcessed: totalPiPool,
                        investorsAudited: investorCount,
                        refundsIssued: report.totalRefunded,
                        whalesImpacted: report.whalesImpacted
                    },
                    status: "COMPLETED"
                }
            });

        } catch (error) {
            /**
             * CRITICAL ERROR HANDLING:
             * Ensures that any failure in the A2UaaS pipeline is caught and logged.
             */
            console.error("[CRITICAL_SETTLEMENT_FAILURE]:", error.message);
            
            return res.status(500).json({ 
                success: false, 
                message: "Internal settlement engine failure. Check A2UaaS connectivity.", 
                error: error.message 
            });
        }
    }
}

export default AdminController;
