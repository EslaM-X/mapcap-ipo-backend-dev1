/**
 * PriceService - Dynamic Pricing Engine v1.6.9
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's "Water-Level" Model
 * -------------------------------------------------------------------------
 * DESIGN STRATEGY: 
 * Optimized for stability in Termux environments. Added compatibility layer
 * for integration tests to resolve 'fetchLatestPiPrice' dependency.
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
     */
    static async getCurrentPrice() {
        try {
            const stats = await Transaction.aggregate([
                { $match: { type: 'INVESTMENT', status: 'COMPLETED' } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);
            
            const totalPi = stats.length > 0 ? stats[0].total : 0;
            return totalPi > 0 ? this.calculateDailySpotPrice(totalPi) : 0.0001; 
        } catch (error) {
            console.error("[PRICE_SERVICE_ERROR]: DB Aggregate failed, using fallback.");
            return 0.0001; 
        }
    }

    /**
     * @method fetchLatestPiPrice
     * @desc COMPATIBILITY LAYER: Essential for resolving Test Suite Error (metrics.sync.test.js).
     * Acts as an alias for getCurrentPrice to satisfy the integration test expectations.
     */
    static async fetchLatestPiPrice() {
        return await this.getCurrentPrice();
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
