/**
 * Math Engine Unit Tests - Spec-Compliant v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Audit: Daniel & Philip Compliance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Formalized MathHelper static methods with strict number types.
 * - Validated Philip's "20% Pioneer Uplift" logic.
 * - Enforced 6-decimal precision for Daniel's audit compliance.
 * - Added comprehensive null/undefined guards for pipeline resilience.
 */

import MathHelper from '../../../src/utils/math.helper.js';

describe('MapCap Math Engine - Unit Tests', () => {
  
  /**
   * SECTION 1: ALPHA GAIN LOGIC
   * Requirement: Philip's Spec Page 4 - "20% Pioneer Uplift".
   */
  test('Alpha Gain: Should calculate exactly 20% increase for loyal Pioneers', () => {
    const balance = 100;
    const expected = 120; // Formula: (balance * 1.20)
    
    const result = MathHelper.calculateAlphaGain(balance);
    
    expect(result).toBe(expected);
    expect(typeof result).toBe('number');
  });

  /**
   * SECTION 2: WHALE-SHIELD ADVISORY BENCHMARK
   * Requirement: Decentralization Ceiling Check (10% Cap).
   */
  test('Whale-Shield: Should accurately flag stakes exceeding 10% threshold', () => {
    const userBalance = 11;
    const totalPool = 100;
    
    // Logic: 11 is 11% of 100, which exceeds the 10% limit.
    // Result must be 'false' as it is NOT within the safe cap.
    expect(MathHelper.isWithinCap(userBalance, totalPool)).toBe(false);
  });

  test('Whale-Shield: Should approve stakes exactly at or below 10% threshold', () => {
    expect(MathHelper.isWithinCap(10, 100)).toBe(true);
    expect(MathHelper.isWithinCap(5, 100)).toBe(true);
  });

  /**
   * SECTION 3: PRECISION & NORMALIZATION
   * Requirement: Daniel's Financial Integrity Audit - 6-Decimal Standard.
   */
  test('Precision: Should round to 6 decimal places without floating-point artifacts', () => {
    const value = 1.123456789;
    const expected = 1.123457; // Verified implementation: Rounds 6th decimal based on 7th
    
    expect(MathHelper.toPiPrecision(value)).toBe(expected);
  });

  /**
   * SECTION 4: SYSTEM RESILIENCE (Edge Cases)
   */
  test('Resilience: Should return 0 for non-numerical or empty inputs', () => {
    // Ensuring the math engine doesn't break the UI with NaN or Infinity
    expect(MathHelper.toPiPrecision(null as any)).toBe(0);
    expect(MathHelper.calculateAlphaGain(undefined as any)).toBe(0);
    expect(MathHelper.toPiPrecision("Invalid" as any)).toBe(0);
  });
});
