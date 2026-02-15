/**
 * Settlement Engine Unit Tests - Anti-Whale Protocol v1.7.5
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Validates the High-Precision Whale Trim-Back Engine. This suite ensures 
 * that the 10% decentralization ceiling is enforced post-IPO with 6-decimal 
 * accuracy, utilizing the A2UaaS pipeline for excess Pi refunds.
 * -------------------------------------------------------------------------
 */

import SettlementJob from '../../../src/jobs/settlement.job.js';
import PayoutService from '../../../src/services/payout.service.js';
import { jest } from '@jest/globals';

describe('Settlement Job - High-Precision Whale-Shield Tests', () => {
  
  beforeEach(() => {
    /**
     * MOCKING STRATEGY:
     * Intercepting PayoutService to simulate A2UaaS pipeline without 
     * triggering actual blockchain transactions during unit testing.
     */
    jest.spyOn(PayoutService, 'executeA2UPayout').mockResolvedValue({ success: true });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: PRECISION & ENFORCEMENT
   * Requirement: Philip's "Water-Level" Spec - Excess Pi must be truncated 
   * to 6 decimals (Floor) to prevent over-payment or pool depletion.
   */
  describe('Whale Trim-Back Accuracy', () => {

    test('Enforcement: Should accurately calculate and refund excess Pi using 6-decimal floor truncation', async () => {
      const totalPool = 100000;
      const threshold = 10000; // 10% ceiling of the 100k test pool

      const mockInvestors = [
        { 
          piAddress: 'Whale_Pioneer_001', 
          totalPiContributed: 15000.5555555, // 7-decimal input
          isWhale: false,
          save: jest.fn().mockResolvedValue(true) 
        },
        { 
          piAddress: 'Standard_Pioneer_002', 
          totalPiContributed: 5000, // Compliant investor
          save: jest.fn().mockResolvedValue(true) 
        }
      ];

      const result = await SettlementJob.executeWhaleTrimBack(mockInvestors, totalPool);

      /**
       * CALCULATION CHECK:
       * Excess: 15000.5555555 - 10000 = 5000.5555555
       * MathHelper Output (Floor): 5000.555555
       */
      const expectedRefund = 5000.555555;

      expect(PayoutService.executeA2UPayout).toHaveBeenCalledWith('Whale_Pioneer_001', expectedRefund);
      expect(PayoutService.executeA2UPayout).toHaveBeenCalledTimes(1); // Only for the whale

      // Verifying Database Synchronization
      expect(mockInvestors[0].totalPiContributed).toBe(threshold);
      expect(mockInvestors[0].isWhale).toBe(true);
      expect(result.totalRefunded).toBe(expectedRefund);
    });

    test('Aggregation: Should correctly track global refund totals across multiple whales', async () => {
      const totalPool = 100000;
      const mockInvestors = [
        { piAddress: 'Whale_A', totalPiContributed: 12000, save: jest.fn() },
        { piAddress: 'Whale_B', totalPiContributed: 13000, save: jest.fn() }
      ];

      const result = await SettlementJob.executeWhaleTrimBack(mockInvestors, totalPool);

      // Total Expected Refund: (12000-10000) + (13000-10000) = 5000
      expect(result.totalRefunded).toBe(5000);
      expect(result.whalesImpacted).toBe(2);
    });
  });

  /**
   * SECTION 2: RESILIENCE & COMPLIANCE (Daniel's Spec)
   * Requirement: One network failure in the A2U pipeline must NOT halt 
   * the entire settlement process.
   */
  describe('Fault Tolerance & Operational Security', () => {

    test('Resilience: Should continue processing the queue if a single payout fails', async () => {
      const totalPool = 100000;
      const mockInvestors = [
        { piAddress: 'Whale_Fail', totalPiContributed: 20000, save: jest.fn() },
        { piAddress: 'Whale_Success', totalPiContributed: 20000, save: jest.fn() }
      ];

      // Simulating a transient network error on the first attempt
      jest.spyOn(PayoutService, 'executeA2UPayout')
          .mockRejectedValueOnce(new Error('A2U Pipeline Timeout'))
          .mockResolvedValue({ success: true });

      await SettlementJob.executeWhaleTrimBack(mockInvestors, totalPool);

      // Logic Check: Even if Whale_Fail fails, Whale_Success must be processed
      expect(PayoutService.executeA2UPayout).toHaveBeenCalledTimes(2);
    });
  });
});

