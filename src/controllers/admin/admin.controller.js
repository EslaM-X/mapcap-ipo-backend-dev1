/**
 * Admin Controller - Project Management
 * ---------------------------------------------------------
 * This controller allows administrators (Philip/Daniel) to trigger 
 * critical manual actions like Whale Refunds or System Audits.
 * * Location: src/controllers/admin/admin.controller.js
 */

// لاحظ تعديل المسارات (أضفنا .. زيادة لأننا دخلنا جوه مجلد admin)
const SettlementJob = require('../../jobs/settlement'); 
const Investor = require('../../models/Investor');

class AdminController {
    /**
     * Trigger Manual Settlement
     * This endpoint is called when the 4-week IPO period officially ends.
     * It enforces the 10% Whale Cap rule globally.
     */
    static async triggerFinalSettlement(req, res) {
        try {
            console.log("[ADMIN] Manual Settlement Triggered by Philip/Daniel");

            // 1. Fetch all participants from MongoDB
            const investors = await Investor.find();
            
            // 2. Calculate the final total pool size
            const aggregation = await Investor.aggregate([
                { $group: { _id: null, total: { $sum: "$totalPiContributed" } } }
            ]);
            
            const totalPiPool = aggregation.length > 0 ? aggregation[0].total : 0;

            if (totalPiPool === 0) {
                return res.status(400).json({ success: false, message: "No investments found to settle." });
            }

            // 3. Execute the Anti-Whale Refund Job via A2UaaS
            const report = await SettlementJob.executeWhaleTrimBack(investors, totalPiPool);

            res.status(200).json({
                success: true,
                message: "Final IPO settlement executed successfully.",
                report
            });
        } catch (error) {
            console.error("[ADMIN ERROR] Settlement failed:", error.message);
            res.status(500).json({ success: false, message: "Settlement failed", error: error.message });
        }
    }
}

module.exports = AdminController;
