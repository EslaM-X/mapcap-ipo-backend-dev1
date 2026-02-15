/**
 * Settlement & Vesting Engine - Unified Lifecycle Suite v1.8.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite validates the complete post-IPO financial lifecycle. It unifies:
 * 1. High-Precision Whale Trim-Back (10% ceiling with 6-decimal accuracy).
 * 2. Automated Monthly Vesting (10% linear release over 10 months).
 * 3. A2UaaS Pipeline Resilience & Fault Tolerance.
 * -------------------------------------------------------------------------
 */

import SettlementJob from '../../../src/jobs/settlement.job.js';
import VestingJob from '../../../src/jobs/vesting.job.js';
import Investor from '../../../src/models/investor.model.js';
import PayoutService from '../../../src/services/payout.service.js';
import PaymentService from '../../../src/services/payment.service.js';
import { jest } from '@jest/globals';

describe('Financial Lifecycle - Settlement & Vesting Unified Tests', () => {
  
  // High-availability timeout for Termux/CI stability
  jest.setTimeout(10000); 

  beforeEach(() => {
    // Mocking Payout/Payment Services to prevent real blockchain actions
    jest.spyOn(PayoutService, 'executeA2UPayout').mockResolvedValue({ success: true });
    jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ success: true });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: WHALE TRIM-BACK PROTOCOL (Settlement)
   * Requirement: Philip's "Water-Level" Spec - Truncate excess Pi to 6 decimals.
   *
   */
  describe('Whale Trim-Back - Precision & Enforcement', () => {

    test('Precision: Should refund excess Pi with 6-decimal floor truncation', async () => {
      const totalPool = 100000;
      const threshold = 10000; // 10% cap

      const mockInvestors = [
        { 
          piAddress: 'Whale_001', 
          totalPiContributed: 15000.5555555, // 7-decimal input
          isWhale: false,
          save: jest.fn().mockResolvedValue(true) 
        }
      ];

      const result = await SettlementJob.executeWhaleTrimBack(mockInvestors, totalPool);
      const expectedRefund = 5000.555555; // Floor truncation

      expect(PayoutService.executeA2UPayout).toHaveBeenCalledWith('Whale_001', expectedRefund);
      expect(mockInvestors[0].totalPiContributed).toBe(threshold); // Capped
      expect(mockInvestors[0].isWhale).toBe(true);
      expect(result.totalRefunded).toBe(expectedRefund);
    });

    test('Aggregation: Should track total refunded Pi across all identified whales', async () => {
      const totalPool = 100000;
      const mockInvestors = [
        { piAddress: 'Whale_A', totalPiContributed: 12000, save: jest.fn() },
        { piAddress: 'Whale_B', totalPiContributed: 13000, save: jest.fn() }
      ];

      const result = await SettlementJob.executeWhaleTrimBack(mockInvestors, totalPool);

      expect(result.totalRefunded).toBe(5000); // (2000 + 3000)
      expect(result.whalesImpacted).toBe(2);
    });
  });

  /**
   * SECTION 2: MONTHLY VESTING ENGINE (Release)
   * Requirement: 10-month linear release (10% each), excluding whales.
   *
   */
  describe('Monthly Vesting - Release Logic', () => {

    test('Calculation: Should release exactly 10% of equity per month', async () => {
      const mockInvestor = {
        piAddress: 'Pioneer_001',
        allocatedMapCap: 1000,
        vestingMonthsCompleted: 0,
        isWhale: false,
        save: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(Investor, 'find').mockResolvedValue([mockInvestor]);
      await VestingJob.executeMonthlyVesting();

      expect(PaymentService.transferPi).toHaveBeenCalledWith('Pioneer_001', 100); // 10% release
      expect(mockInvestor.vestingMonthsCompleted).toBe(1);
    });

    test('Security: Should strictly filter out whales from the vesting queue', async () => {
      const findSpy = jest.spyOn(Investor, 'find').mockResolvedValue([]);
      
      await VestingJob.executeMonthlyVesting();

      // Compliance Check: Filter must include isWhale: false
      expect(findSpy).toHaveBeenCalledWith(expect.objectContaining({ isWhale: false }));
    });
  });

  /**
   * SECTION 3: SHARED RESILIENCE (Daniel's Compliance)
   *
   */
  describe('System Fault Tolerance', () => {

    test('Resilience: Should continue processing queue if a single payout fails', async () => {
      const totalPool = 100000;
      const mockInvestors = [
        { piAddress: 'Whale_Fail', totalPiContributed: 20000, save: jest.fn() },
        { piAddress: 'Whale_Success', totalPiContributed: 20000, save: jest.fn() }
      ];

      jest.spyOn(PayoutService, 'executeA2UPayout')
          .mockRejectedValueOnce(new Error('A2U Timeout'))
          .mockResolvedValue({ success: true });

      await SettlementJob.executeWhaleTrimBack(mockInvestors, totalPool);

      // Verify the loop didn't break
      expect(PayoutService.executeA2UPayout).toHaveBeenCalledTimes(2);
    });

    test('Integrity: Should not record progress if vesting payment fails', async () => {
      const mockInvestor = { piAddress: 'Pioneer_Err', vestingMonthsCompleted: 0, save: jest.fn() };
      jest.spyOn(Investor, 'find').mockResolvedValue([mockInvestor]);
      jest.spyOn(PaymentService, 'transferPi').mockRejectedValue(new Error('Fail'));

      await VestingJob.executeMonthlyVesting();

      // Ledger must remain unchanged
      expect(mockInvestor.vestingMonthsCompleted).toBe(0); 
      expect(mockInvestor.save).not.toHaveBeenCalled();
    });
  });
});
