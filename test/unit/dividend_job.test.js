/**
 * Dividend Job Unit Tests - Profit Sharing v1.2
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings (Page 5-6)
 * * PURPOSE: 
 * Validates Proportional Profit Sharing and Anti-Whale Caps.
 * Ensures payouts are truncated correctly at the 10% ceiling
 * and processed via the A2UaaS (App-to-User) pipeline.
 * ---------------------------------------------------------
 */

import DividendJob from '../../src/jobs/dividend.job.js';
import Investor from '../../src/models/investor.model.js';
import PaymentService from '../../src/services/payment.service.js';
import { jest } from '@jest/globals';

describe('Dividend Job - Profit Sharing Logic Tests', () => {
  
  beforeEach(() => {
    // Mocking a set of investors with different holdings
    jest.spyOn(Investor, 'find').mockResolvedValue([
      { piAddress: 'Normal_Pioneer', allocatedMapCap: 21818, totalPiContributed: 1000 }, // 1% of pool
      { piAddress: 'Whale_Pioneer', allocatedMapCap: 500000, totalPiContributed: 20000 } // ~23% of pool
    ]);

    // Mocking the Payment Service to prevent real API calls
    jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * TEST: Proportional Distribution
   * Requirement: Share = (User Holdings / Total Supply) * Profit Pot
   */
  test('Distribution: Should calculate 1% share accurately for normal pioneers', async () => {
    const totalProfitPot = 10000; // 10,000 Pi for distribution
    await DividendJob.distributeDividends(totalProfitPot);

    // Normal_Pioneer has 1% of 2,181,818 supply. 1% of 10,000 = 100 Pi.
    expect(PaymentService.transferPi).toHaveBeenCalledWith('Normal_Pioneer', expect.closeTo(100, 0));
  });

  /**
   * TEST: Anti-Whale Ceiling (10% Cap)
   * Requirement: Individual payout must NOT exceed 10% of the current Profit Pot.
   */
  test('Security: Should cap whale dividends at 10% of the total profit pot', async () => {
    const totalProfitPot = 10000;
    const ceiling = 1000; // 10% of 10,000

    await DividendJob.distributeDividends(totalProfitPot);

    // Whale_Pioneer's raw share is ~2300 Pi, but must be truncated to 1000 Pi.
    expect(PaymentService.transferPi).toHaveBeenCalledWith('Whale_Pioneer', ceiling);
  });

  /**
   * TEST: Fault Tolerance
   * Requirement: Job should continue even if one payment fails.
   */
  test('Resilience: Should continue processing even if one payment fails', async () => {
    jest.spyOn(PaymentService, 'transferPi')
        .mockRejectedValueOnce(new Error('Network Timeout'))
        .mockResolvedValue({ success: true });

    await DividendJob.distributeDividends(10000);

    // Even if Normal_Pioneer fails, Whale_Pioneer should still be processed.
    expect(PaymentService.transferPi).toHaveBeenCalledTimes(2);
  });
});

