/**
 * Settlement & Vesting Engine - Unified Lifecycle Suite v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * LEAD ARCHITECT: EslaM-X | AppDev @Map-of-Pi
 * ALIGNMENT: Automated Vesting & Whale Trim-Back (10% Rule Enforcement)
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Defined strict interfaces for Investor Mocks (piAddress, totalPi, etc.).
 * - Synchronized 6-decimal floor truncation assertions.
 * - Formalized PaymentService.transferPi signature (Address, Amount).
 * - Enforced atomic integrity checks for vesting increments.
 */

import SettlementJob from '../../../src/jobs/settlement.job.js';
import VestingJob from '../../../src/jobs/vesting.job.js';
import Investor from '../../../src/models/investor.model.js';
import PayoutService from '../../../src/services/payout.service.js';
import PaymentService from '../../../src/services/payment.service.js';
import { jest } from '@jest/globals';

describe('Financial Lifecycle - Settlement & Vesting Unified Tests', () => {
  
  // High timeout for blockchain simulation and precision math logic
  jest.setTimeout(15000); 

  beforeEach(() => {
    // Standardizing service mocks to prevent real network calls during unit testing
    jest.spyOn(PayoutService, 'executeA2UPayout').mockResolvedValue({ success: true } as any);
    jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ success: true } as any);
    
    // Simulating a 100k Pi collective pool for percentage-based threshold logic
    jest.spyOn(Investor, 'aggregate').mockResolvedValue([{ total: 100000 }]);
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: WHALE TRIM-BACK PROTOCOL (Settlement)
   * Ensures no single entity exceeds 10% of total pool post-IPO.
   */
  describe('Whale Trim-Back - Precision & Enforcement', () => {

    test('Precision: Should refund excess Pi with 6-decimal floor truncation', async () => {
      const totalPool = 100000;
      const threshold = 10000; // 10% limit according to Philip's Spec

      const mockWhale: any = { 
        piAddress: 'Whale_001', 
        totalPiContributed: 15000.5555555, 
        isWhale: false,
        save: jest.fn().mockResolvedValue(true) 
      };

      jest.spyOn(Investor, 'find').mockResolvedValue([mockWhale]);

      const result = await SettlementJob.executeWhaleTrimBack(totalPool);
      const expectedRefund = 5000.555555; 

      // Assertion: Verify A2U payout parameters including the internal audit tag
      expect(PayoutService.executeA2UPayout).toHaveBeenCalledWith(
        expect.stringContaining('Whale_001'), 
        expect.closeTo(expectedRefund, 6), 
        "WHALE_EXCESS_REFUND"
      );
      
      expect(mockWhale.totalPiContributed).toBe(threshold);
      expect(mockWhale.isWhale).toBe(true);
      expect(result.totalRefunded).toBe(expectedRefund);
    });

    test('Aggregation: Should track total refunded Pi across multiple whales', async () => {
      const totalPool = 100000; 
      
      const mockWhales: any[] = [
        { piAddress: 'Whale_A', totalPiContributed: 12000, save: jest.fn().mockResolvedValue(true) },
        { piAddress: 'Whale_B', totalPiContributed: 13000, save: jest.fn().mockResolvedValue(true) }
      ];

      jest.spyOn(Investor, 'find').mockResolvedValue(mockWhales);

      const result = await SettlementJob.executeWhaleTrimBack(totalPool);

      // (12000-10000) + (13000-10000) = 5000 refund total
      expect(result.totalRefunded).toBe(5000); 
      expect(result.whalesImpacted).toBe(2);
    });
  });

  /**
   * SECTION 2: MONTHLY VESTING ENGINE (Release Management)
   */
  describe('Monthly Vesting - Release Logic', () => {

    test('Calculation: Should release exactly 10% of allocated equity per month', async () => {
      const mockInvestor: any = {
        piAddress: 'Pioneer_001',
        allocatedMapCap: 1000,
        vestingMonthsCompleted: 0,
        isWhale: false,
        save: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(Investor, 'find').mockResolvedValue([mockInvestor]);
      
      await VestingJob.executeMonthlyVesting();

      /**
       * AUDIT v1.7.5: Matches PaymentService.transferPi signature.
       */
      expect(PaymentService.transferPi).toHaveBeenCalledWith(
        'Pioneer_001', 
        100 // 10% of 1000 allocated equity
      );
      expect(mockInvestor.vestingMonthsCompleted).toBe(1);
    });

    test('Security: Should strictly exclude whales from the vesting distribution queue', async () => {
      const findSpy = jest.spyOn(Investor, 'find').mockResolvedValue([]);
      
      await VestingJob.executeMonthlyVesting();
      
      // Compliance check: DB query must explicitly filter by isWhale: false
      expect(findSpy).toHaveBeenCalledWith(expect.objectContaining({ isWhale: false }));
    });
  });

  /**
   * SECTION 3: SHARED RESILIENCE & ERROR HANDLING
   */
  describe('System Fault Tolerance', () => {

    test('Recovery: Should maintain queue processing if a single payout fails', async () => {
      const totalPool = 100000;
      const mockWhales: any[] = [
        { piAddress: 'Whale_Fail', totalPiContributed: 20000, save: jest.fn().mockResolvedValue(true) },
        { piAddress: 'Whale_Success', totalPiContributed: 20000, save: jest.fn().mockResolvedValue(true) }
      ];

      jest.spyOn(Investor, 'find').mockResolvedValue(mockWhales);
      
      // Simulating a transient network failure for the first whale; second should proceed
      jest.spyOn(PayoutService, 'executeA2UPayout')
          .mockRejectedValueOnce(new Error('A2U Gateway Timeout'))
          .mockResolvedValue({ success: true } as any);

      await SettlementJob.executeWhaleTrimBack(totalPool);
      
      // Verifying that the process did not halt after the first error (Fault Tolerance)
      expect(PayoutService.executeA2UPayout).toHaveBeenCalledTimes(2);
    });

    test('Atomicity: Should not increment vesting state if Pi transfer fails', async () => {
      const mockInvestor: any = { 
        piAddress: 'Pioneer_Err', 
        vestingMonthsCompleted: 0, 
        save: jest.fn().mockResolvedValue(true) 
      };
      
      jest.spyOn(Investor, 'find').mockResolvedValue([mockInvestor]);
      jest.spyOn(PaymentService, 'transferPi').mockRejectedValue(new Error('Insufficient Pi Balance'));

      await VestingJob.executeMonthlyVesting();
      
      // Financial Integrity: Months Completed must NOT change if the transaction failed
      expect(mockInvestor.vestingMonthsCompleted).toBe(0); 
      expect(mockInvestor.save).not.toHaveBeenCalled();
    });
  });
});
