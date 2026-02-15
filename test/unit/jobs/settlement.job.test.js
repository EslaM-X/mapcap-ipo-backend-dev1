/**
 * Settlement & Vesting Engine - Unified Lifecycle Suite v1.8.1
 * -------------------------------------------------------------------------
 * Fixed: Argument mismatch in PayoutService & Precision Aggregation.
 * -------------------------------------------------------------------------
 */

import SettlementJob from '../../../src/jobs/settlement.job.js';
import VestingJob from '../../../src/jobs/vesting.job.js';
import Investor from '../../../src/models/investor.model.js';
import PayoutService from '../../../src/services/payout.service.js';
import PaymentService from '../../../src/services/payment.service.js';
import { jest } from '@jest/globals';

describe('Financial Lifecycle - Settlement & Vesting Unified Tests', () => {
  
  jest.setTimeout(10000); 

  beforeEach(() => {
    jest.spyOn(PayoutService, 'executeA2UPayout').mockResolvedValue({ success: true });
    jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ success: true });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: WHALE TRIM-BACK PROTOCOL (Settlement)
   */
  describe('Whale Trim-Back - Precision & Enforcement', () => {

    test('Precision: Should refund excess Pi with 6-decimal floor truncation', async () => {
      const totalPool = 100000;
      const threshold = 10000; 

      const mockInvestors = [
        { 
          piAddress: 'Whale_001', 
          totalPiContributed: 15000.5555555, 
          isWhale: false,
          save: jest.fn().mockResolvedValue(true) 
        }
      ];

      const result = await SettlementJob.executeWhaleTrimBack(mockInvestors, totalPool);
      const expectedRefund = 5000.555555; 

      // FIX: Added the 3rd argument "WHALE_EXCESS_REFUND" to match the actual job implementation
      expect(PayoutService.executeA2UPayout).toHaveBeenCalledWith(
        'Whale_001', 
        expectedRefund, 
        "WHALE_EXCESS_REFUND"
      );
      
      expect(mockInvestors[0].totalPiContributed).toBe(threshold);
      expect(mockInvestors[0].isWhale).toBe(true);
      expect(result.totalRefunded).toBe(expectedRefund);
    });

    test('Aggregation: Should track total refunded Pi across all identified whales', async () => {
      const totalPool = 100000;
      const mockInvestors = [
        { piAddress: 'Whale_A', totalPiContributed: 12000, save: jest.fn().mockResolvedValue(true) },
        { piAddress: 'Whale_B', totalPiContributed: 13000, save: jest.fn().mockResolvedValue(true) }
      ];

      const result = await SettlementJob.executeWhaleTrimBack(mockInvestors, totalPool);

      // FIX: Ensuring result.totalRefunded is evaluated correctly based on the return object structure
      expect(result.totalRefunded).toBe(5000); 
      expect(result.whalesImpacted).toBe(2);
    });
  });

  /**
   * SECTION 2: MONTHLY VESTING ENGINE (Release)
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

      // FIX: Matching the 3rd argument for PaymentService metadata if exists
      expect(PaymentService.transferPi).toHaveBeenCalledWith(
        'Pioneer_001', 
        100, 
        expect.any(String) 
      );
      expect(mockInvestor.vestingMonthsCompleted).toBe(1);
    });

    test('Security: Should strictly filter out whales from the vesting queue', async () => {
      const findSpy = jest.spyOn(Investor, 'find').mockResolvedValue([]);
      await VestingJob.executeMonthlyVesting();
      expect(findSpy).toHaveBeenCalledWith(expect.objectContaining({ isWhale: false }));
    });
  });

  /**
   * SECTION 3: SHARED RESILIENCE
   */
  describe('System Fault Tolerance', () => {

    test('Resilience: Should continue processing queue if a single payout fails', async () => {
      const totalPool = 100000;
      const mockInvestors = [
        { piAddress: 'Whale_Fail', totalPiContributed: 20000, save: jest.fn().mockResolvedValue(true) },
        { piAddress: 'Whale_Success', totalPiContributed: 20000, save: jest.fn().mockResolvedValue(true) }
      ];

      jest.spyOn(PayoutService, 'executeA2UPayout')
          .mockRejectedValueOnce(new Error('A2U Timeout'))
          .mockResolvedValue({ success: true });

      await SettlementJob.executeWhaleTrimBack(mockInvestors, totalPool);
      expect(PayoutService.executeA2UPayout).toHaveBeenCalledTimes(2);
    });

    test('Integrity: Should not record progress if vesting payment fails', async () => {
      const mockInvestor = { piAddress: 'Pioneer_Err', vestingMonthsCompleted: 0, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(Investor, 'find').mockResolvedValue([mockInvestor]);
      jest.spyOn(PaymentService, 'transferPi').mockRejectedValue(new Error('Fail'));

      await VestingJob.executeMonthlyVesting();
      expect(mockInvestor.vestingMonthsCompleted).toBe(0); 
      expect(mockInvestor.save).not.toHaveBeenCalled();
    });
  });
});
