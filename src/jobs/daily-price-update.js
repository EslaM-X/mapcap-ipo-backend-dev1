/**
 * Daily Price Update Job - Market Dynamics Engine v1.2.5
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * ---------------------------------------------------------
 * ARCHITECTURAL ROLE: 
 * Executes the 24-hour recalibration of the MapCap 'Spot Price'.
 * This job synchronizes the 'Water-Level' liquidity with the 
 * scarcity-based valuation model [Page 4, Sec 73].
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import PriceService from '../services/price.service.js';
import { writeAuditLog } from '../config/logger.js';

class DailyPriceJob {
    /**
     * @method updatePrice
     * @desc Aggregates global Pi liquidity and calculates the current market 
     * spot price. Values are formatted for high-precision Dashboard display.
     * @returns {Object} Metadata for historical charting and UI synchronization.
     */
    static async updatePrice() {
        console.log("--- [MARKET_ENGINE] Starting Daily Price Recalibration Cycle ---");

        try {
            /**
             * STEP 1: LIQUIDITY AGGREGATION
             * Calculating the finalized 'Water-Level' across all Pioneers.
             * This aggregate serves as the denominator in the scarcity formula.
             */
            const result = await Investor.aggregate([
                { $group: { _id: null, totalPool: { $sum: "$totalPiContributed" } } }
            ]);

            const totalPiInvested = result.length > 0 ? result[0].totalPool : 0;

            /**
             * STEP 2: SCARCITY-BASED VALUATION (Philip's Core Formula)
             * Formula: Total MapCap Supply / Current Liquidity Pool.
             * High-precision logic is delegated to the PriceService.
             */
            const newPrice = PriceService.calculateDailySpotPrice(totalPiInvested);
            const formattedPrice = PriceService.formatPrice(newPrice);

            /**
             * STEP 3: DANIEL'S COMPLIANCE AUDIT
             * Captures a permanent snapshot of the market movement for financial auditing.
             */
            writeAuditLog('INFO', `[MARKET_SNAPSHOT] Pool: ${totalPiInvested} Pi | Spot Price: ${formattedPrice}`);

            console.log(`[AUDIT] Current Water-Level: ${totalPiInvested} Pi`);
            console.log(`[AUDIT] Market Spot Price: ${formattedPrice}`);

            /**
             * STEP 4: EXECUTION SUMMARY
             * The returned payload is formatted for historical data persistence 
             * used in the Dashboard's 28-day performance graph.
             */
            console.log("--- [SUCCESS] Market Recalibration Cycle Finalized ---");
            
            return { 
                totalPiInvested, 
                newPrice: formattedPrice,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            /**
             * EXCEPTION HANDLING:
             * Logs failure for Daniel's manual reconciliation to prevent data gaps.
             */
            writeAuditLog('CRITICAL', `Price Engine Stalled: ${error.message}`);
            console.error("[CRITICAL_FAILURE] Price Update Aborted:", error.message);
            throw error; 
        }
    }
}

export default DailyPriceJob;
