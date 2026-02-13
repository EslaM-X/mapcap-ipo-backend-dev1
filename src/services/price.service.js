/**
 * PriceService - Dynamic Pricing Engine v1.6.1 (Stabilized)
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's "Water-Level" Model
 * * * STRATEGY: 
 * This engine calculates the 'Spot Price' by balancing the fixed 
 * MapCap supply against the real-time Pi investment pool. 
 * Optimized for high-frequency dashboard updates and mathematical precision.
 * ---------------------------------------------------------
 */

/**
 * IPO_MAPCAP_SUPPLY
 * Fixed ecosystem supply as per institutional-grade specifications.
 * Exported as a named constant to ensure visibility for unit testing.
 */
export const IPO_MAPCAP_SUPPLY = 2181818;

export class PriceService {
    
    // Internal reference to the supply constant
    static IPO_MAPCAP_SUPPLY = IPO_MAPCAP_SUPPLY;

    /**
     * @method calculateDailySpotPrice
     * @desc Calculates the price based on Philip's inverse proportion formula.
     * @param {number} totalPiInvested - Aggregate Pi currently in the IPO pool.
     * @returns {number} The raw spot price per MapCap unit.
     */
    static calculateDailySpotPrice(totalPiInvested) {
        // Validation to prevent division by zero or erroneous negative inputs
        if (!totalPiInvested || totalPiInvested <= 0) {
            return 0;
        }

        /**
         * THE WATER-LEVEL FORMULA:
         * Spot Price = Fixed Supply / Total Contributed Pi.
         * Ensures transparency and scarcity-driven valuation.
         */
        const spotPrice = this.IPO_MAPCAP_SUPPLY / totalPiInvested;

        return spotPrice;
    }

    /**
     * @method formatPrice
     * @desc Normalizes the price for the "IPO Pulse Dashboard" UI.
     * @param {number} price - The raw floating-point calculation.
     * @returns {string} Formatted price with 6-decimal precision for audit clarity.
     */
    static formatPrice(price) {
        if (!price || isNaN(price)) return "0.000000";
        
        // Upgraded to 6-decimal precision to align with MathHelper standards
        return Number(price).toFixed(6);
    }
}

// Default export maintained for existing controller integrations
export default PriceService;
