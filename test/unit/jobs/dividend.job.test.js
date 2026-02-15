/**
 * Tokenomics & Dividend Integrity - Unified Suite v1.5.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings (Tokenomics & Payouts)
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite unifies the Genesis Mint parameters with the Automated 
 * Profit-Sharing logic. It ensures the 4M hard-cap is immutable and that 
 * dividends are distributed proportionally while enforcing the 10% 
 * Anti-Whale ceiling per payout.
 * -------------------------------------------------------------------------
 */

import DividendJob from '../../../src/jobs/dividend.job.js';
import MintConfig from '../../../src/config/initial_mint.js';
import Investor from '../../../src/models/investor.model.js';
import PaymentService from '../../../src/services/payment.service.js';
import { jest } from '@jest/globals';

describe('Tokenomics & Dividends - Unified Financial Tests', () => {

  beforeEach(() => {
    // Mocking investors for proportional distribution tests
    jest.spyOn(Investor, 'find').mockResolvedValue([
      { piAddress: 'Normal_Pioneer', allocatedMapCap: 21818, totalPiContributed: 1000 }, // ~1% of pool
      { piAddress: 'Whale_Pioneer', allocatedMapCap: 500000, totalPiContributed: 20000 } // ~23% of pool
    ]);

    // Mocking Payment Service (A2UaaS Pipeline)
    jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: GENESIS MINT CONFIGURATION
   * Requirement: Philip's Tokenomics - Supply must be immutable and 
   * follow strict scarcity targets.
   */
  describe('Mint Configuration - Scarcity & Balance', () => {
    
    test('Supply: Should enforce 4M Hard-Cap and 2.18M IPO Pool target', () => {
      expect(MintConfig.TOTAL_MINT).toBe(4000000);
      expect(MintConfig.IPO_POOL).toBe(2181818);
    });

    test('Balance: IPO and LP pools must mathematically equal the total mint', () => {
      const totalCalculated = MintConfig.IPO_POOL + MintConfig.LP_POOL;
      expect(totalCalculated).toBe(MintConfig.TOTAL_MINT);
    });

    test('Precision: Should strictly follow the 6-decimal global financial standard', () => {
      expect(MintConfig.PRECISION).toBe(6);
    });

    test('Security: Mint configuration object must be frozen at runtime', () => {
      expect(Object.isFrozen(MintConfig)).toBe(true);
    });
  });

  /**
   * SECTION 2: DIVIDEND DISTRIBUTION LOGIC
   * Requirement: Proportional sharing with a 10% Anti-Whale ceiling.
   *
   */
  describe('Dividend Job - Proportional Payouts', () => {

    test('Distribution: Should calculate 1% share accurately for normal pioneers', async () => {
      const totalProfitPot = 10000; 
      await DividendJob.distributeDividends(totalProfitPot);

      // 1% of 10,000 Pi = 100 Pi
      expect(PaymentService.transferPi).toHaveBeenCalledWith('Normal_Pioneer', expect.closeTo(100, 0));
    });

    test('Anti-Whale: Should truncate whale dividends at 10% of the profit pot', async () => {
      const totalProfitPot = 10000;
      const ceiling = 1000; // 10% Cap

      await DividendJob.distributeDividends(totalProfitPot);

      // Even though whale owns ~23%, they only receive the 1000 Pi cap
      expect(PaymentService.transferPi).toHaveBeenCalledWith('Whale_Pioneer', ceiling);
    });

    test('Fault Tolerance: Should continue processing if a single payment fails', async () => {
      jest.spyOn(PaymentService, 'transferPi')
          .mockRejectedValueOnce(new Error('Network Timeout'))
          .mockResolvedValue({ success: true });

      await DividendJob.distributeDividends(10000);

      // Ensures the entire pipeline doesn't freeze due to one pioneer's error
      expect(PaymentService.transferPi).toHaveBeenCalledTimes(2);
    });
  });
});

