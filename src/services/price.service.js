/**
 * PriceService - Core Pricing Engine for MapCap IPO
 * * This service handles the dynamic "Spot Price" calculation based on 
 * Philip's inverse proportion formula: (Fixed MapCap Supply / Total Pi Invested).
 * * Designed to be simple, fast-running, and White-Label ready.
 */
class PriceService {
    /**
     * Fixed Total Supply for MapCap IPO. 
     * In a White-Label scenario, this value can be pulled from a config file or DB.
     */
    static TOTAL_MAPCAP_SUPPLY = 2181818; //

    /**
     * Calculates the daily Spot Price.
     * * @param {number} totalPiInvested - The total amount of Pi currently in the IPO pool.
     * @returns {number} The calculated price per Pi.
     */
    static calculateDailySpotPrice(totalPiInvested) {
        // Validation to prevent division by zero or negative values
        if (!totalPiInvested || totalPiInvested <= 0) {
            return 0;
        }

        /**
         * The "Water-Level" Formula:
         * As total Pi investment increases, the individual share percentage (price) 
         * adjusts accordingly. This is calculated once daily at 12:00 midnight UTC.
         */
        const spotPrice = this.TOTAL_MAPCAP_SUPPLY / totalPiInvested; //

        // Returning the raw price to maintain precision for batch processing
        return spotPrice;
    }

    /**
     * Optional: Formats the price for UI display (e.g., 4 decimal places).
     * Part of the "IPO Pulse Dashboard" engaging visual strategy.
     */
    static formatPriceForDisplay(price) {
        return Number(price).toFixed(4); //
    }
}

module.exports = PriceService;

