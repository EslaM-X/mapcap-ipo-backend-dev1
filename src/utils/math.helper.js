/**
 * MathHelper - High-Precision Financial Engine v1.4.1 (Production Grade)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Provides a deterministic math engine to prevent floating-point anomalies.
 * This is the core logic for enforcing the 10% Anti-Whale Ceiling and 
 * calculating the 20% Pioneer Alpha Gain with absolute accuracy.
 * -------------------------------------------------------------------------
 */

class MathHelper {
  /**
   * @constant PRECISION_FACTOR
   * Aligns with the 6-decimal standard required for MapCap Financial Reporting 
   * and high-fidelity blockchain settlement tracking.
   */
  static PRECISION_FACTOR = 1000000;

  /**
   * @method toPiPrecision
   * @description Normalizes numerical values using integer-scaling to eliminate 
   * binary floating-point artifacts (rounding errors).
   * @param {number} value - Raw input from controllers or models.
   * @returns {number} Normalized value rounded precisely to 6 decimal places.
   */
  static toPiPrecision(value) {
    if (value === undefined || value === null || isNaN(value)) return 0;
    
    /**
     * LOGIC:
     * Utilizing integer-based math by scaling the value before rounding.
     * Incorporates Number.EPSILON to handle infinitesimal representation errors.
     */
    return Math.round((value + Number.EPSILON) * this.PRECISION_FACTOR) / this.PRECISION_FACTOR;
  }

  /**
   * @method calculateAlphaGain
   * @description Direct implementation of Spec Page 4: "20% Pioneer Uplift".
   * Automatically calculates the bonus equity for early IPO participants.
   * @param {number} balance - The user's base Pi contribution.
   * @returns {number} The total allocation including the 20% alpha gain.
   */
  static calculateAlphaGain(balance) {
    if (!balance || balance <= 0) return 0;
    const gain = balance * 1.20;
    return this.toPiPrecision(gain);
  }

  /**
   * @method getPercentage
   * @description Calculates the share of the pool. Essential for triggering 
   * 'Whale-Shield' dashboard alerts and Daniel's compliance flags.
   * @param {number} part - The individual contribution.
   * @param {number} total - The global pool size (e.g., 2,181,818).
   * @returns {number} Percentage share formatted to 6-decimal precision.
   */
  static getPercentage(part, total) {
    if (!total || total === 0) return 0;
    const result = (part / total) * 100;
    return this.toPiPrecision(result);
  }

  /**
   * @method formatCurrency
   * @description Formats numerical data for professional UI display.
   * Ensures Value 1-4 metrics on the 'Pulse Dashboard' feature 
   * consistent comma separators and decimal padding.
   * @param {number} value - The numerical value to format.
   * @param {number} minDecimals - Minimum fraction digits (default 2).
   * @returns {string} Localized string (e.g., "1,250.000000").
   */
  static formatCurrency(value, minDecimals = 2) {
    if (value === undefined || value === null || isNaN(value)) return "0.00";
    
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: 6,
      useGrouping: true
    }).format(value);
  }

  /**
   * @method isWithinCap
   * @description Evaluates Daniel's Whale-Shield Protocol.
   * Strictly verifies if a user's share remains within the 10% limit.
   * @param {number} userBalance - Total contribution of the pioneer.
   * @param {number} totalPool - Global supply or aggregate pool size.
   * @returns {boolean} True if share <= 10.000000%.
   */
  static isWithinCap(userBalance, totalPool) {
    const share = this.getPercentage(userBalance, totalPool);
    return share <= 10.000000;
  }
}



export default MathHelper;
