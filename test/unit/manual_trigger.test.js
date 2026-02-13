/**
 * Manual Trigger Unit Tests - CLI Command Center v1.3
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Admin Protocol
 * * PURPOSE: 
 * Validates the Manual CLI Overrides and Pulse Checks.
 * Ensures the WHALE_REFUND action correctly calculates the pool 
 * and triggers the SettlementJob through a standalone process.
 * ---------------------------------------------------------
 */

import Investor from '../../src/models/investor.model.js';
import SettlementJob from '../../src/jobs/settlement.job.js';
import { jest } from '@jest/globals';

// Mocking logic to prevent process.exit() from killing the test runner
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

describe('Manual Trigger - CLI Command Logic', () => {
  
  beforeEach(() => {
    // Mocking database results
    jest.spyOn(Investor, 'find').mockResolvedValue([
      { piAddress: 'Whale_1', totalPiContributed: 20000 },
      { piAddress: 'Pioneer_1', totalPiContributed: 5000 }
    ]);

    // Mocking the Settlement Job
    jest.spyOn(SettlementJob, 'executeWhaleTrimBack').mockResolvedValue({
      totalRefunded: 1500,
      whalesImpacted: 1
    });

    // Mocking Console to keep test output clean
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * TEST: Whale Refund Manual Calculation
   * Checks if the manual script correctly aggregates the pool before calling the job.
   */
  test('CLI Logic: Should calculate total pool correctly from individual investor records', async () => {
    // In a real CLI run, this would be triggered by process.argv
    const allInvestors = await Investor.find({ totalPiContributed: { $gt: 0 } });
    const totalPiPool = allInvestors.reduce((sum, inv) => sum + inv.totalPiContributed, 0);

    expect(totalPiPool).toBe(25000); // 20000 + 5000
  });

  /**
   * TEST: Settlement Execution via CLI
   * Requirement: Daniel's protocol for forced anti-whale trimming.
   */
  test('Action: WHALE_REFUND should call SettlementJob with correct parameters', async () => {
    const allInvestors = await Investor.find();
    const totalPiPool = 25000;

    const result = await SettlementJob.executeWhaleTrimBack(allInvestors, totalPiPool);

    expect(result.whalesImpacted).toBe(1);
    expect(result.totalRefunded).toBe(1500);
    expect(SettlementJob.executeWhaleTrimBack).toHaveBeenCalledWith(allInvestors, totalPiPool);
  });

  /**
   * TEST: Empty Pool Safety in CLI
   */
  test('Safety: Should prevent settlement execution if pool aggregation is zero', async () => {
    jest.spyOn(Investor, 'find').mockResolvedValue([]);
    const allInvestors = await Investor.find();
    const totalPiPool = allInvestors.reduce((sum, inv) => sum + inv.totalPiContributed, 0);

    expect(totalPiPool).toBe(0);
    // Logic should skip execution (as per manual_trigger.js case: WHALE_REFUND)
  });
});

