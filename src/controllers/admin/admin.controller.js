/**
 * AdminController - Management & Settlement Operations
 * -------------------------------------------------------------------------
 * This controller provides administrative overrides for the MapCap IPO ecosystem.
 * Its primary responsibility is managing the end-of-cycle settlement process
 * and enforcing the "10% Whale Cap" rule manually after the 4-week period.
 * * @author Full-Stack Developer | Map-of-Pi
 * @version 1.0.0
 */

// Importing core modules with adjusted relative paths for the sub-directory structure
const SettlementJob = require('../../jobs/settlement'); 
const Investor = require('../../models/Investor');

class AdminController {
    /**
     * triggerFinalSettlement
     * -----------------------
     * Finalizes the IPO by calculating the total Pi pool and triggering
     * automatic refunds for any investor exceeding the 10% stake limit.
     * * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Promise<Response>} JSON response confirming settlement report.
     */
    static async triggerFinalSettlement(req, res) {
        try {
            // Audit log for internal tracking (Essential for transparency)
            console.log("[SYSTEM AUDIT] Manual IPO Settlement triggered by Administrator.");

            // 1. Retrieve all investment records from the database
            const investors = await Investor.find();
            
            // 2. Aggregate the total Pi collected across the entire ecosystem
            const aggregation = await Investor.aggregate([
                { 
                    $group: { 
                        _id: null, 
                        total: { $sum: "$totalPiContributed" } 
                    } 
                }
            ]);
            
            const totalPiPool = aggregation.length > 0 ? aggregation[0].total : 0;

            // Integrity check: Ensure settlement doesn't run on an empty pool
            if (totalPiPool === 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Settlement aborted: No active investments found in the pool." 
                });
            }

            /**
             * 3. Execute the Anti-Whale Refund Engine.
             * This calls the SettlementJob to perform the A2UaaS transfers.
             * It ensures the 'Water-level' logic is applied to maintain fair distribution.
             */
            const report = await SettlementJob.executeWhaleTrimBack(investors, totalPiPool);

            // Return professional report for the Admin Dashboard
            res.status(200).json({
                success: true,
                message: "IPO settlement and Whale trim-back completed successfully.",
                timestamp: new Date().toISOString(),
                report: {
                    totalPoolProcessed: totalPiPool,
                    investorsAudited: investors.length,
                    refundsIssued: report.totalRefunded,
                    whalesDetected: report.whalesImpacted
                }
            });

        } catch (error) {
            // Critical error logging
            console.error("[CRITICAL ERROR] Admin Settlement Failure:", error.message);
            
            res.status(500).json({ 
                success: false, 
                message: "An internal error occurred during the settlement process.", 
                error: error.message 
            });
        }
    }
}

module.exports = AdminController;
