/**
 * PriceService - Dynamic Pricing Engine v1.6.3
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's "Water-Level" Model
 */

import Transaction from '../models/Transaction.js';

export const IPO_MAPCAP_SUPPLY = 2181818;

class PriceService {
    static IPO_MAPCAP_SUPPLY = IPO_MAPCAP_SUPPLY;

    /**
     * @method calculateDailySpotPrice
     * @param {number} totalPiInvested 
     * @desc Pure logic: Fixed Supply / Total Pool.
     */
    static calculateDailySpotPrice(totalPiInvested) {
        if (!totalPiInvested || totalPiInvested <= 0) return 0;
        return IPO_MAPCAP_SUPPLY / totalPiInvested;
    }

    /**
     * @method getCurrentPrice
     * @desc NEW: Fetches total Pi from DB and calculates the real-time spot price.
     * Use this for Test Cases and Dashboard 'Pulse' updates.
     */
    static async getCurrentPrice() {
        const stats = await Transaction.aggregate([
            { $match: { type: 'INVESTMENT', status: 'COMPLETED' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        
        const totalPi = stats.length > 0 ? stats[0].total : 0;
        return this.calculateDailySpotPrice(totalPi);
    }

    static formatPrice(price) {
        if (!price || isNaN(price)) return "0.000000";
        return Number(price).toFixed(6);
    }

    static formatPriceForDisplay(price) {
        if (!price || isNaN(price)) return "0.0000";
        return Number(price).toFixed(4);
    }
}

export { PriceService };
export default PriceService;
