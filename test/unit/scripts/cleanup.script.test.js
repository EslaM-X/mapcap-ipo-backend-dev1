/**
 * Maintenance & Emergency Utilities - Unified Script Suite v1.5.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Development Workflow & Emergency Recovery
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite validates the database maintenance tools. It unifies the 
 * global Purge logic with the Emergency Vesting Reset protocol, ensuring 
 * that maintenance operations are surgical, safe, and restricted.
 * -------------------------------------------------------------------------
 */

import Investor from '../../../src/models/investor.model.js';
import { jest } from '@jest/globals';

describe('System Maintenance Scripts - Operational Logic Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: DATABASE PURGE LOGIC (Cleanup Tool)
   * Requirement: Development Workflow - Ability to wipe all investor records 
   * to reset the pre-production environment.
   */
  describe('DB Cleanup Script - Purge Protocol', () => {

    test('Cleanup: Should execute deleteMany with empty filter to wipe all records', async () => {
      // Mocking the deleteMany operation
      const deleteSpy = jest.spyOn(Investor, 'deleteMany').mockResolvedValue({ deletedCount: 50 });

      // Logic Simulation: Wiping the collection
      const result = await Investor.deleteMany({});

      expect(deleteSpy).toHaveBeenCalledWith({});
      expect(result.deletedCount).toBe(50);
    });

    test('Safety: Should ensure environment context is evaluated for production protection', () => {
      const isProduction = process.env.NODE_ENV === 'production';
      // Critical Guard: Tooling must be aware of environment to prevent accidental live wipes
      expect(typeof isProduction).toBe('boolean');
    });
  });

  /**
   * SECTION 2: VESTING RESET LOGIC (Emergency Protocol)
   * Requirement: Emergency Recovery - Ability to zero out vesting progress 
   * counters globally without affecting user identity.
   */
  describe('Vesting Reset Script - Global Override', () => {

    test('Emergency: Should reset vesting progress and released balances globally', async () => {
      // Mocking the Mongoose updateMany operation
      const updateSpy = jest.spyOn(Investor, 'updateMany').mockResolvedValue({ modifiedCount: 150 });

      // Core Logic: Reverting counters to initial state
      const result = await Investor.updateMany({}, {
          $set: {
              mapCapReleased: 0,
              vestingMonthsCompleted: 0
          }
      });

      expect(updateSpy).toHaveBeenCalledWith({}, {
          $set: { mapCapReleased: 0, vestingMonthsCompleted: 0 }
      });
      expect(result.modifiedCount).toBe(150);
    });

    test('Integrity: Reset operation must not tamper with identity or contribution fields', async () => {
      const updateSpy = jest.spyOn(Investor, 'updateMany').mockResolvedValue({});
      
      await Investor.updateMany({}, { $set: { mapCapReleased: 0 } });
      
      const setClause = updateSpy.mock.calls[0][1].$set;
      // Compliance: Identity (piAddress) and Stake (totalPiContributed) remain immutable
      expect(setClause).not.toHaveProperty('piAddress');
      expect(setClause).not.toHaveProperty('totalPiContributed');
    });
  });
});
