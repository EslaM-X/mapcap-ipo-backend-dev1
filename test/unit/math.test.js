/**
 * Math Engine Unit Tests - Spec-Compliant v1.4
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Audit: Daniel & Philip Compliance
 * * PURPOSE:
 * Validates the core financial logic of the MapCap Protocol.
 * Ensures that Alpha Gain calculations and Whale-Shield 10% 
 * caps are immutable and mathematically deterministic.
 * ---------------------------------------------------------
 */

import MathHelper from '../../src/utils/math.helper.js';

describe('MapCap Math Engine - Unit Tests', () => {
  
  /**
   * TEST: 20% Pioneer Alpha Gain
   * Requirement: Spec Page 4 - "20% Pioneer Uplift".
   */
  test('Alpha Gain: Should calculate exactly 20% increase', () => {
    const balance = 100;
    const expected = 120; // Implementation: balance * 1.20
    expect(MathHelper.calculateAlphaGain(balance)).toBe(expected);
  });

  /**
   * TEST: Whale-Shield Protocol (10% Cap)
   * Requirement: Daniel's Security Protocol - Prevents market dominance.
   */
  test('Whale-Shield: Should block stakes > 10% of total pool', () => {
    const userBalance = 11;
    const totalPool = 100;
    // An 11% share must fail the strict 10.000000% cap check.
    expect(MathHelper.isWithinCap(userBalance, totalPool)).toBe(false);
  });

  /**
   * TEST: High-Precision Normalization
   * Requirement: MapCap Financial Reporting Standard (6-decimal precision).
   */
  test('Precision: Should round to 6 decimal places without floating-point artifacts', () => {
    const value = 1.123456789;
    const expected = 1.123457; // Rounds correctly based on PRECISION_FACTOR = 1000000
    expect(MathHelper.toPiPrecision(value)).toBe(expected);
  });
});

