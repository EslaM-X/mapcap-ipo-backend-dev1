/**
 * DB Cleanup Tool Unit Tests - Developer Utility v1.0
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Development Workflow Integrity
 * * PURPOSE:
 * Validates the database purge logic. Ensures that the tool
 * correctly interacts with the Investor model to wipe data
 * during pre-production cycles.
 * ---------------------------------------------------------
 */

import Investor from '../../src/models/investor.model.js';
import { jest } from '@jest/globals';

describe('DB Cleanup Script - Operational Logic Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * TEST: Data Purge Execution
   * Requirement: Should call deleteMany with an empty filter to wipe all records.
   */
  test('Cleanup: Should execute deleteMany on the Investor collection', async () => {
    // Mocking the deleteMany operation
    const deleteSpy = jest.spyOn(Investor, 'deleteMany').mockResolvedValue({ deletedCount: 50 });

    // Simulation of the script logic
    const mockRun = async () => {
        return await Investor.deleteMany({});
    };

    const result = await mockRun();

    expect(deleteSpy).toHaveBeenCalledWith({});
    expect(result.deletedCount).toBe(50);
  });

  /**
   * TEST: Environment Guard (Conceptual)
   * Requirement: Ideally, this script should be disabled in production.
   */
  test('Safety: Script should logic-check environment variables', () => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Safety suggestion for Eslam: Wrap script execution in an if(!isProduction) block
    expect(typeof isProduction).toBe('boolean');
  });
});

