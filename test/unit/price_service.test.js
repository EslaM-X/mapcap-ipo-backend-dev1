/**
 * PriceService Unit Tests - Scarcity Engine v1.3
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings (Page 4)
 * * PURPOSE:
 * Validates the Inverse Proportion Pricing Model.
 * Ensures the 'Spot Price' correctly adjusts as liquidity grows
 * and maintains the fixed 2,181,818 supply ratio.
 * ---------------------------------------------------------
 */

import PriceService from '../../src/services/price.service.js';

describe('PriceService - Dynamic Pricing Logic Tests', () => {

  /**
   * TEST: Calculation Accuracy
   * Requirement: Price = 2,181,818 / Total Pi.
   * Scenario: 500,000 Pi contributed.
   */
  test('Calculation: Should return the correct spot price for 500,000 Pi', () => {
    const totalPi = 500000;
    const expectedPrice = PriceService.IPO_MAPCAP_SUPPLY / totalPi; // 4.363636...
    
    const actualPrice = PriceService.calculateDailySpotPrice(totalPi);
    
    expect(actualPrice).toBe(expectedPrice);
  });

  /**
   * TEST: Zero Liquidity Guard
   * Requirement: Should return 0 if no Pi has been invested yet.
   */
  test('Safety: Should return 0 if totalPi is 0 or negative', () => {
    expect(PriceService.calculateDailySpotPrice(0)).toBe(0);
    expect(PriceService.calculateDailySpotPrice(-100)).toBe(0);
  });

  /**
   * TEST: Precision Formatting
   * Requirement: UI requires 6-decimal precision for the StatsPanel.
   */
  test('Formatting: Should format the price to exactly 6 decimal places', () => {
    const rawPrice = 4.363636363636;
    const formatted = PriceService.formatPrice(rawPrice);
    
    expect(formatted).toBe("4.363636");
    expect(typeof formatted).toBe('string');
  });

  /**
   * TEST: Supply Integrity
   * Requirement: The IPO supply must remain fixed at 2,181,818.
   */
  test('Integrity: Should maintain the fixed MapCap supply constant', () => {
    expect(PriceService.IPO_MAPCAP_SUPPLY).toBe(2181818);
  });
});

