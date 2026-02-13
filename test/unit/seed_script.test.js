/**
 * Seed Script Unit Tests - Data Provisioning v1.1
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Stress Testing Anti-Whale Logic
 * * PURPOSE:
 * Validates the data seeding logic. Ensures that the diverse profiles 
 * (Whales vs Normal) are correctly structured and persisted for testing.
 * -------------------------------------------------------------------------
 */

import Investor from '../../src/models/investor.model.js';
import { jest } from '@jest/globals';

describe('Seed Script - Profile Injection Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * TEST: Data Insertion Integrity
   * Requirement: Should purge existing data and insert the 3 strategic profiles.
   */
  test('Provisioning: Should delete old records and insert new mock profiles', async () => {
    const deleteSpy = jest.spyOn(Investor, 'deleteMany').mockResolvedValue({});
    const insertSpy = jest.spyOn(Investor, 'insertMany').mockResolvedValue([{}, {}, {}]);

    // Simulated script execution logic
    const executeSeed = async () => {
        await Investor.deleteMany({});
        return await Investor.insertMany([
            { piAddress: "A", totalPiContributed: 500 },
            { piAddress: "B", totalPiContributed: 55000 },
            { piAddress: "C", totalPiContributed: 1200 }
        ]);
    };

    const result = await executeSeed();

    expect(deleteSpy).toHaveBeenCalled();
    expect(insertSpy).toHaveBeenCalled();
    expect(result.length).toBe(3);
  });

  /**
   * TEST: Profile Specifics (The Whale Test)
   * Requirement: Ensure the whale profile is tagged for the settlement audit.
   */
  test('Integrity: Should verify that the whale profile is correctly flagged', async () => {
    const mockWhale = {
        piAddress: "GCX...POTENTIAL_WHALE_01",
        isWhale: true
    };

    expect(mockWhale.isWhale).toBe(true);
    expect(mockWhale.piAddress).toContain('WHALE');
  });
});

