/**
 * Admin Management Service v1.4
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Executive Oversight Dashboard
 * * PURPOSE:
 * Provides high-performance data processing for administrative reporting.
 * Focuses on real-time auditing, liquidity tracking, and IPO metrics.
 * ---------------------------------------------------------
 */

import Investor from '../../models/investor.model.js';

class AdminService {
    /**
     * @method getExecutiveSummary
     * @desc Generates an executive summary of the IPO performance.
     * Calculates the "Water-Level" and Investor participation rates.
     * @returns {Object} Aggregated IPO statistics.
     */
    static async getExecutiveSummary() {
        try {
            /**
             * AGGREGATION PIPELINE:
             * Efficiently sums total Pi liquidity and counts unique Pioneers
             * in a single database pass to ensure high performance.
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

            // Formatting the response for the IPO Pulse Dashboard
            return stats.length > 0 ? stats[0] : { 
                totalPiLiquidity: 0, 
                totalInvestors: 0, 
                whaleCount: 0 
            };
        } catch (error) {
            console.error("[ADMIN_SERVICE_ERROR] Failed to aggregate IPO stats:", error.message);
            throw new Error("Analytics Engine failure. Please check MongoDB connectivity.");
        }
    }

    /**
     * @method getWhaleReport
     * @desc Retrieves a list of Pioneers nearing or exceeding the 10% cap.
     * Essential for Daniel's final settlement audit.
     */
    static async getWhaleReport() {
        return await Investor.find({ isWhale: true }).sort({ totalPiContributed: -1 });
    }
}

// Transitioned to ES Module export for project consistency
export default AdminService;
