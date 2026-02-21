/**
 * Admin Management Service v1.7.5 (TS - Executive Oversight)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Dynamic IPO Monitoring
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Defined IExecutiveSummary interface for strict return type safety.
 * - Implemented Type-safe Aggregation Pipeline for financial metrics.
 * - Maintained sort-descending logic for high-impact whale reporting.
 */

import Investor, { IInvestor } from '../../models/investor.model.js';

/**
 * @interface IExecutiveSummary
 * Standardized structure for the Admin Dashboard overview.
 */
interface IExecutiveSummary {
    totalPiLiquidity: number;
    totalInvestors: number;
    whaleCount: number;
}

class AdminService {
    /**
     * @method getExecutiveSummary
     * @description Generates a high-level executive summary of IPO performance.
     * @returns {Promise<IExecutiveSummary>} Aggregated metrics for Philip's dashboard.
     */
    static async getExecutiveSummary(): Promise<IExecutiveSummary> {
        try {
            /**
             * AGGREGATION PIPELINE:
             * Efficiently sums liquidity and counts unique Pioneers.
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
             * Prevents UI breakage by providing a zero-state fallback.
             */
            if (stats.length > 0) {
                return {
                    totalPiLiquidity: stats[0].totalPiLiquidity,
                    totalInvestors: stats[0].totalInvestors,
                    whaleCount: stats[0].whaleCount
                };
            }

            return { 
                totalPiLiquidity: 0, 
                totalInvestors: 0, 
                whaleCount: 0 
            };
        } catch (error: any) {
            /**
             * CRITICAL LOGGING:
             * Vital for Daniel's infrastructure monitoring.
             */
            console.error("[ADMIN_SERVICE_ERROR] Failed to aggregate IPO stats:", error.message);
            throw new Error("Analytics Engine failure. Financial Pipeline disrupted.");
        }
    }

    /**
     * @method getWhaleReport
     * @description Retrieves Pioneers flagged for the mandatory 10% cap audit.
     * @returns {Promise<IInvestor[]>} Sorted list for manual reconciliation.
     */
    static async getWhaleReport(): Promise<IInvestor[]> {
        /**
         * OPTIMIZED QUERY:
         * Prioritizes high-impact accounts for Philip's review.
         */
        return await Investor.find({ isWhale: true }).sort({ totalPiContributed: -1 });
    }
}

export default AdminService;
