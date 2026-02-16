/**
 * @file PriceService.js
 * @module Services/Price
 * @version 1.6.2
 * @author EslaM-X | Lead AppDev @Map-of-Pi
 * @description Dynamic Pricing Engine for the MapCap Ecosystem.
 * Implements Philip's "Water-Level" Model to calculate real-time asset valuation 
 * based on the scarcity algorithm and total Pi Network contributions.
 * * DESIGN PRINCIPLES:
 * - Deterministic Output: Ensures consistent price calculation across the platform.
 * - Precision Management: Handles 6-decimal ledger precision and 4-decimal UI formatting.
 * - Fault Tolerance: Implements safety checks to prevent DivisionByZero or Infinity errors.
 */

// Total MapCap tokens allocated for the IPO phase as per the official Whitepaper
export const IPO_MAPCAP_SUPPLY = 2181818;

class PriceService {
    /**
     * Static reference to the total supply.
     * Accessible throughout the application without re-importing the constant.
     */
    static IPO_MAPCAP_SUPPLY = IPO_MAPCAP_SUPPLY;

    /**
     * @method calculateDailySpotPrice
     * @param {number} totalPiInvested - The aggregate amount of Pi currently in the IPO pool.
     * @returns {number} The calculated spot price per MapCap asset.
     * * FORMULA: [Fixed Supply (2,181,818) / Total Contributed Pi]
     * This represents the 'Water-Level' logic where the price fluctuates 
     * inversely to the pool size to maintain economic equilibrium.
     */
    static calculateDailySpotPrice(totalPiInvested) {
        // Validation: Prevent division by zero or invalid negative inputs
        if (!totalPiInvested || totalPiInvested <= 0) {
            return 0;
        }
        
        // Core Scarcity Algorithm
        return IPO_MAPCAP_SUPPLY / totalPiInvested;
    }

    /**
     * @method formatPrice
     * @param {number|string} price - The raw numerical price value.
     * @returns {string} Formatted string with 6-decimal precision for ledger/DB consistency.
     * @description Used for sensitive financial records and backend synchronization.
     */
    static formatPrice(price) {
        if (!price || isNaN(price)) return "0.000000";
        return Number(price).toFixed(6);
    }

    /**
     * @method formatPriceForDisplay
     * @param {number|string} price - The raw numerical price value.
     * @returns {string} Cleaned string with 4-decimal precision for the UI Pulse Dashboard.
     * @description Optimizes readability for Pioneers within the Map-of-Pi mobile/web interface.
     */
    static formatPriceForDisplay(price) {
        if (!price || isNaN(price)) return "0.0000";
        return Number(price).toFixed(4);
    }
}

// Named export for specific utility imports
export { PriceService };

// Default export for seamless integration with existing Service layers
export default PriceService;
