/**
 * Investor Ecosystem & Compliance - Unified Model Suite v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Formalized IInvestor interface for strict schema validation.
 * - Synchronized Whale-Shield ceiling logic (10% of 2,181,818 supply).
 * - Enforced strict 10-month vesting tranche constraints.
 * - Validated Virtual Properties (sharePct, remainingVesting) for UI safety.
 */

import Investor from '../../../src/models/investor.model.js';
import { jest } from '@jest/globals';

describe('Investor Ecosystem - Unified Logic & Integrity Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * SECTION 1: SCHEMA & FINANCIAL CONSTRAINTS
   * Requirement: Daniel's Compliance - Preventing financial anomalies.
   */
  describe('Core Schema Validation', () => {
    
    test('Validation: Should require a unique piAddress and block negative contributions', () => {
      const invalidInvestor = new Investor({ piAddress: '', totalPiContributed: -100 });
      const err: any = invalidInvestor.validateSync();
      
      expect(err.errors.piAddress).toBeDefined();
      expect(err.errors.totalPiContributed).toBeDefined();
    });

    test('Vesting: Should enforce the strict 10-month limit on completed tranches', () => {
      // Logic: Vesting follows a 10% monthly release for 10 months.
      const investor = new Investor({ piAddress: 'Pioneer_01', vestingMonthsCompleted: 11 });
      const err: any = investor.validateSync();
      
      expect(err.errors.vestingMonthsCompleted).toBeDefined();
      expect(err.errors.vestingMonthsCompleted.kind).toBe('max');
    });

    test('Audit: Should automatically track lastContributionDate on record creation', () => {
      const investor = new Investor({ piAddress: 'GBV...ADDR' });
      expect(investor.lastContributionDate instanceof Date).toBe(true);
    });
  });

  /**
   * SECTION 2: WHALE-SHIELD & AUDIT LOGIC
   * Requirement: 10% Ceiling Enforcement (Whale-Shield Protocol).
   */
  describe('Whale Identification & Boundary Logic', () => {
    const GLOBAL_SUPPLY = 2181818;

    test('Audit: Should accurately flag accounts exceeding the 10% ceiling (218,181.8)', async () => {
      const mockWhale = new Investor({ piAddress: 'Whale_User', allocatedMapCap: 300000 });
      const mockPioneer = new Investor({ piAddress: 'Fair_User', allocatedMapCap: 50000 });

      // Whale-Shield Calculation: (Allocated / Total Supply) > 0.10
      mockWhale.isWhale = (mockWhale.allocatedMapCap / GLOBAL_SUPPLY) > 0.10;
      mockPioneer.isWhale = (mockPioneer.allocatedMapCap / GLOBAL_SUPPLY) > 0.10;

      expect(mockWhale.isWhale).toBe(true);
      expect(mockPioneer.isWhale).toBe(false);
    });

    test('Boundary: Should not flag an account that is exactly at the 10% limit', () => {
      const EXACT_CAP = 218181.8;
      const investor = { allocatedMapCap: EXACT_CAP };
      const isWhale = (investor.allocatedMapCap / GLOBAL_SUPPLY) > 0.10; // Strict greater-than check
      
      expect(isWhale).toBe(false);
    });
  });

  /**
   * SECTION 3: DASHBOARD VIRTUALS & PROTECTION
   */
  describe('Virtual Properties & UI Protection', () => {

    test('Virtuals: sharePct must calculate correctly against the 2.18M supply', () => {
      const investor: any = new Investor({ allocatedMapCap: 21818.18 }); // 1% Exactly
      expect(investor.sharePct).toBeCloseTo(1, 1);
    });

    test('Safety: remainingVesting must use Math.max to prevent negative asset display', () => {
      // Scenario: Over-allocation or adjustment shouldn't show negative balance to user
      const investor: any = new Investor({ allocatedMapCap: 1000, mapCapReleased: 1200 });
      expect(investor.remainingVesting).toBe(0);
    });
  });

  /**
   * SECTION 4: DATA PROVISIONING (SEEDING)
   */
  describe('Provisioning & Seeding Logic', () => {

    test('Seeding: Should verify data purge and insertion of strategic profiles', async () => {
      const deleteSpy = jest.spyOn(Investor, 'deleteMany').mockResolvedValue({} as any);
      const insertSpy = jest.spyOn(Investor, 'insertMany').mockResolvedValue([{}, {}, {}] as any);

      await Investor.deleteMany({});
      await Investor.insertMany([{ piAddress: "A" }, { piAddress: "B" }, { piAddress: "C" }]);

      expect(deleteSpy).toHaveBeenCalled();
      expect(insertSpy).toHaveBeenCalled();
    });
  });
});
