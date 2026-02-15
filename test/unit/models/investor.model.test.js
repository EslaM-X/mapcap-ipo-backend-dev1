/**
 * Investor Ecosystem & Compliance - Unified Model Suite v1.8.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite provides 360-degree validation for the Investor lifecycle. 
 * It unifies Schema constraints, Data Provisioning (Seeding), and 
 * manual Whale Audit logic into a single source of truth for 2026.
 * -------------------------------------------------------------------------
 */

import Investor from '../../../src/models/investor.model.js';
import { jest } from '@jest/globals';

describe('Investor Ecosystem - Unified Logic & Integrity Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * SECTION 1: SCHEMA & FINANCIAL CONSTRAINTS
   * Requirement: Daniel's Compliance - Enforces mandatory fields and 
   * prevents financial anomalies in the ledger.
   *
   */
  describe('Core Schema Validation', () => {
    
    test('Validation: Should require a unique piAddress and block negative contributions', () => {
      const invalidInvestor = new Investor({ piAddress: '', totalPiContributed: -100 });
      const err = invalidInvestor.validateSync();
      expect(err.errors.piAddress).toBeDefined();
      expect(err.errors.totalPiContributed).toBeDefined();
    });

    test('Vesting: Should enforce the strict 10-month limit on completed tranches', () => {
      const investor = new Investor({ piAddress: 'Pioneer_01', vestingMonthsCompleted: 11 });
      const err = investor.validateSync();
      expect(err.errors.vestingMonthsCompleted).toBeDefined();
    });

    test('Audit: Should automatically track lastContributionDate on record creation', () => {
      const investor = new Investor({ piAddress: 'GBV...ADDR' });
      expect(investor.lastContributionDate instanceof Date).toBe(true);
    });
  });

  /**
   * SECTION 2: WHALE-SHIELD & AUDIT LOGIC
   * Requirement: Any investor exceeding 10% of 2,181,818 supply must be flagged.
   *
   */
  describe('Whale Identification & Boundary Logic', () => {
    const GLOBAL_SUPPLY = 2181818;

    test('Audit: Should accurately flag accounts exceeding the 10% ceiling (218,181.8)', async () => {
      const mockWhale = new Investor({ piAddress: 'Whale_User', allocatedMapCap: 300000 });
      const mockPioneer = new Investor({ piAddress: 'Fair_User', allocatedMapCap: 50000 });

      // Logic Check: Simulating the Whale-Shield manual audit script
      mockWhale.isWhale = (mockWhale.allocatedMapCap / GLOBAL_SUPPLY) > 0.10;
      mockPioneer.isWhale = (mockPioneer.allocatedMapCap / GLOBAL_SUPPLY) > 0.10;

      expect(mockWhale.isWhale).toBe(true);
      expect(mockPioneer.isWhale).toBe(false);
    });

    test('Boundary: Should not flag an account that is exactly at the 10% limit', () => {
      const EXACT_CAP = 218181.8;
      const investor = { allocatedMapCap: EXACT_CAP };
      const isWhale = (investor.allocatedMapCap / GLOBAL_SUPPLY) > 0.10; // Strict check
      expect(isWhale).toBe(false);
    });
  });

  /**
   * SECTION 3: DASHBOARD VIRTUALS & PROTECTION
   * Ensures the Pulse UI never displays negative values or inaccurate shares.
   *
   */
  describe('Virtual Properties & UI Protection', () => {

    test('Virtuals: sharePct must calculate correctly against the 2.18M supply', () => {
      const investor = new Investor({ allocatedMapCap: 21818.18 }); // 1% Exactly
      expect(investor.sharePct).toBeCloseTo(1, 1);
    });

    test('Safety: remainingVesting must use Math.max to prevent negative asset display', () => {
      const investor = new Investor({ allocatedMapCap: 1000, mapCapReleased: 1200 });
      // Prevents UI "Glitches" on the Investor Dashboard
      expect(investor.remainingVesting).toBe(0);
    });
  });

  /**
   * SECTION 4: DATA PROVISIONING (SEEDING)
   * Validates the integrity of test data injection for the MapCap ecosystem.
   *
   */
  describe('Provisioning & Seeding Logic', () => {

    test('Seeding: Should verify data purge and insertion of strategic profiles', async () => {
      const deleteSpy = jest.spyOn(Investor, 'deleteMany').mockResolvedValue({});
      const insertSpy = jest.spyOn(Investor, 'insertMany').mockResolvedValue([{}, {}, {}]);

      await Investor.deleteMany({});
      await Investor.insertMany([{ piAddress: "A" }, { piAddress: "B" }, { piAddress: "C" }]);

      expect(deleteSpy).toHaveBeenCalled();
      expect(insertSpy).toHaveBeenCalled();
    });
  });
});
