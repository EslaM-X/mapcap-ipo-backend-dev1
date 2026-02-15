/**
 * Tokenomics & Dividend Integrity - Unified Suite v1.5.1
 * -------------------------------------------------------------------------
 * Fixed: Floating point precision and Metadata matching for Payouts.
 * -------------------------------------------------------------------------
 */

import DividendJob from '../../../src/jobs/dividend.job.js';
import MintConfig from '../../../src/config/initial_mint.js';
import Investor from '../../../src/models/investor.model.js';
import PaymentService from '../../../src/services/payment.service.js';
import { jest } from '@jest/globals';

describe('Tokenomics & Dividends - Unified Financial Tests', () => {

  beforeEach(() => {
    // Mocking investors with precise proportions to match IPO Pool targets
    jest.spyOn(Investor, 'find').mockResolvedValue([
      { 
        piAddress: 'Normal_Pioneer', 
        allocatedMapCap: 21818.18, // Exactly 1% of 2.18M
        totalPiContributed: 1000 
      },
      { 
        piAddress: 'Whale_Pioneer', 
        allocatedMapCap: 500000, 
        totalPiContributed: 20000 
      }
    ]);

    jest.spyOn(PaymentService, 'transferPi').mockResolvedValue({ success: true });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: GENESIS MINT CONFIGURATION
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
   */
  describe('Dividend Job - Proportional Payouts', () => {

    test('Distribution: Should calculate 1% share accurately for normal pioneers', async () => {
      const totalProfitPot = 10000; 
      await DividendJob.distributeDividends(totalProfitPot);

      // FIX: Added "MONTHLY_DIVIDEND_PAYOUT" and used precision matching
      expect(PaymentService.transferPi).toHaveBeenCalledWith(
        'Normal_Pioneer', 
        expect.closeTo(100, 1), // Allowing small float variance
        "MONTHLY_DIVIDEND_PAYOUT"
      );
    });

    test('Anti-Whale: Should truncate whale dividends at 10% of the profit pot', async () => {
      const totalProfitPot = 10000;
      const ceiling = 1000; 

      await DividendJob.distributeDividends(totalProfitPot);

      // FIX: Ensure metadata "MONTHLY_DIVIDEND_PAYOUT" is present
      expect(PaymentService.transferPi).toHaveBeenCalledWith(
        'Whale_Pioneer', 
        ceiling,
        "MONTHLY_DIVIDEND_PAYOUT"
      );
    });

    test('Fault Tolerance: Should continue processing if a single payment fails', async () => {
      jest.spyOn(PaymentService, 'transferPi')
          .mockRejectedValueOnce(new Error('Network Timeout'))
          .mockResolvedValue({ success: true });

      await DividendJob.distributeDividends(10000);
      expect(PaymentService.transferPi).toHaveBeenCalledTimes(2);
    });
  });
});
