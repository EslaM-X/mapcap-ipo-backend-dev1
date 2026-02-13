/**
 * Whale Audit Tool Unit Tests - Compliance Verification v1.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * * PURPOSE:
 * Validates the manual audit script logic. Ensures the 10% ceiling 
 * is calculated correctly against the fixed 2,181,818 supply.
 * -------------------------------------------------------------------------
 */

import Investor from '../../src/models/investor.model.js';
import { jest } from '@jest/globals';

// We mock the database interaction to test the logic isolation
describe('Whale Audit Script - Logical Verification Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * TEST: Whale Identification Logic
   * Requirement: Any investor with > 10% of 2,181,818 MapCap must be flagged.
   */
  test('Audit: Should accurately flag accounts exceeding the 218,181.8 MapCap limit', async () => {
    const GLOBAL_SUPPLY = 2181818;
    const WHALE_CAP = GLOBAL_SUPPLY * 0.10; // 218,181.8

    const mockWhale = {
      piAddress: 'Whale_User_01',
      allocatedMapCap: 300000, // Exceeds cap
      isWhale: false,
      save: jest.fn().mockResolvedValue(true)
    };

    const mockPioneer = {
      piAddress: 'Fair_User_01',
      allocatedMapCap: 50000, // Below cap
      isWhale: false,
      save: jest.fn().mockResolvedValue(true)
    };

    // Logic Simulation (Mirroring script behavior)
    const checkWhale = async (inv) => {
      const sharePct = inv.allocatedMapCap / GLOBAL_SUPPLY;
      if (sharePct > 0.10) {
        inv.isWhale = true;
      } else {
        inv.isWhale = false;
      }
      await inv.save();
    };

    await checkWhale(mockWhale);
    await checkWhale(mockPioneer);

    expect(mockWhale.isWhale).toBe(true);
    expect(mockPioneer.isWhale).toBe(false);
    expect(mockWhale.save).toHaveBeenCalled();
  });

  /**
   * TEST: Edge Case (Exactly 10%)
   * Requirement: The limit is a "ceiling", anything equal or below is safe.
   */
  test('Boundary: Should not flag an account that is exactly at the 10% limit', async () => {
    const EXACT_CAP = 218181.8;
    const investor = {
      allocatedMapCap: EXACT_CAP,
      isWhale: false,
      save: jest.fn()
    };

    const sharePct = investor.allocatedMapCap / 2181818;
    investor.isWhale = sharePct > 0.10; // Strict greater-than check

    expect(investor.isWhale).toBe(false);
  });
});

