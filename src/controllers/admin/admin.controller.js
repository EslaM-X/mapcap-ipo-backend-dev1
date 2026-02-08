/**
 * Admin Controller - Project Management
 * ---------------------------------------------------------
 * This controller allows administrators (Philip/Daniel) to trigger 
 * critical manual actions like Whale Refunds or System Audits.
 */

const SettlementJob = require('../jobs/settlement.js');
const Investor = require('../models/Investor');

class AdminController {
    /**
     * Trigger Manual Settlement
     * This endpoint is called when the 4-week IPO period officially ends.
     */
    static async triggerFinalSettlement(req, res) {
        try {
            // Fetch all participants and total pool size
            const investors = await Investor.find();
            const aggregation = await Investor.aggregate([
                { $group: { _id: null, total: { $sum: "$totalPiContributed" } } }
            ]);
            
            const totalPiPool = aggregation.length > 0 ? aggregation[0].total : 0;

            // Execute the Anti-Whale Refund Job
            const report = await SettlementJob.executeWhaleTrimBack(investors, totalPiPool);

            res.status(200).json({
                success: true,
                message: "Final IPO settlement executed successfully.",
                report
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Settlement failed", error: error.message });
        }
    }
}

module.exports = AdminController;
