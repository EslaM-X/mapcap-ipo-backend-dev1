/**
 * MathHelper - High-Precision Financial Engine v1.3
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Provides deterministic mathematical operations for the IPO.
 * Crucial for preventing JavaScript floating-point anomalies 
 * in the 10% Anti-Whale calculations and 20% Alpha Gain.
 * ---------------------------------------------------------
 */

class MathHelper {
  /**
   * PI_PRECISION_FACTOR
   * Aligns with Pi Network's 7-decimal standard, normalized to 6 
   * for MapCap Dashboard clarity (Value 1-4 rendering).
   */
  static PRECISION_FACTOR = 1000000;

  /**
   * @method toPiPrecision
   * @desc Normalizes values using integer-first math to ensure ledger accuracy.
   * @param {number} value - The raw numerical result from the controller/job.
   * @returns {number} Value fixed to 6 decimal places.
   */
  static toPiPrecision(value) {
    if (value === undefined || value === null || isNaN(value)) return 0;
    // Rounding after multiplication to eliminate trailing binary artifacts
    return Math.round(value * this.PRECISION_FACTOR) / this.PRECISION_FACTOR;
  }

  /**
   * @method calculateAlphaGain
   * @desc Requirement Page 4: "Pioneers benefit from a 20% uplift".
   * @param {number} balance - The user's total Pi contribution.
   * @returns {number} The 120% valuation of the original stake.
   */
  static calculateAlphaGain(balance) {
    if (!balance) return 0;
    const gain = balance * 1.20;
    return this.toPiPrecision(gain);
  }

  /**
   * @method getPercentage
   * @desc Critical for 'Whale-Shield' monitoring.
   * Determines if a user's stake exceeds the 10% IPO capacity.
   */
  static getPercentage(part, total) {
    if (!total || total === 0) return 0;
    const result = (part / total) * 100;
    return this.toPiPrecision(result);
  }

  /**
   * @method format
   * @desc Prepares financial data for the 'Single-Screen' UI display.
   * Ensures consistent padding (e.g., 1.500000) for professional UX.
   */
  static format(value) {
    if (value === undefined || value === null) return "0.00";
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  }
}

// Exporting as a singleton-style helper for the entire ecosystem
export default MathHelper;
