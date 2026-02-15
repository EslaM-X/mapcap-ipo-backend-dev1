/**
 * Admin Management Service v1.4.6 (Executive Oversight)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Dynamic IPO Monitoring
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Provides high-performance data processing for administrative reporting.
 * Tailored to Philip's dynamic use case where whale monitoring is active
 * throughout the IPO, while enforcement is deferred to final settlement.
 * -------------------------------------------------------------------------
 */

import Investor from '../../models/investor.model.js'; // PATH FIXED: Correct relative path for ESM

class AdminService {
    /**
     * @method getExecutiveSummary
     * @desc Generates an executive summary of the IPO performance metrics.
     * Calculates the "Water-Level" and tracks current whale participation rates.
     * @returns {Object} Statistics containing liquidity, investor count, and whale count.
     */
    static async getExecutiveSummary() {
        try {
            /**
             * AGGREGATION PIPELINE:
             * Sums total Pi liquidity and counts unique Pioneers globally.
             * Tracks 'whaleCount' for Philip's audit prior to the final 28-day settlement.
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

            /**
             * SUCCESS RESPONSE:
             * Structure strictly preserved for Frontend Admin Dashboard compatibility.
             */
            return stats.length > 0 ? stats[0] : { 
                totalPiLiquidity: 0, 
                totalInvestors: 0, 
                whaleCount: 0 
            };
        } catch (error) {
            /**
             * EXCEPTION HANDLING:
             * Logs critical failures for Daniel's infrastructure monitoring.
             */
            console.error("[ADMIN_SERVICE_ERROR] Failed to aggregate IPO stats:", error.message);
            throw new Error("Analytics Engine failure. Financial Pipeline disrupted.");
        }
    }

    /**
     * @method getWhaleReport
     * @desc Retrieves a list of Pioneers flagged for the 10% cap audit.
     * Essential for manual reconciliation before the final Settlement Job.
     * @returns {Array} List of investors sorted by contribution volume.
     */
    static async getWhaleReport() {
        // Optimized query to fetch flagged whales for Philip's final review.
        return await Investor.find({ isWhale: true }).sort({ totalPiContributed: -1 });
    }
}



export default AdminService;
