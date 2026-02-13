/**
 * Settlement Job Unit Tests - Precision Engine v1.7 (ESM Stabilized)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * ---------------------------------------------------------
 * PURPOSE: 
 * Validates the Final Whale Trim-Back logic. Ensures precision math 
 * is applied and PayoutService is triggered correctly for excess Pi 
 * returns while maintaining Node.js ESM compatibility.
 */

import { jest } from '@jest/globals';

// High-level Mocking for ESM Compatibility
jest.unstable_mockModule('../../src/services/payout.service.js', () => ({
  default: {
    executeA2UPayout: jest.fn()
  }
}));

// Dynamic Imports after Mocking to satisfy ESM requirements
const { default: SettlementJob } = await import('../../src/jobs/settlement.job.js');
const { default: PayoutService } = await import('../../src/services/payout.service.js');
const { default: MathHelper } = await import('../../src/utils/math.helper.js');

describe('Settlement Job - Anti-Whale Logic Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * TEST: Whale Identification & Refund Calculation
   * Fix: Ensures 6-decimal precision matches the financial ledger output.
   * Resolves: Math precision mismatch in settlement cycles.
   */
  test('Enforcement: Should identify whales and calculate excess Pi with 6-decimal precision', async () => {
    const totalPool = 100000;
    const threshold = 10000; // 10% of 100k cap

    const mockInvestors = [
      { 
        piAddress: 'Whale_001', 
        totalPiContributed: 15000.5555555, // 5,000.5555555 excess
        save: jest.fn().mockResolvedValue(true) 
      },
      { 
        piAddress: 'Pioneer_001', 
        totalPiContributed: 5000, // Compliant - within cap
        save: jest.fn().mockResolvedValue(true) 
      }
    ];

    PayoutService.executeA2UPayout.mockResolvedValue({ success: true });

    const result = await SettlementJob.executeWhaleTrimBack(mockInvestors, totalPool);

    // 1. Check if the PayoutService was called for the whale only
    expect(PayoutService.executeA2UPayout).toHaveBeenCalledTimes(1);
    
    // 2. Verify precise refund calculation using the core MathHelper
    const expectedRefund = MathHelper.toPiPrecision(5000.5555555);
    expect(PayoutService.executeA2UPayout).toHaveBeenCalledWith('Whale_001', expectedRefund);

    // 3. Verify Database Update & Whale Status Flag
    expect(mockInvestors[0].totalPiContributed).toBe(threshold);
    expect(mockInvestors[0].isWhale).toBe(true);
    expect(result.totalRefunded).toBe(expectedRefund);
  });

  /**
   * TEST: Fault Tolerance & Resilience
   * Requirement: Daniel's Compliance - Job must not crash if a single payout fails.
   */
  test('Resilience: Should continue processing even if one whale payout fails', async () => {
    const totalPool = 100000;
    const mockInvestors = [
      { piAddress: 'Whale_A', totalPiContributed: 20000, save: jest.fn() },
      { piAddress: 'Whale_B', totalPiContributed: 20000, save: jest.fn() }
    ];

    // Simulating a network failure on the first attempt
    PayoutService.executeA2UPayout
      .mockRejectedValueOnce(new Error('A2U Pipeline Timeout'))
      .mockResolvedValue({ success: true });

    await SettlementJob.executeWhaleTrimBack(mockInvestors, totalPool);

    // Should be called twice to ensure second whale was not skipped
    expect(PayoutService.executeA2UPayout).toHaveBeenCalledTimes(2);
  });
});
