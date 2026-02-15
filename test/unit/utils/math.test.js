/**
 * Math Engine Unit Tests - Spec-Compliant v1.4.2
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Audit: Daniel & Philip Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Validates the core financial logic of the MapCap Protocol.
 * Ensures that Alpha Gain calculations and Whale-Shield 10% 
 * benchmarks are mathematically deterministic and persistent.
 * -------------------------------------------------------------------------
 */

import MathHelper from '../../../src/utils/math.helper.js';

describe('MapCap Math Engine - Unit Tests', () => {
  
  /**
   * TEST: 20% Pioneer Alpha Gain
   * Requirement: Philip's Spec Page 4 - "20% Pioneer Uplift".
   * Ensures the uplift logic is applied correctly to the base contribution.
   */
  test('Alpha Gain: Should calculate exactly 20% increase', () => {
    const balance = 100;
    const expected = 120; // Verification: (balance * 1.20)
    expect(MathHelper.calculateAlphaGain(balance)).toBe(expected);
  });

  /**
   * TEST: Whale-Shield Advisory Benchmark (10% Cap)
   * Requirement: Compliance Check for Decentralization Ceiling.
   * NOTE: Validates logic flagging without blocking IPO-phase liquidity.
   */
  test('Whale-Shield: Should accurately flag stakes exceeding 10% threshold', () => {
    const userBalance = 11;
    const totalPool = 100;
    // An 11% share must trigger a 'false' on the within-cap verification.
    expect(MathHelper.isWithinCap(userBalance, totalPool)).toBe(false);
  });

  /**
   * TEST: High-Precision Normalization (6-Decimal Standard)
   * Requirement: Daniel's Financial Integrity Audit.
   * Eliminates floating-point anomalies for blockchain-ready reporting.
   */
  test('Precision: Should round to 6 decimal places with zero artifacts', () => {
    const value = 1.123456789;
    const expected = 1.123457; // Implementation: precision-factor scaling
    expect(MathHelper.toPiPrecision(value)).toBe(expected);
  });

  /**
   * TEST: System Resilience (Null/Undefined Guards)
   * Purpose: Prevents system crashes during asynchronous data fetching.
   */
  test('Resilience: Should return 0 for non-numerical inputs', () => {
    expect(MathHelper.toPiPrecision(null)).toBe(0);
    expect(MathHelper.calculateAlphaGain(undefined)).toBe(0);
  });
});
