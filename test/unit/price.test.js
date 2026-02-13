/**
 * Price Engine Unit Tests - Spec-Compliant v1.5 (Precision Fixed)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's "Water-Level" Model
 * ---------------------------------------------------------
 * PURPOSE: 
 * Validates the Dynamic Pricing Engine. Ensures the 'Spot Price' 
 * correctly reflects the inverse proportion of the Fixed Supply 
 * vs Real-Time Pi Pool without NaN errors.
 */

import PriceService from '../../src/services/price.service.js';
import { jest } from '@jest/globals';

describe('MapCap Price Engine - Unit Tests', () => {

  /**
   * TEST: Water-Level Spot Price Calculation
   * Fix: Ensures 'supply' is correctly pulled from PriceService to avoid NaN.
   * Resolves: Expected: NaN | Received: 21.81818
   */
  test('Spot Price: Should accurately calculate price based on total Pi liquidity', () => {
    const totalPiInvested = 100000;
    
    // Ensure we are using the actual constant from the service
    const supply = PriceService.TOTAL_MAPCAP_SUPPLY || 2181818; 
    const expected = supply / totalPiInvested; // Result: 21.81818
    
    const result = PriceService.calculateDailySpotPrice(totalPiInvested);
    
    // Validation against the raw calculation
    expect(result).toBeCloseTo(expected, 5);
    expect(result).not.toBeNaN();
  });

  /**
   * TEST: Edge Case - Zero Liquidity
   * Requirement: Prevents financial dashboard crashes by returning 0 on empty pools.
   */
  test('Safety: Should return 0 if total Pi invested is zero or null', () => {
    expect(PriceService.calculateDailySpotPrice(0)).toBe(0);
    expect(PriceService.calculateDailySpotPrice(null)).toBe(0);
  });

  /**
   * TEST: UI/UX Formatting Precision
   * Requirement: Daniel's Compliance - Normalized 4-decimal string for the Dashboard.
   */
  test('Formatting: Should return a fixed 4-decimal string for UI display', () => {
    const rawPrice = 38.480335;
    const expectedFormat = "38.4803";
    expect(PriceService.formatPriceForDisplay(rawPrice)).toBe(expectedFormat);
  });

  /**
   * TEST: Handling Invalid Price Inputs
   * Purpose: Ensures "NaN" strings never reach the Frontend.
   */
  test('Formatting Safety: Should handle NaN or invalid numbers gracefully', () => {
    expect(PriceService.formatPriceForDisplay(undefined)).toBe("0.0000");
    expect(PriceService.formatPriceForDisplay("Invalid")).toBe("0.0000");
  });
});
