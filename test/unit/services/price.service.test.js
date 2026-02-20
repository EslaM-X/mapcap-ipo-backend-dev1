/**
 * Price Engine Unit Tests - Scarcity Logic v1.6.2
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's "Water-Level" Model
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Validates the Dynamic Scarcity Engine. This suite ensures the 'Spot Price' 
 * maintains an inverse proportion between the Fixed Supply and Real-Time 
 * Pi Liquidity, providing deterministic data for the Pulse Dashboard.
 * -------------------------------------------------------------------------
 */

import { PriceService, IPO_MAPCAP_SUPPLY } from '../../../src/services/price.service.js';

describe('PriceService - Dynamic Scarcity Engine Tests', () => {

  /**
   * TEST: Fixed Supply Integrity
   * Requirement: Philip's Economic Model - Supply must be locked at 2,181,818.
   * Ensures the anchor for all valuation remains immutable.
   */
  test('Integrity: Should verify the IPO supply is locked at exactly 2,181,818', () => {
    expect(IPO_MAPCAP_SUPPLY).toBe(2181818);
    expect(PriceService.IPO_MAPCAP_SUPPLY).toBe(2181818);
  });

  /**
   * TEST: Spot Price Calculation (Inverse Scarcity)
   * Requirement: Price = Supply / Total Contributed Pi.
   * Scenario: Validating valuation for 500,000 Pi contribution.
   */
  test('Calculation: Should accurately calculate spot price as liquidity increases', () => {
    const totalPiInvested = 500000;
    const expectedPrice = IPO_MAPCAP_SUPPLY / totalPiInvested; // Result: 4.363636
    
    const actualPrice = PriceService.calculateDailySpotPrice(totalPiInvested);
    
    expect(actualPrice).toBe(expectedPrice);
    expect(actualPrice).not.toBeNaN();
  });

  /**
   * TEST: Zero-Liquidity Resilience
   * Requirement: Prevents division-by-zero errors or NaN in the UI.
   * Ensures the Dashboard displays 'Pending' state (0) when pool is empty.
   */
  test('Safety: Should return 0 for zero, null, or negative liquidity inputs', () => {
    expect(PriceService.calculateDailySpotPrice(0)).toBe(0);
    expect(PriceService.calculateDailySpotPrice(null)).toBe(0);
    expect(PriceService.calculateDailySpotPrice(-1000)).toBe(0);
  });

  /**
   * TEST: High-Fidelity Formatting (Daniel's Compliance)
   * Requirement: 6-decimal precision for ledger and audit records.
   */
  test('Formatting: Should standardize price to 6 decimal places for audit logs', () => {
    const rawPrice = 4.3636363636;
    const formatted = PriceService.formatPrice(rawPrice);
    
    expect(formatted).toBe("4.363636");
    expect(typeof formatted).toBe('string');
  });

  /**
   * TEST: UI/UX Pulse Dashboard Formatting
   * Requirement: Philip's UX Spec - Clean 4-decimal display for Pioneers.
   */
  test('UI/UX: Should format price to 4 decimal places for dashboard readability', () => {
    const rawPrice = 21.8181818;
    const expectedUI = "21.8182"; // Note: toFixed() rounds the last digit
    
    // Using 4-decimal precision as defined in v1.6.2 for display logic
    expect(PriceService.formatPriceForDisplay(rawPrice)).toBe("21.8182");
  });

  /**
   * TEST: Input Sanitization
   * Purpose: Prevents "NaN" or "undefined" from reaching the Frontend.
   */
  test('Sanitization: Should handle invalid numerical strings gracefully', () => {
    expect(PriceService.formatPrice(undefined)).toBe("0.000000");
    expect(PriceService.formatPrice("InvalidData")).toBe("0.000000");
    expect(PriceService.formatPriceForDisplay(null)).toBe("0.0000");
  });

});

