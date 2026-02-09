/**
 * PriceService - Dynamic Pricing Engine
 * ---------------------------------------------------------
 * This service calculates the daily "Spot Price" of MapCap shares.
 * It follows Philip's core formula: Fixed Supply / Total Investment Pool.
 * Optimized for the 4-week high-intensity IPO period.
 */

// Fixed Total Supply for the MapCap IPO as per the ecosystem document
const IPO_MAPCAP_SUPPLY = 2181818;

class PriceService {
  /**
   * Calculates the current Spot Price based on the total Pi collected.
   * As the "water-level" (total Pi) increases, the price per share adjusts.
   * * @param {number} totalPiInWallet - Total amount of Pi invested in the IPO.
   * @returns {number} The calculated price of 1 MapCap share in Pi.
   */
  static calculateDailySpotPrice(totalPiInWallet) {
    // Prevent division by zero if the IPO has just started
    if (!totalPiInWallet || totalPiInWallet <= 0) {
      return 0;
    }

    /**
     * Simple Inverse Proportion Formula:
     * This ensures the 10% Whale Cap can be calculated accurately at the end.
     */
    return IPO_MAPCAP_SUPPLY / totalPiInWallet;
  }

  /**
   * Utility to format the price for the IPO Pulse Dashboard display.
   */
  static formatPrice(price) {
    return Number(price).toFixed(6); // High precision for financial data
  }
}

module.exports = PriceService;
