/**
 * Settlement Job Unit Tests - Precision Engine v1.6
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Validates the Final Whale Trim-Back logic.
 * Ensures precision math is applied and PayoutService is
 * triggered correctly for excess Pi returns.
 * ---------------------------------------------------------
 */

const SettlementJob = require('../../src/jobs/settlement');
const PayoutService = require('../../src/services/payout.service');
const MathHelper = require('../../src/utils/math.helper');

// Mocking PayoutService to avoid real blockchain interaction
jest.mock('../../src/services/payout.service');

describe('Settlement Job - Anti-Whale Logic Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * TEST: Whale Identification & Refund Calculation
   * Requirement: Any pioneer > 10% of pool must be capped and the rest refunded.
   */
  test('Enforcement: Should identify whales and calculate excess Pi with 6-decimal precision', async () => {
    const totalPool = 100000;
    const threshold = 10000; // 10% of 100k

    const mockInvestors = [
      { 
        piAddress: 'Whale_001', 
        totalPiContributed: 15000.5555555, // 5,000.5555555 excess
        save: jest.fn().mockResolvedValue(true) 
      },
      { 
        piAddress: 'Pioneer_001', 
        totalPiContributed: 5000, // Within cap
        save: jest.fn().mockResolvedValue(true) 
      }
    ];

    PayoutService.executeA2UPayout.mockResolvedValue({ success: true });

    const result = await SettlementJob.executeWhaleTrimBack(mockInvestors, totalPool);

    // 1. Check if the PayoutService was called for the whale only
    expect(PayoutService.executeA2UPayout).toHaveBeenCalledTimes(1);
    
    // 2. Verify precise refund (MathHelper.toPiPrecision should handle the decimal)
    const expectedRefund = MathHelper.toPiPrecision(5000.5555555);
    expect(PayoutService.executeA2UPayout).toHaveBeenCalledWith('Whale_001', expectedRefund);

    // 3. Verify Database Update
    expect(mockInvestors[0].totalPiContributed).toBe(threshold);
    expect(mockInvestors[0].isWhale).toBe(true);
    expect(result.totalRefunded).toBe(expectedRefund);
  });

  /**
   * TEST: Fault Tolerance
   * Requirement: If one payout fails, the job must continue for other whales.
   */
  test('Resilience: Should continue processing even if one whale payout fails', async () => {
    const totalPool = 100000;
    const mockInvestors = [
      { piAddress: 'Whale_A', totalPiContributed: 20000, save: jest.fn() },
      { piAddress: 'Whale_B', totalPiContributed: 20000, save: jest.fn() }
    ];

    PayoutService.executeA2UPayout
      .mockRejectedValueOnce(new Error('A2U Pipeline Timeout'))
      .mockResolvedValue({ success: true });

    await SettlementJob.executeWhaleTrimBack(mockInvestors, totalPool);

    // Should be called twice (one failed, one succeeded)
    expect(PayoutService.executeA2UPayout).toHaveBeenCalledTimes(2);
  });
});

