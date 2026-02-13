/**
 * MathHelper - High-Precision Financial Engine v1.4 (Production Grade)
 * -------------------------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * * PURPOSE:
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
   * @param {number} value - Raw result from controllers, models, or background jobs.
   * @returns {number} Normalized value rounded precisely to 6 decimal places.
   */
  static toPiPrecision(value) {
    if (value === undefined || value === null || isNaN(value)) return 0;
    
    /**
     * LOGIC:
     * We use integer-based math by scaling the number up before rounding, 
     * incorporating Number.EPSILON to handle floating point representation errors.
     */
    return Math.round((value + Number.EPSILON) * this.PRECISION_FACTOR) / this.PRECISION_FACTOR;
  }

  /**
   * @method calculateAlphaGain
   * @description Implementation of Spec Page 4: "20% Pioneer Uplift".
   * Automatically calculates the bonus equity for early IPO participants.
   * @param {number} balance - The user's total base Pi contribution.
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
   * the 10% Anti-Whale Dashboard alerts and compliance flags.
   * @param {number} part - The individual contribution.
   * @param {number} total - The global IPO pool size.
   * @returns {number} Percentage share formatted to 6-decimal precision.
   */
  static getPercentage(part, total) {
    if (!total || total === 0) return 0;
    const result = (part / total) * 100;
    return this.toPiPrecision(result);
  }

  /**
   * @method formatCurrency
   * @description Prepares numerical data for the 'Pulse Dashboard' UI.
   * Ensures that Value 1-4 metrics look professional with localized formatting 
   * and consistent decimal padding.
   * @param {number} value - The currency value to format.
   * @param {number} minDecimals - Minimum decimal places (default 2).
   * @returns {string} Formatted string with commas and fixed padding.
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
   * @description Direct implementation of Daniel's Whale-Shield Protocol.
   * Performs a strict check to ensure a user's stake does not exceed 10%.
   * @param {number} userBalance - Total contribution of the pioneer.
   * @param {number} totalPool - Global supply or total pool size.
   * @returns {boolean} True if the user's share is <= 10.000000%.
   */
  static isWithinCap(userBalance, totalPool) {
    const share = this.getPercentage(userBalance, totalPool);
    return share <= 10.000000;
  }
}

export default MathHelper;
