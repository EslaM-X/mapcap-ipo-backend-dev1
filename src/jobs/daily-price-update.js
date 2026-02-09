/**
 * Daily Price Update Job - Market Dynamics Engine
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE: 
 * This job executes every 24 hours to recalibrate the 'Spot Price'.
 * It ensures the "IPO Pulse Dashboard" reflects the scarcity-based
 * valuation model derived from the total Pi pool [Page 4, Sec 73].
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import PriceService from '../services/price.service.js';

class DailyPriceJob {
    /**
     * @method updatePrice
     * @desc Calculates the new market spot price based on global pool liquidity.
     * @returns {Object} Current pool metrics and the recalculated price.
     */
    static async updatePrice() {
        console.log("--- [MARKET_ENGINE] Starting Daily Price Recalibration ---");

        try {
            // 1. GLOBAL AGGREGATION
            // Calculate total Pi contributed across all Pioneers to determine 'Water-Level'.
            const result = await Investor.aggregate([
                { $group: { _id: null, totalPool: { $sum: "$totalPiContributed" } } }
            ]);

            const totalPiInvested = result.length > 0 ? result[0].totalPool : 0;

            /**
             * 2. SCARCITY-BASED VALUATION (Philip's Formula)
             * Formula: Total MapCap Supply / Current Pi Pool.
             * Handled by PriceService for modularity and precision.
             */
            const newPrice = PriceService.calculateDailySpotPrice(totalPiInvested);
            const formattedPrice = PriceService.formatPrice(newPrice);

            console.log(`[AUDIT] Total Pool Liquidity: ${totalPiInvested} Pi`);
            console.log(`[AUDIT] Recalculated Spot Price: ${formattedPrice} Pi/MapCap`);

            /**
             * DANIEL'S TRANSPARENCY REQUIREMENT:
             * This data feeds the DailySnapshots collection to render the 
             * 28-day price history graph in the Frontend UI.
             */
            
            console.log("--- [SUCCESS] Daily Price Update Cycle Completed ---");
            return { 
                totalPiInvested, 
                newPrice: formattedPrice,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error("[CRITICAL_ERROR] Price Update Aborted:", error.message);
            throw error; // Rethrow to let the CronScheduler log the failure
        }
    }
}

export default DailyPriceJob;
