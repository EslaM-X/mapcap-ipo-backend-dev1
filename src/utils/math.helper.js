/**
 * MathHelper - High-Precision Financial Engine v1.4
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Deterministic math engine to prevent floating-point anomalies.
 * Core to the 10% Anti-Whale Ceiling and 20% Alpha Gain logic.
 * ---------------------------------------------------------
 */

class MathHelper {
  /**
   * PI_PRECISION_FACTOR
   * Aligns with the 6-decimal standard for MapCap Financial Reporting.
   */
  static PRECISION_FACTOR = 1000000;

  /**
   * @method toPiPrecision
   * @desc Normalizes values using integer-scaling to eliminate binary artifacts.
   * @param {number} value - Raw result from controllers or background jobs.
   * @returns {number} Normalized value fixed to 6 decimal places.
   */
  static toPiPrecision(value) {
    if (value === undefined || value === null || isNaN(value)) return 0;
    
    // We use integer-based math to bypass float precision bugs
    return Math.round((value + Number.EPSILON) * this.PRECISION_FACTOR) / this.PRECISION_FACTOR;
  }

  /**
   * @method calculateAlphaGain
   * @desc Implementation of Spec Page 4: "20% Pioneer Uplift".
   * @param {number} balance - The user's total Pi contribution.
   */
  static calculateAlphaGain(balance) {
    if (!balance || balance <= 0) return 0;
    const gain = balance * 1.20;
    return this.toPiPrecision(gain);
  }

  /**
   * @method getPercentage
   * @desc Essential for the 10% Anti-Whale Dashboard Alerts.
   */
  static getPercentage(part, total) {
    if (!total || total === 0) return 0;
    const result = (part / total) * 100;
    return this.toPiPrecision(result);
  }

  

  /**
   * @method formatCurrency
   * @desc Prepares data for the 'Pulse Dashboard' UI.
   * Ensures Value 1-4 look professional with fixed decimal padding.
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
   * @desc Quick check for Daniel's Whale-Shield Protocol.
   * Returns true if the user's share is <= 10%.
   */
  static isWithinCap(userBalance, totalPool) {
    const share = this.getPercentage(userBalance, totalPool);
    return share <= 10.000000;
  }
}

export default MathHelper;
