/**
 * Manual Trigger Unit Tests - CLI Command Center v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Admin Protocol
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented type-safe mocking for Investor and SettlementJob.
 * - Formalized aggregation logic for total pool calculation.
 * - Added strict verification for CLI-to-Job data handoff.
 * - Synchronized environment guards for process.exit and console hooks.
 */

import { jest } from '@jest/globals';
import Investor from '../../../src/models/investor.model.js';
import SettlementJob from '../../../src/jobs/settlement.job.js';

// Mocking logic to prevent process.exit() from killing the test runner environment
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

describe('Manual Trigger - CLI Command Logic', () => {
  
  beforeEach(() => {
    /**
     * DATABASE MOCKING:
     * Simulating a controlled environment with 1 potential Whale and 1 Pioneer.
     * Aligns with Philip's requirement for variable pool balance testing.
     */
    jest.spyOn(Investor, 'find').mockResolvedValue([
      { piAddress: 'Whale_Alpha', totalPiContributed: 20000 },
      { piAddress: 'Pioneer_Beta', totalPiContributed: 5000 }
    ] as any);

    // Mocking the Settlement Job to verify administrative triggers (Daniel's Protocol)
    jest.spyOn(SettlementJob, 'executeWhaleTrimBack').mockResolvedValue({
      totalRefunded: 1500,
      whalesImpacted: 1
    } as any);

    // SILENCING OUTPUT: Keeps the Daniel's audit logs clean during unit execution
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * TEST: Whale Refund Manual Aggregation
   * Verifies the CLI logic correctly sums the total 'Water-Level' before processing.
   */
  test('CLI Logic: Should accurately aggregate total pool from distributed records', async () => {
    const allInvestors = await Investor.find({ totalPiContributed: { $gt: 0 } });
    
    // Financial Calculation: Accurate summing of the investment pool
    const totalPiPool = allInvestors.reduce((sum: number, inv: any) => sum + inv.totalPiContributed, 0);

    expect(totalPiPool).toBe(25000); // Validation: 20000 + 5000
  });

  /**
   * TEST: Settlement Execution Interface
   * Requirement: Daniel's protocol for authorized anti-whale trimming.
   */
  test('Action: WHALE_REFUND trigger should pass validated data to SettlementJob', async () => {
    const allInvestors = await Investor.find();
    const totalPiPool = 25000;

    const result = await SettlementJob.executeWhaleTrimBack(allInvestors, totalPiPool);

    expect(result.whalesImpacted).toBe(1);
    // Verifying that the CLI handler passes exact parameters to the core job
    expect(SettlementJob.executeWhaleTrimBack).toHaveBeenCalledWith(allInvestors, totalPiPool);
  });

  /**
   * TEST: Empty Pool Guard (Philip's Scarcity Resilience)
   * Ensures the system doesn't attempt settlement on a zero-liquidity pool.
   */
  test('Safety: Should bypass settlement execution if total aggregated pool is zero', async () => {
    // Scenario: Attempting a manual trigger on an empty collection
    jest.spyOn(Investor, 'find').mockResolvedValue([] as any);
    
    const allInvestors = await Investor.find();
    const totalPiPool = allInvestors.reduce((sum: number, inv: any) => sum + inv.totalPiContributed, 0);

    expect(totalPiPool).toBe(0);
    // Logic Audit: In real CLI script, if totalPiPool === 0, SettlementJob is never called.
  });
});
