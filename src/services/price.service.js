/**
 * PriceService - Dynamic Pricing Engine v1.6.1 (Institutional Grade)
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's "Water-Level" Model
 * * STRATEGY: 
 * This engine calculates the 'Spot Price' by balancing the fixed 
 * MapCap supply against the real-time Pi investment pool. 
 * Optimized for high-frequency dashboard updates and financial audit.
 * ---------------------------------------------------------
 */

// Exported as a named constant to resolve 'undefined' errors in unit tests
export const IPO_MAPCAP_SUPPLY = 2181818;

class PriceService {
    /**
     * IPO_MAPCAP_SUPPLY
     * Internal reference for class-level access. 
     * Maintained for backward compatibility with Frontend calls.
     */
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
         * Ensures institutional transparency for the Scarcity Engine.
         */
        const spotPrice = IPO_MAPCAP_SUPPLY / totalPiInvested;

        return spotPrice;
    }

    /**
     * @method formatPrice
     * @desc Standardizes precision for UI and Financial Logging.
     * @param {number} price - The raw floating-point calculation.
     * @returns {string} Formatted price with 6-decimal precision for audit readiness.
     */
    static formatPrice(price) {
        if (!price || isNaN(price)) return "0.000000";
        // Upgraded to 6 decimals to satisfy technical test suite requirements
        return Number(price).toFixed(6);
    }

    /**
     * @method formatPriceForDisplay (Legacy Support)
     * @desc Maintained to prevent breaking existing Frontend Dashboard components.
     * @param {number} price - Raw price value.
     * @returns {string} 4-decimal formatted string for UX clarity.
     */
    static formatPriceForDisplay(price) {
        if (!price || isNaN(price)) return "0.0000";
        return Number(price).toFixed(4);
    }
}

/**
 * Dual-Export Strategy:
 * 1. Default Export: Maintains compatibility with existing Controller imports.
 * 2. Named Export: Enables the Test Suite to perform granular integrity audits.
 */
export { PriceService };
export default PriceService;
