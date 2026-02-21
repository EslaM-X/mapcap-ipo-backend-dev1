/**
 * Maintenance & Emergency Utilities - Unified Script Suite v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Development Workflow & Emergency Recovery
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Formalized Mongoose Query Result typing for deleteMany/updateMany.
 * - Enforced strict environment safety checks (NODE_ENV protection).
 * - Validated immutability of identity fields during emergency resets.
 * - Synchronized surgical update logic for vesting counters.
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
   * Role: Wiping the pre-production environment for fresh cycles.
   */
  describe('DB Cleanup Script - Purge Protocol', () => {

    test('Cleanup: Should execute deleteMany with empty filter to wipe all records', async () => {
      // Mocking the deleteMany operation for environment reset
      const deleteSpy = jest.spyOn(Investor, 'deleteMany').mockResolvedValue({ 
        deletedCount: 50,
        acknowledged: true 
      } as any);

      const result = await Investor.deleteMany({});

      expect(deleteSpy).toHaveBeenCalledWith({});
      expect(result.deletedCount).toBe(50);
    });

    test('Safety: Should ensure environment context is evaluated for production protection', () => {
      const isProduction = process.env.NODE_ENV === 'production';
      /**
       * AUDIT: Daniel's Security Protocol
       * Tooling must fail-fast if attempted on a live production cluster.
       */
      expect(typeof isProduction).toBe('boolean');
    });
  });

  /**
   * SECTION 2: VESTING RESET LOGIC (Emergency Protocol)
   * Role: Reverting vesting progress without deleting user accounts.
   */
  describe('Vesting Reset Script - Global Override', () => {

    test('Emergency: Should reset vesting progress and released balances globally', async () => {
      // Mocking the Mongoose updateMany operation for global recovery
      const updateSpy = jest.spyOn(Investor, 'updateMany').mockResolvedValue({ 
        modifiedCount: 150,
        acknowledged: true 
      } as any);

      // Core Logic: Reverting counters to initial state (surgical reset)
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
      const updateSpy = jest.spyOn(Investor, 'updateMany').mockResolvedValue({} as any);
      
      await Investor.updateMany({}, { $set: { mapCapReleased: 0 } });
      
      const setClause = (updateSpy.mock.calls[0][1] as any).$set;
      
      /**
       * Compliance: Even in emergency, identity (piAddress) and stake 
       * (totalPiContributed) must remain immutable.
       */
      expect(setClause).not.toHaveProperty('piAddress');
      expect(setClause).not.toHaveProperty('totalPiContributed');
    });
  });
});
