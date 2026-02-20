/**
 * Admin Management Service v1.5.2 (Executive Oversight)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Dynamic IPO Monitoring
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Provides high-performance data processing for administrative reporting.
 * Tailored to Philip's dynamic use case where whale monitoring is active
 * throughout the IPO, while enforcement is deferred to final settlement.
 * -------------------------------------------------------------------------
 * UPDATED: Relative pathing fixed for nested directory structure.
 */

import Investor from '../../models/investor.model.js';

class AdminService {
    /**
     * @method getExecutiveSummary
     * @description Generates a high-level executive summary of IPO performance.
     * Calculates the 'Water-Level' and tracks real-time whale participation.
     * @returns {Promise<Object>} Aggregated metrics: total liquidity, investor count, and whale count.
     */
    static async getExecutiveSummary() {
        try {
            /**
             * AGGREGATION PIPELINE:
             * Sums total Pi liquidity and counts unique Pioneers globally.
             * Tracks 'whaleCount' for Philip's pre-settlement audit.
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
             * DEFAULT STATE HANDLING:
             * Ensures the Frontend Admin Dashboard receives a valid object 
             * even if the pool is currently empty.
             */
            return stats.length > 0 ? stats[0] : { 
                totalPiLiquidity: 0, 
                totalInvestors: 0, 
                whaleCount: 0 
            };
        } catch (error) {
            /**
             * CRITICAL LOGGING:
             * Provides error visibility for Daniel's infrastructure monitoring logs.
             */
            console.error("[ADMIN_SERVICE_ERROR] Failed to aggregate IPO stats:", error.message);
            throw new Error("Analytics Engine failure. Financial Pipeline disrupted.");
        }
    }

    /**
     * @method getWhaleReport
     * @description Retrieves a list of Pioneers flagged for the mandatory 10% cap audit.
     * Essential for manual reconciliation before the final Settlement Job execution.
     * @returns {Promise<Array>} Sorted list of investors by contribution volume (Descending).
     */
    static async getWhaleReport() {
        /**
         * OPTIMIZED QUERY:
         * Fetches flagged whales for Philip's final review.
         * Sorted by contribution to prioritize high-impact accounts.
         */
        return await Investor.find({ isWhale: true }).sort({ totalPiContributed: -1 });
    }
}

export default AdminService;
