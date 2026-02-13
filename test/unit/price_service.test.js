/**
 * PriceService Unit Tests - Scarcity Engine v1.6.1 (Stabilized)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings (Compliance Page 4)
 * * PURPOSE:
 * 1. Validates the Inverse Proportion Pricing Model (Scarcity Engine).
 * 2. Ensures the 'Spot Price' correctly adjusts as liquidity grows.
 * 3. Enforces the fixed 2,181,818 supply ratio for economic stability.
 * ---------------------------------------------------------
 */

// Added curly braces for Named Export compatibility to resolve 'undefined' errors
// This ensures the test suite can see the constants and the class independently
import { PriceService, IPO_MAPCAP_SUPPLY } from '../../src/services/price.service.js';

describe('PriceService - Dynamic Pricing Logic Tests', () => {

  /**
   * TEST: Calculation Accuracy
   * Requirement: Formula (Price = IPO_SUPPLY / Total Pi).
   * Context: High-precision math check for 500,000 Pi contribution.
   */
  test('Calculation: Should return the correct spot price for 500,000 Pi', () => {
    const totalPi = 500000;
    // Calculation uses the direct constant for absolute accuracy
    const expectedPrice = IPO_MAPCAP_SUPPLY / totalPi; 
    
    const actualPrice = PriceService.calculateDailySpotPrice(totalPi);
    
    // Testing raw number accuracy before formatting
    expect(actualPrice).toBe(expectedPrice);
  });

  /**
   * TEST: Zero Liquidity Guard
   * Requirement: Prevent division by zero or negative results in the UI.
   */
  test('Safety: Should return 0 if totalPi is 0 or negative', () => {
    expect(PriceService.calculateDailySpotPrice(0)).toBe(0);
    expect(PriceService.calculateDailySpotPrice(-100)).toBe(0);
  });

  /**
   * TEST: Precision Formatting
   * Requirement: UI StatsPanel display requires strict 6-decimal string output.
   * This matches the updated PriceService.formatPrice method.
   */
  test('Formatting: Should format the price to exactly 6 decimal places', () => {
    const rawPrice = 4.363636363636;
    const formatted = PriceService.formatPrice(rawPrice);
    
    expect(formatted).toBe("4.363636");
    expect(typeof formatted).toBe('string');
  });

  /**
   * TEST: Supply Integrity
   * Requirement: Economic Audit - The IPO supply must remain locked at 2,181,818.
   * Resolves: The 'undefined' failure observed in previous test runs in Termux.
   */
  test('Integrity: Should maintain the fixed MapCap supply constant', () => {
    // Direct audit against the institutional-grade constant
    expect(IPO_MAPCAP_SUPPLY).toBe(2181818);
  });
});
