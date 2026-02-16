/**
 * Settlement & Vesting Engine - Unified Lifecycle Suite v1.8.2
 * -------------------------------------------------------------------------
 * LEAD ARCHITECT: EslaM-X | AppDev @Map-of-Pi
 * FIXED: Logic updated to align with SettlementJob v1.6.7 (DB-Internal Fetch)
 * -------------------------------------------------------------------------
 */

import SettlementJob from '../../../src/jobs/settlement.job.js';
import VestingJob from '../../../src/jobs/vesting.job.js';
import Investor from '../../../src/models/investor.model.js';
import PayoutService from '../../../src/services/payout.service.js';
import PaymentService from '../../../src/services/payment.service.js';
import { jest } from '@jest/globals';

describe('Financial Lifecycle - Settlement & Vesting Unified Tests', () => {
  
  // High timeout for complex financial calculations
  jest.setTimeout(10000); 

  beforeEach(() => {
    jest.spyOn(PayoutService, 'executeA2UPayout').mockResolvedValue({ success: true });
    jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ success: true });
    
    // Default safe aggregate mock (100k Pi pooled)
    jest.spyOn(Investor, 'aggregate').mockResolvedValue([{ total: 100000 }]);
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: WHALE TRIM-BACK PROTOCOL (Settlement)
   * Compliance: Post-IPO Enforcement (Philip's 10% Rule)
   */
  describe('Whale Trim-Back - Precision & Enforcement', () => {

    test('Precision: Should refund excess Pi with 6-decimal floor truncation', async () => {
      const totalPool = 100000;
      const threshold = 10000; // 10% of 100k

      // We mock the Investor.find call because the Job now fetches from DB internally
      const mockWhale = { 
        piAddress: 'Whale_001', 
        totalPiContributed: 15000.5555555, 
        isWhale: false,
        save: jest.fn().mockResolvedValue(true) 
      };

      jest.spyOn(Investor, 'find').mockResolvedValue([mockWhale]);

      const result = await SettlementJob.executeWhaleTrimBack(totalPool);
      const expectedRefund = 5000.555555; 

      // Assertion: Payout must include the audit tag "WHALE_EXCESS_REFUND"
      expect(PayoutService.executeA2UPayout).toHaveBeenCalledWith(
        'Whale_001', 
        expectedRefund, 
        "WHALE_EXCESS_REFUND"
      );
      
      expect(mockWhale.totalPiContributed).toBe(threshold);
      expect(mockWhale.isWhale).toBe(true);
      expect(result.totalRefunded).toBe(expectedRefund);
    });

    test('Aggregation: Should track total refunded Pi across all identified whales', async () => {
      const totalPool = 100000; // Threshold = 10k
      
      const mockWhales = [
        { piAddress: 'Whale_A', totalPiContributed: 12000, save: jest.fn().mockResolvedValue(true) },
        { piAddress: 'Whale_B', totalPiContributed: 13000, save: jest.fn().mockResolvedValue(true) }
      ];

      jest.spyOn(Investor, 'find').mockResolvedValue(mockWhales);

      const result = await SettlementJob.executeWhaleTrimBack(totalPool);

      // (12000-10000) + (13000-10000) = 5000
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

      // Ensure PaymentService is called with correct distribution amount (1000 * 0.1)
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
      
      // Verification: The DB query MUST exclude accounts with isWhale: true
      expect(findSpy).toHaveBeenCalledWith(expect.objectContaining({ isWhale: false }));
    });
  });

  /**
   * SECTION 3: SHARED RESILIENCE
   */
  describe('System Fault Tolerance', () => {

    test('Resilience: Should continue processing queue if a single payout fails', async () => {
      const totalPool = 100000;
      const mockWhales = [
        { piAddress: 'Whale_Fail', totalPiContributed: 20000, save: jest.fn().mockResolvedValue(true) },
        { piAddress: 'Whale_Success', totalPiContributed: 20000, save: jest.fn().mockResolvedValue(true) }
      ];

      jest.spyOn(Investor, 'find').mockResolvedValue(mockWhales);
      jest.spyOn(PayoutService, 'executeA2UPayout')
          .mockRejectedValueOnce(new Error('A2U Timeout'))
          .mockResolvedValue({ success: true });

      await SettlementJob.executeWhaleTrimBack(totalPool);
      
      // Even if one fails, the loop must continue to the next whale
      expect(PayoutService.executeA2UPayout).toHaveBeenCalledTimes(2);
    });

    test('Integrity: Should not record progress if vesting payment fails', async () => {
      const mockInvestor = { 
        piAddress: 'Pioneer_Err', 
        vestingMonthsCompleted: 0, 
        save: jest.fn().mockResolvedValue(true) 
      };
      
      jest.spyOn(Investor, 'find').mockResolvedValue([mockInvestor]);
      jest.spyOn(PaymentService, 'transferPi').mockRejectedValue(new Error('Network Fail'));

      await VestingJob.executeMonthlyVesting();
      
      // Critical: Monthly counter must NOT increment if transaction failed
      expect(mockInvestor.vestingMonthsCompleted).toBe(0); 
      expect(mockInvestor.save).not.toHaveBeenCalled();
    });
  });
});
