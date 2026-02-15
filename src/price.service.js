/**
 * PriceService - Dynamic Scarcity Pricing Engine v1.3.1
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings (Scarcity Model)
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Orchestrates the real-time "Spot Price" calculation based on the 
 * aggregate 'Water-Level' (Total Pi Contributed). This service ensures 
 * the IPO Pulse Dashboard reflects the dynamic valuation requested.
 * -------------------------------------------------------------------------
 */

class PriceService {
  /**
   * OFFICIAL IPO SUPPLY:
   * Fixed at 2,181,818 MapCap units. This constant is the anchor for 
   * all scarcity-based valuation logic.
   */
  static IPO_MAPCAP_SUPPLY = 2181818;

  /**
   * @method calculateDailySpotPrice
   * @description Implementation of the Inverse Scarcity Formula.
   * Logic: Price = (Fixed Supply / Total Contributed Pi).
   * @param {number} totalPiInWallet - Total Pi aggregate from the IPO wallet.
   * @returns {number} The current valuation of 1 MapCap relative to Pi.
   */
  static calculateDailySpotPrice(totalPiInWallet) {
    /**
     * INITIALIZATION GUARD:
     * Prevents division by zero or negative results. If the pool is empty 
     * (start of IPO), it returns 0 to trigger the "Pending" UI state.
     */
    if (!totalPiInWallet || totalPiInWallet <= 0) {
      return 0;
    }

    /**
     * PHILIP'S SPECIFICATION:
     * As liquidity (Pi) increases, the MapCap 'Spot Price' adjusts dynamically.
     * This rewards early participants by establishing a fixed equity ratio.
     */
    return this.IPO_MAPCAP_SUPPLY / totalPiInWallet;
  }

  /**
   * @method formatPrice
   * @description Standardizes price strings for the StatsPanel and PriceGraph.
   * @param {number} price - Raw floating-point spot price.
   * @returns {string} Normalized string formatted to 6-decimal precision.
   */
  static formatPrice(price) {
    if (!price || isNaN(price)) return "0.000000";
    // Aligns with the high-fidelity reporting standard (Daniel's Compliance)
    return Number(price).toFixed(6);
  }
}



// Exporting as ES Module for seamless Vercel/Node.js integration
export default PriceService;
