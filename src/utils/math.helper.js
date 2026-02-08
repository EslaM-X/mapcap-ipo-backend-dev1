/**
 * MathHelper - Financial Precision Engine
 * ---------------------------------------------------------
 * Handles high-precision calculations for Pi and MapCap tokens.
 * Prevents floating-point errors during "Water-Level" pricing.
 */

class MathHelper {
    /**
     * Rounds numbers to the official Pi Network precision (6 decimals).
     */
    static toPiPrecision(value) {
        return Math.round(value * 1000000) / 1000000;
    }

    /**
     * Calculates the 20% Capital Gain accurately.
     */
    static calculateAlphaGain(balance) {
        return this.toPiPrecision(balance * 1.20);
    }

    /**
     * Percentage calculation for Anti-Whale logic.
     */
    static getPercentage(part, total) {
        if (total === 0) return 0;
        return (part / total) * 100;
    }
}

module.exports = MathHelper;
