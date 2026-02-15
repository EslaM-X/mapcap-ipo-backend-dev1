/**
 * Admin Management Service v1.4.5 (Executive Oversight)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Dynamic IPO Monitoring
 * ---------------------------------------------------------
 * PURPOSE:
 * Provides high-performance data processing for administrative reporting.
 * Tailored to Philip's dynamic use case where whale monitoring is active
 * throughout the IPO, while enforcement is deferred to final settlement.
 */

import Investor from '../../models/investor.model.js';

class AdminService {
    /**
     * @method getExecutiveSummary
     * @desc Generates an executive summary of the IPO performance.
     * Calculates the "Water-Level" and current whale participation rates.
     */
    static async getExecutiveSummary() {
        try {
            /**
             * AGGREGATION PIPELINE:
             * Sums total Pi liquidity and counts unique Pioneers.
             * Tracks 'whaleCount' for Philip's audit prior to final settlement.
             */
            const stats = await Investor.aggregate([
                {
                    $group: {
                        _id: null,
                        totalPiLiquidity: { $sum: "$totalPiContributed" },
                        totalInvestors: { $sum: 1 },
                        whaleCount: { 
                            $sum: { $cond: [{ $eq: ["$isWhale", true] }, 1, 0] } 
                        }
                    }
                }
            ]);

            // Structure preserved for Frontend Dashboard compatibility
            return stats.length > 0 ? stats[0] : { 
                totalPiLiquidity: 0, 
                totalInvestors: 0, 
                whaleCount: 0 
            };
        } catch (error) {
            console.error("[ADMIN_SERVICE_ERROR] Failed to aggregate IPO stats:", error.message);
            throw new Error("Analytics Engine failure. Pipeline disrupted.");
        }
    }

    /**
     * @method getWhaleReport
     * @desc Retrieves Pioneers flagged for the 10% cap audit.
     * Essential for the final Settlement Job execution [Spec Page 6].
     */
    static async getWhaleReport() {
        // Returns the list of flagged whales for final reconciliation
        return await Investor.find({ isWhale: true }).sort({ totalPiContributed: -1 });
    }
}

export default AdminService;
