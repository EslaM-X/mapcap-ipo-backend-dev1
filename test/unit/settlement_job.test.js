/**
 * Settlement Job Unit Tests - Anti-Whale Refund Engine v1.6
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Validates the High-Precision Whale Trim-Back Protocol.
 * Ensures that excess Pi is truncated accurately and that 
 * the PayoutService is triggered via the A2UaaS pipeline.
 * ---------------------------------------------------------
 */

import SettlementJob from '../../src/jobs/settlement.job.js';
import PayoutService from '../../src/services/payout.service.js';
import { jest } from '@jest/globals';

describe('Settlement Job - High-Precision Logic Tests', () => {
  
  beforeEach(() => {
    // Mocking PayoutService to prevent actual blockchain transfers
    jest.spyOn(PayoutService, 'executeA2UPayout').mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * TEST: Whale Trim-Back Accuracy
   * Requirement: Any pioneer > 10% of pool must be capped and the rest refunded.
   */
  test('Enforcement: Should accurately calculate and refund excess Pi using 6-decimal precision', async () => {
    const totalPool = 100000;
    const threshold = 10000; // 10% of 100k

    const mockInvestors = [
      { 
        piAddress: 'Whale_Pioneer_001', 
        totalPiContributed: 15000.5555555, // 5000.5555555 excess
        save: jest.fn().mockResolvedValue(true) 
      }
    ];

    const result = await SettlementJob.executeWhaleTrimBack(mockInvestors, totalPool);

    // 1. Check if the payout service was called with the exact excess
    expect(PayoutService.executeA2UPayout).toHaveBeenCalledWith(
        'Whale_Pioneer_001', 
        5000.555556 // Based on 6-decimal MathHelper precision logic
    );

    // 2. Check if the investor's ledger was capped
    expect(mockInvestors[0].totalPiContributed).toBe(threshold);
    expect(mockInvestors[0].isWhale).toBe(true);
    expect(result.whalesImpacted).toBe(1);
  });

  /**
   * TEST: Multi-Whale Processing & Aggregate Totals
   */
  test('Aggregation: Should correctly track total refunded Pi across multiple whales', async () => {
    const totalPool = 100000;
    const mockInvestors = [
      { piAddress: 'Whale_1', totalPiContributed: 12000, save: jest.fn() },
      { piAddress: 'Whale_2', totalPiContributed: 13000, save: jest.fn() }
    ];

    const result = await SettlementJob.executeWhaleTrimBack(mockInvestors, totalPool);

    // (12000-10000) + (13000-10000) = 5000
    expect(result.totalRefunded).toBe(5000);
    expect(result.whalesImpacted).toBe(2);
  });

  /**
   * TEST: Critical Failure Isolation
   * Requirement: One failed payout should NOT stop other settlements.
   */
  test('Resilience: Should continue to process other whales if one payout fails', async () => {
    jest.spyOn(PayoutService, 'executeA2UPayout')
        .mockRejectedValueOnce(new Error('Network Congestion'))
        .mockResolvedValue({ success: true });

    const mockInvestors = [
        { piAddress: 'Whale_A', totalPiContributed: 20000, save: jest.fn() },
        { piAddress: 'Whale_B', totalPiContributed: 20000, save: jest.fn() }
    ];

    await SettlementJob.executeWhaleTrimBack(mockInvestors, 100000);

    // Should be called for both even if the first one fails
    expect(PayoutService.executeA2UPayout).toHaveBeenCalledTimes(2);
  });
});

