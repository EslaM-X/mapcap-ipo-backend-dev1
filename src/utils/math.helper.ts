/**
 * MathHelper - High-Precision Financial Engine v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented static typing for all financial calculations.
 * - Maintained the 1,000,000 Precision Factor for 6-decimal fidelity.
 * - Formalized currency formatting for consistent 'Pulse Dashboard' UI.
 */

class MathHelper {
  /**
   * @constant PRECISION_FACTOR
   * Aligns with the 6-decimal standard for high-fidelity blockchain tracking.
   */
  static readonly PRECISION_FACTOR: number = 1000000;

  /**
   * @method toPiPrecision
   * @description Normalizes numerical values to eliminate binary floating-point artifacts.
   * @param {number} value - Raw input value.
   * @returns {number} Normalized value rounded precisely to 6 decimal places.
   */
  static toPiPrecision(value: number | undefined | null): number {
    if (value === undefined || value === null || isNaN(value)) return 0;
    
    /**
     * LOGIC:
     * Utilizing integer-based math by scaling. Number.EPSILON handles 
     * infinitesimal representation errors during the rounding process.
     */
    return Math.round((value + Number.EPSILON) * this.PRECISION_FACTOR) / this.PRECISION_FACTOR;
  }

  /**
   * @method calculateAlphaGain
   * @description Direct implementation of Spec: "20% Pioneer Uplift".
   * @param {number} balance - Base Pi contribution.
   * @returns {number} Total allocation including 20% alpha gain.
   */
  static calculateAlphaGain(balance: number): number {
    if (!balance || balance <= 0) return 0;
    const gain: number = balance * 1.20;
    return this.toPiPrecision(gain);
  }

  /**
   * @method getPercentage
   * @description Essential for triggering 'Whale-Shield' compliance flags.
   * @param {number} part - Individual contribution.
   * @param {number} total - Global pool size.
   * @returns {number} Percentage share formatted to 6-decimal precision.
   */
  static getPercentage(part: number, total: number): number {
    if (!total || total === 0) return 0;
    const result: number = (part / total) * 100;
    return this.toPiPrecision(result);
  }

  /**
   * @method formatCurrency
   * @description Professional UI display for Value 1-4 metrics on the Dashboard.
   * @param {number} value - Numerical value to format.
   * @param {number} minDecimals - Minimum fraction digits (default 2).
   * @returns {string} Localized string (e.g., "1,250.000000").
   */
  static formatCurrency(value: number | undefined | null, minDecimals: number = 2): string {
    if (value === undefined || value === null || isNaN(value)) return "0.00";
    
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: 6,
      useGrouping: true
    }).format(value);
  }

  /**
   * @method isWithinCap
   * @description Evaluates Daniel's Whale-Shield Protocol (10% limit).
   * @returns {boolean} True if share <= 10.000000%.
   */
  static isWithinCap(userBalance: number, totalPool: number): boolean {
    const share: number = this.getPercentage(userBalance, totalPool);
    return share <= 10.000000;
  }
}

export default MathHelper;
