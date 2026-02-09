/**
 * MathHelper - Financial Precision Engine v1.2
 * ---------------------------------------------------------
 * Architect: Eslam Kora | AppDev @Map-of-Pi
 * Purpose: 
 * Handles high-precision calculations for the MapCap IPO ecosystem.
 * Enforces the 6-decimal precision standard of the Pi Network.
 */

class MathHelper {
  /**
   * PI_PRECISION_FACTOR
   * Official Pi Network uses up to 7 decimals, but 6 is the MapCap standard 
   * for UX clarity on the Single-Screen layout.
   */
  static PRECISION = 1000000;

  /**
   * toPiPrecision
   * Fixes floating point errors by using integer math before returning decimals.
   * @param {number} value - Raw calculation result.
   */
  static toPiPrecision(value) {
    if (!value || isNaN(value)) return 0;
    return Math.round(value * this.PRECISION) / this.PRECISION;
  }

  /**
   * calculateAlphaGain (Value 4)
   * Calculates the 20% guaranteed appreciation for early Pioneers.
   * Formula: Original Investment + 20% = Balance * 1.20
   * [Source: Philip's Spec Page 4]
   */
  static calculateAlphaGain(balance) {
    const gain = balance * 1.20;
    return this.toPiPrecision(gain);
  }

  /**
   * getPercentage
   * Utility for Anti-Whale logic and withdrawal requests.
   */
  static getPercentage(part, total) {
    if (!total || total === 0) return 0;
    const result = (part / total) * 100;
    return this.toPiPrecision(result);
  }

  /**
   * formatCurrency
   * Prepares numbers for UI display with consistent padding.
   */
  static format(value) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  }
}

// Using ES Module export to match your package.json configuration
export default MathHelper;
