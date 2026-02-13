/**
 * Price Engine Unit Tests - Spec-Compliant v1.4
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's "Water-Level" Model
 * * PURPOSE:
 * Validates the Dynamic Pricing Engine.
 * Ensures the 'Spot Price' correctly reflects the inverse 
 * proportion of the Fixed Supply vs Real-Time Pi Pool.
 * ---------------------------------------------------------
 */

import PriceService from '../../src/services/price.service.js';

describe('MapCap Price Engine - Unit Tests', () => {

  /**
   * TEST: Water-Level Spot Price Calculation
   * Requirement: Spot Price = TOTAL_SUPPLY / totalPiInvested
   */
  test('Spot Price: Should accurately calculate price based on total Pi liquidity', () => {
    const totalPiInvested = 100000;
    const supply = PriceService.TOTAL_MAPCAP_SUPPLY; // 2181818
    const expected = supply / totalPiInvested; // 21.81818
    
    expect(PriceService.calculateDailySpotPrice(totalPiInvested)).toBe(expected);
  });

  /**
   * TEST: Edge Case - Zero Liquidity
   * Purpose: Prevents division by zero or NaN results in the Dashboard.
   */
  test('Safety: Should return 0 if total Pi invested is zero or null', () => {
    expect(PriceService.calculateDailySpotPrice(0)).toBe(0);
    expect(PriceService.calculateDailySpotPrice(null)).toBe(0);
  });

  /**
   * TEST: UI/UX Formatting Precision
   * Requirement: Normalized 4-decimal string for the "IPO Pulse Dashboard".
   */
  test('Formatting: Should return a fixed 4-decimal string for UI display', () => {
    const rawPrice = 38.480335;
    const expectedFormat = "38.4803";
    expect(PriceService.formatPriceForDisplay(rawPrice)).toBe(expectedFormat);
  });

  /**
   * TEST: Handling Invalid Price Inputs
   * Purpose: Ensures UI doesn't break with "NaN" strings.
   */
  test('Formatting Safety: Should handle NaN or invalid numbers gracefully', () => {
    expect(PriceService.formatPriceForDisplay(undefined)).toBe("0.0000");
    expect(PriceService.formatPriceForDisplay("Invalid")).toBe("0.0000");
  });
});

