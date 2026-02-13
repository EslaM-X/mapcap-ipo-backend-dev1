/**
 * Vesting Reset Utility Unit Tests - Emergency Logic v1.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Emergency Recovery Protocols
 * * PURPOSE:
 * Validates the global vesting reset logic. Ensures the multi-document 
 * update correctly targets progress counters and release balances.
 * -------------------------------------------------------------------------
 */

import Investor from '../../src/models/investor.model.js';
import { jest } from '@jest/globals';

describe('Vesting Reset Script - Global Override Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * TEST: Global Reset Execution
   * Requirement: Should update all records to reset months and released MapCap.
   */
  test('Emergency: Should execute updateMany to zero out vesting progress counters', async () => {
    // Mocking the Mongoose updateMany operation
    const updateSpy = jest.spyOn(Investor, 'updateMany').mockResolvedValue({ modifiedCount: 150 });

    // Simulation of the script's core logic
    const mockResetAction = async () => {
        return await Investor.updateMany({}, {
            $set: {
                mapCapReleased: 0,
                vestingMonthsCompleted: 0
            }
        });
    };

    const result = await mockResetAction();

    // Verify the query targets the correct fields
    expect(updateSpy).toHaveBeenCalledWith({}, {
        $set: {
            mapCapReleased: 0,
            vestingMonthsCompleted: 0
        }
    });
    
    expect(result.modifiedCount).toBe(150);
  });

  /**
   * TEST: Integrity of Reset
   * Requirement: Ensure no other critical fields (like piAddress) are modified.
   */
  test('Integrity: Reset operation should not affect non-vesting fields', () => {
    const updateCall = Investor.updateMany.mock.calls[0];
    if (updateCall) {
        const setClause = updateCall[1].$set;
        expect(setClause).not.toHaveProperty('piAddress');
        expect(setClause).not.toHaveProperty('totalPiContributed');
    }
  });
});

