/**
 * Investor Model Unit Tests - Unified Logic v1.7.3
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Provides comprehensive validation for the Investor schema and virtuals.
 * This unified test ensures that dynamic IPO participation is preserved
 * while enforcing Daniel's Whale-Shield and vesting logic automatically.
 * -------------------------------------------------------------------------
 */

import Investor from '../../../src/models/investor.model.js';

describe('Investor Model - Unified Integrity & Logic Tests', () => {

  /**
   * SECTION 1: SCHEMA CONSTRAINTS (Daniel's Compliance)
   * Validates mandatory fields and financial boundaries.
   */
  describe('Schema Validation', () => {
    
    test('Validation: Should require a unique piAddress for ledger tracking', () => {
      const investor = new Investor({ totalPiContributed: 100 });
      const err = investor.validateSync();
      expect(err.errors.piAddress).toBeDefined();
    });

    test('Financials: Should reject negative Pi contributions to maintain integrity', () => {
      const investor = new Investor({ 
        piAddress: 'GBV...ADDR', 
        totalPiContributed: -50 
      });
      const err = investor.validateSync();
      expect(err.errors.totalPiContributed).toBeDefined();
    });

    test('Constraints: Should reject vestingMonthsCompleted exceeding 10-month limit', () => {
      const investor = new Investor({
        piAddress: 'Pioneer_Test',
        vestingMonthsCompleted: 11
      });
      const err = investor.validateSync();
      expect(err.errors.vestingMonthsCompleted).toBeDefined();
    });
  });

  /**
   * SECTION 2: PHILIP'S FLEXIBILITY (IPO Use Case)
   * Ensures the system remains fluid during the contribution period.
   */
  describe('IPO Flexibility Logic', () => {
    
    test('Flexibility: Should allow contributions to exceed 10% during IPO phase', () => {
      const highValueContribution = 500000; // Simulating a heavy stake
      const investor = new Investor({ 
        piAddress: 'GBV...WHALE', 
        totalPiContributed: highValueContribution 
      });
      const err = investor.validateSync();
      // Verified: Schema does not block high values; capping is handled by Settlement Job
      expect(err).toBeUndefined();
      expect(investor.totalPiContributed).toBe(highValueContribution);
    });

    test('Defaults: Should initialize pioneers with zero equity and non-whale status', () => {
      const investor = new Investor({ piAddress: 'GBV...ADDR' });
      expect(investor.totalPiContributed).toBe(0);
      expect(investor.isWhale).toBe(false);
    });
  });

  /**
   * SECTION 3: AUTOMATED VIRTUALS & FLAGS
   * Validates real-time calculations used by the Pulse Dashboard.
   */
  describe('Virtual Properties & Hooks', () => {

    test('Virtuals: sharePct should calculate accurately against 2.18M supply', () => {
      const investor = new Investor({
        allocatedMapCap: 21818.18 // Precisely 1%
      });
      // Verification of the 1% proportional share calculation
      expect(investor.sharePct).toBeCloseTo(1, 1);
    });

    test('Virtuals: remainingVesting should use Math.max to prevent negative display', () => {
      const investor = new Investor({
        allocatedMapCap: 1000,
        mapCapReleased: 1200 // Scenario: Accidental over-release
      });
      // Dashboard Protection: Ensures UI never shows negative assets
      expect(investor.remainingVesting).toBe(0);
    });

    test('Audit: Should automatically track lastContributionDate for reporting', () => {
      const investor = new Investor({ piAddress: 'GBV...ADDR' });
      expect(investor.lastContributionDate).toBeDefined();
      expect(investor.lastContributionDate instanceof Date).toBe(true);
    });
  });
});

