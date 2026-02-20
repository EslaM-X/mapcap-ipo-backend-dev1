/**
 * Price Engine Unit Tests - Scarcity Logic v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's "Water-Level" Model
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Formalized PriceService static method signatures for TypeScript.
 * - Synchronized 6-decimal vs 4-decimal precision requirements.
 * - Implemented strict type checking for liquidity inputs (null, undefined, NaN).
 * - Validated rounding logic in formatPriceForDisplay (toFixed(4)).
 */

import { PriceService, IPO_MAPCAP_SUPPLY } from '../../../src/services/price.service.js';

describe('PriceService - Dynamic Scarcity Engine Tests', () => {

  /**
   * TEST: Fixed Supply Integrity
   * Requirement: Philip's Economic Model - Anchor supply must be immutable.
   */
  test('Integrity: Should verify the IPO supply is locked at exactly 2,181,818', () => {
    expect(IPO_MAPCAP_SUPPLY).toBe(2181818);
    // Ensuring the static property on the service is also synchronized
    expect((PriceService as any).IPO_MAPCAP_SUPPLY).toBe(2181818);
  });

  /**
   * TEST: Spot Price Calculation (Inverse Scarcity)
   * Formula: Price = Total Supply / Total Contributed Pi
   */
  test('Calculation: Should accurately calculate spot price as liquidity increases', () => {
    const totalPiInvested = 500000;
    const expectedPrice = IPO_MAPCAP_SUPPLY / totalPiInvested; // Result: 4.363636
    
    const actualPrice = PriceService.calculateDailySpotPrice(totalPiInvested);
    
    expect(actualPrice).toBe(expectedPrice);
    expect(actualPrice).not.toBeNaN();
  });

  /**
   * TEST: Zero-Liquidity Resilience (UI Guard)
   * Prevents division-by-zero or NaN states in the 'Pulse Dashboard'.
   */
  test('Safety: Should return 0 for zero, null, or negative liquidity inputs', () => {
    expect(PriceService.calculateDailySpotPrice(0)).toBe(0);
    expect(PriceService.calculateDailySpotPrice(null as any)).toBe(0);
    expect(PriceService.calculateDailySpotPrice(-1000)).toBe(0);
  });

  /**
   * TEST: High-Fidelity Formatting (Daniel's Compliance)
   * Requirement: 6-decimal precision for internal ledger and audit transparency.
   */
  test('Formatting: Should standardize price to 6 decimal places for audit logs', () => {
    const rawPrice = 4.3636363636;
    const formatted = PriceService.formatPrice(rawPrice);
    
    expect(formatted).toBe("4.363636");
    expect(typeof formatted).toBe('string');
  });

  /**
   * TEST: UI/UX Pulse Dashboard Formatting
   * Requirement: Clean 4-decimal display for Pioneers (UX Readability).
   */
  test('UI/UX: Should format price to 4 decimal places for dashboard readability', () => {
    const rawPrice = 21.8181818;
    // toFixed(4) rounds 21.81818... up to 21.8182
    const expectedUI = "21.8182"; 
    
    expect(PriceService.formatPriceForDisplay(rawPrice)).toBe(expectedUI);
  });

  /**
   * TEST: Input Sanitization
   * Purpose: Prevents system errors from invalid data types.
   */
  test('Sanitization: Should handle invalid numerical values gracefully', () => {
    expect(PriceService.formatPrice(undefined as any)).toBe("0.000000");
    expect(PriceService.formatPrice("InvalidData" as any)).toBe("0.000000");
    expect(PriceService.formatPriceForDisplay(null as any)).toBe("0.0000");
  });

});
