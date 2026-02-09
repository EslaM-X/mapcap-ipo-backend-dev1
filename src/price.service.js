/**
 * PriceService - Dynamic Scarcity Pricing Engine v1.3
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings (Page 4)
 * * PURPOSE:
 * Calculates the real-time "Spot Price" based on the 'Water-Level' 
 * (Total Pi Pool). This ensures the IPO Pulse Dashboard reflects 
 * the dynamic valuation model requested for the 4-week period.
 * ---------------------------------------------------------
 */

class PriceService {
  /**
   * OFFICIAL IPO SUPPLY:
   * Fixed at 2,181,818 MapCap shares as per the ecosystem consensus.
   */
  static IPO_MAPCAP_SUPPLY = 2181818;

  /**
   * @method calculateDailySpotPrice
   * @desc Implements the Inverse Proportion Formula.
   * @param {number} totalPiInWallet - Aggregate Pi collected from all Pioneers.
   * @returns {number} The current valuation of 1 MapCap in Pi.
   */
  static calculateDailySpotPrice(totalPiInWallet) {
    /**
     * SAFE-GUARD:
     * If the pool is empty (start of IPO), return 0.
     * This triggers the "Calculating..." state in the Frontend PriceGraph.
     */
    if (!totalPiInWallet || totalPiInWallet <= 0) {
      return 0;
    }

    /**
     * PHILIP'S FORMULA:
     * Price = Fixed Supply / Total Contributed Pi
     * As liquidity (Pi) grows, the MapCap price adjusts to maintain 
     * the fixed supply ratio, rewarding early 'Water-Level' participants.
     */
    return this.IPO_MAPCAP_SUPPLY / totalPiInWallet;
  }

  /**
   * @method formatPrice
   * @desc Normalizes the price for UI display in the StatsPanel.
   * @param {number} price - The raw floating-point calculation.
   * @returns {string} Formatted string with 6-decimal precision.
   */
  static formatPrice(price) {
    if (!price || isNaN(price)) return "0.000000";
    return Number(price).toFixed(6);
  }
}

// Exporting as ES Module to align with Vercel/Node.js architecture
export default PriceService;
