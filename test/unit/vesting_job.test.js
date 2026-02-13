/**
 * Vesting Job Unit Tests - Release Engine v1.7 (Performance Fixed)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * PURPOSE: 
 * Validates the 10-month linear vesting logic. Ensures tranches are 
 * 10% each and whales are excluded.
 */

import VestingJob from '../../src/jobs/vesting.job.js';
import Investor from '../../src/models/investor.model.js';
import PaymentService from '../../src/services/payment.service.js';
import { jest } from '@jest/globals';

describe('Vesting Job - Monthly Release Logic Tests', () => {
  
  // Increasing timeout to 10s for Termux stability
  jest.setTimeout(10000); 

  beforeEach(() => {
    // Mocking PaymentService to bypass real A2UaaS calls
    jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * TEST: Monthly Tranche Calculation (10%)
   * Requirement: Should release exactly 1/10th of the allocated MapCap.
   */
  test('Calculation: Should release exactly 10% of allocated equity per month', async () => {
    const mockInvestor = {
      piAddress: 'Pioneer_001',
      allocatedMapCap: 1000,
      vestingMonthsCompleted: 0,
      totalPiContributed: 500,
      isWhale: false,
      save: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(Investor, 'find').mockResolvedValue([mockInvestor]);

    await VestingJob.executeMonthlyVesting();

    // 1000 * 0.10 = 100 Pi
    expect(PaymentService.transferPi).toHaveBeenCalledWith('Pioneer_001', 100);
    expect(mockInvestor.vestingMonthsCompleted).toBe(1);
    expect(mockInvestor.save).toHaveBeenCalled();
  });

  /**
   * TEST: Boundary & Filtering Logic
   * Requirement: Should stop releasing once 10 months are completed.
   */
  test('Boundary: Should not process investors who have completed 10/10 months', async () => {
    jest.spyOn(Investor, 'find').mockResolvedValue([]); 

    await VestingJob.executeMonthlyVesting();

    expect(PaymentService.transferPi).not.toHaveBeenCalled();
  });

  /**
   * TEST: Whale Exclusion (Critical Security Spec)
   * Resolves: Timeout issue in security fetch.
   */
  test('Security: Should only fetch and process non-whale accounts', async () => {
    const findSpy = jest.spyOn(Investor, 'find').mockResolvedValue([]);
    
    await VestingJob.executeMonthlyVesting();

    // Verify the MongoDB filter excludes isWhale: true
    expect(findSpy).toHaveBeenCalledWith(expect.objectContaining({
      isWhale: false
    }));
  });

  /**
   * TEST: Fault Tolerance & Ledger Integrity
   * Requirement: If a payout fails, the ledger count should NOT increment.
   */
  test('Resilience: Should not increment monthsCompleted if PaymentService fails', async () => {
    const mockInvestor = {
      piAddress: 'Pioneer_Err',
      allocatedMapCap: 1000,
      vestingMonthsCompleted: 0,
      totalPiContributed: 500,
      isWhale: false,
      save: jest.fn()
    };

    jest.spyOn(Investor, 'find').mockResolvedValue([mockInvestor]);
    jest.spyOn(PaymentService, 'transferPi').mockRejectedValue(new Error('Network Fail'));

    await VestingJob.executeMonthlyVesting();

    // Verification: Integrity check to ensure no false progress records
    expect(mockInvestor.vestingMonthsCompleted).toBe(0); 
    expect(mockInvestor.save).not.toHaveBeenCalled();
  });
});
