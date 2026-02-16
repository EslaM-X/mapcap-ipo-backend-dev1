/**
 * PriceService - Dynamic Pricing Engine v1.6.8
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's "Water-Level" Model
 * -------------------------------------------------------------------------
 * DESIGN STRATEGY: 
 * Ensures non-breaking UI updates while providing robust error handling 
 * for the IPO price discovery mechanism.
 * -------------------------------------------------------------------------
 */

import Transaction from '../models/Transaction.js';

// Total MapCap tokens allocated for the IPO phase
export const IPO_MAPCAP_SUPPLY = 2181818;

class PriceService {
    static IPO_MAPCAP_SUPPLY = IPO_MAPCAP_SUPPLY;

    /**
     * @method calculateDailySpotPrice
     * @param {number} totalPiInvested 
     * @desc Core algorithm calculation: Supply / Pool.
     */
    static calculateDailySpotPrice(totalPiInvested) {
        if (!totalPiInvested || totalPiInvested <= 0) return 0;
        return IPO_MAPCAP_SUPPLY / totalPiInvested;
    }

    /**
     * @method getCurrentPrice
     * @desc Fetches aggregate data from DB to provide real-time valuation.
     * Includes a fail-safe (0.0001) to ensure the UI Pulse Dashboard never crashes.
     */
    static async getCurrentPrice() {
        try {
            // Aggregating completed investment transactions
            const stats = await Transaction.aggregate([
                { $match: { type: 'INVESTMENT', status: 'COMPLETED' } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);
            
            const totalPi = stats.length > 0 ? stats[0].total : 0;
            
            // Return calculated price or base starting price if pool is empty
            return totalPi > 0 ? this.calculateDailySpotPrice(totalPi) : 0.0001; 
        } catch (error) {
            /**
             * LOGGING FOR DANIEL'S COMPLIANCE:
             * Ensures system availability even during DB latency.
             */
            console.error("[PRICE_SERVICE_ERROR]: DB Aggregate failed, reverting to safety price.");
            return 0.0001; 
        }
    }

    /**
     * @method formatPrice
     * @desc Standard 6-decimal precision for ledger/backend synchronization.
     */
    static formatPrice(price) {
        if (!price || isNaN(price)) return "0.000000";
        return Number(price).toFixed(6);
    }

    /**
     * @method formatPriceForDisplay
     * @desc Standard 4-decimal precision for UI readability.
     */
    static formatPriceForDisplay(price) {
        if (!price || isNaN(price)) return "0.0000";
        return Number(price).toFixed(4);
    }
}

export { PriceService };
export default PriceService;
