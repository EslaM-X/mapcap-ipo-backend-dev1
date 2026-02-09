/**
 * PriceService - Dynamic Pricing Engine v1.4
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's "Water-Level" Model
 * * STRATEGY: 
 * This engine calculates the 'Spot Price' by balancing the fixed 
 * MapCap supply against the real-time Pi investment pool. 
 * Optimized for high-frequency dashboard updates.
 * ---------------------------------------------------------
 */

class PriceService {
    /**
     * TOTAL_MAPCAP_SUPPLY
     * Fixed ecosystem supply. Note: In a White-Label deployment, 
     * this value can be injected via environment variables.
     */
    static TOTAL_MAPCAP_SUPPLY = 2181818;

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
         * This ensures that early adopters benefit from the pool's growth.
         */
        const spotPrice = this.TOTAL_MAPCAP_SUPPLY / totalPiInvested;

        return spotPrice;
    }

    /**
     * @method formatPriceForDisplay
     * @desc Normalizes the price for the "IPO Pulse Dashboard" UI.
     * @param {number} price - The raw floating-point calculation.
     * @returns {string} Formatted price with 4-decimal precision for UX clarity.
     */
    static formatPriceForDisplay(price) {
        if (!price || isNaN(price)) return "0.0000";
        return Number(price).toFixed(4);
    }
}

// Transitioned to ES Module export for Vercel/Node.js compatibility
export default PriceService;
