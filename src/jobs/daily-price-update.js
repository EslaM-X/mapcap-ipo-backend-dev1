/**
 * Daily Price Update Job - Market Dynamics Engine v1.2
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE: 
 * Executes every 24 hours to recalibrate the 'Spot Price'.
 * Powering the scarcity-based valuation model [Page 4, Sec 73].
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import PriceService from '../services/price.service.js';
import { writeAuditLog } from '../config/logger.js';

class DailyPriceJob {
    /**
     * @method updatePrice
     * @desc Calculates the new market spot price based on global pool liquidity.
     * Synchronizes the 'Water-Level' with the Dashboard UI.
     */
    static async updatePrice() {
        console.log("--- [MARKET_ENGINE] Starting Daily Price Recalibration ---");

        try {
            /**
             * 1. GLOBAL AGGREGATION
             * Summing total Pi liquidity to determine the current 'Water-Level'.
             */
            const result = await Investor.aggregate([
                { $group: { _id: null, totalPool: { $sum: "$totalPiContributed" } } }
            ]);

            const totalPiInvested = result.length > 0 ? result[0].totalPool : 0;

            /**
             * 2. SCARCITY-BASED VALUATION (Philip's Formula)
             * Logic: Total MapCap Supply / Current Pi Pool.
             * Handled by PriceService for high-precision math.
             */
            const newPrice = PriceService.calculateDailySpotPrice(totalPiInvested);
            const formattedPrice = PriceService.formatPrice(newPrice);

            /**
             * DANIEL'S AUDIT TRAIL:
             * Logging the price movement to the permanent audit.log file.
             */
            writeAuditLog('INFO', `[MARKET_SNAPSHOT] Pool: ${totalPiInvested} Pi | Spot Price: ${formattedPrice} Pi/MapCap`);

            console.log(`[AUDIT] Total Pool Liquidity: ${totalPiInvested} Pi`);
            console.log(`[AUDIT] Recalculated Spot Price: ${formattedPrice}`);

            /**
             * FUTURE UI SYNC:
             * This return value is captured by CronScheduler to trigger 
             * real-time updates via WebSockets or saved for the 28-day graph.
             */
            console.log("--- [SUCCESS] Daily Price Update Cycle Completed ---");
            
            return { 
                totalPiInvested, 
                newPrice: formattedPrice,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            writeAuditLog('CRITICAL', `Price Update Aborted: ${error.message}`);
            console.error("[CRITICAL_ERROR] Price Update Aborted:", error.message);
            throw error; 
        }
    }
}

export default DailyPriceJob;
