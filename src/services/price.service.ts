/**
 * PriceService - Dynamic Pricing Engine v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's "Water-Level" Model
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Defined static constants for IPO Supply (2,181,818 tokens).
 * - Implemented type-safe aggregation for real-time price calculation.
 * - Maintained 6-decimal precision for financial integrity and 4-decimal for UI.
 */

import Transaction from '../models/Transaction.js';

// Total MapCap tokens allocated for the IPO phase per Philip's Spec
export const IPO_MAPCAP_SUPPLY: number = 2181818;

class PriceService {
    public static readonly IPO_MAPCAP_SUPPLY = IPO_MAPCAP_SUPPLY;

    /**
     * @method calculateDailySpotPrice
     * @param {number} totalPiInvested 
     * @desc Core algorithm: (Total Supply / Current Pi Pool).
     */
    static calculateDailySpotPrice(totalPiInvested: number): number {
        if (!totalPiInvested || totalPiInvested <= 0) return 0;
        return IPO_MAPCAP_SUPPLY / totalPiInvested;
    }

    /**
     * @method getCurrentPrice
     * @desc Fetches aggregate data from DB to provide real-time valuation based on completed investments.
     */
    static async getCurrentPrice(): Promise<number> {
        try {
            const stats = await Transaction.aggregate([
                { $match: { type: 'INVESTMENT', status: 'COMPLETED' } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);
            
            const totalPi: number = stats.length > 0 ? stats[0].total : 0;
            
            // Fallback to minimal value to prevent division by zero in UI
            return totalPi > 0 ? this.calculateDailySpotPrice(totalPi) : 0.0001; 
        } catch (error: any) {
            console.error("[PRICE_SERVICE_ERROR]: DB Aggregate failed, using fallback.");
            return 0.0001; 
        }
    }

    /**
     * @method fetchLatestPiPrice
     * @desc COMPATIBILITY LAYER: Resolves 'metrics.sync.test.js' dependency.
     */
    static async fetchLatestPiPrice(): Promise<number> {
        return await this.getCurrentPrice();
    }

    /**
     * @method formatPrice
     * @param {number | string} price
     * @desc Standard 6-decimal precision for Daniel's financial audit logs.
     */
    static formatPrice(price: number | string): string {
        const val = Number(price);
        if (isNaN(val)) return "0.000000";
        return val.toFixed(6);
    }

    /**
     * @method formatPriceForDisplay
     * @param {number | string} price
     * @desc Standard 4-decimal precision for Frontend dashboard readability.
     */
    static formatPriceForDisplay(price: number | string): string {
        const val = Number(price);
        if (isNaN(val)) return "0.0000";
        return val.toFixed(4);
    }
}

export { PriceService };
export default PriceService;
