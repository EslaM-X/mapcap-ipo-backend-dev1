/**
 * Daily Automation & Pricing Integrity - Unified Suite v1.7.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite validates the Automated Task Orchestrator and the Daily Market 
 * Recalibration logic. It ensures that the 'Spot Price' is calculated with 
 * 6-decimal precision and that all core jobs (Pricing, Vesting, Settlement) 
 * are scheduled according to the IPO roadmap.
 * -------------------------------------------------------------------------
 */

import { jest } from '@jest/globals';

// --- ESM Mocking Strategy for node-cron ---
jest.unstable_mockModule('node-cron', () => ({
  default: { schedule: jest.fn() }
}));

// Dynamic imports to satisfy ESM requirements and Mocking order
const { default: cron } = await import('node-cron');
const { default: CronScheduler } = await import('../../../src/jobs/cron.scheduler.js');
const { default: DailyPriceJob } = await import('../../../src/jobs/daily-price-update.js');
const { default: Investor } = await import('../../../src/models/investor.model.js');

describe('Daily Automation & Market Logic - Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // Default Mock: Total Pool = 100,000 Pi for price calculations
    jest.spyOn(Investor, 'aggregate').mockResolvedValue([{ totalPool: 100000 }]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: MARKET RECALIBRATION LOGIC
   * Requirement: Philip's Spec - Spot Price must be derived from 
   * (Total Supply / Total Pool) with strict 6-decimal precision.
   */
  describe('Daily Price Job - Financial Precision', () => {

    test('Recalibration: Should calculate correct spot price with 6-decimal precision', async () => {
      const result = await DailyPriceJob.updatePrice();

      // Calculation: 2,181,818 (Supply) / 100,000 (Pool) = 21.818180
      expect(result.totalPiInvested).toBe(100000);
      expect(result.newPrice).toBe("21.818180"); 
    });

    test('Safety: Should return a 0.000000 price when total liquidity is zero', async () => {
      jest.spyOn(Investor, 'aggregate').mockResolvedValue([]);
      const result = await DailyPriceJob.updatePrice();

      // Requirement: Prevent NaN/Infinity errors in Frontend charts
      expect(result.newPrice).toBe("0.000000");
    });

    test('Audit: Should include a valid ISO timestamp for the price snapshot', async () => {
      const result = await DailyPriceJob.updatePrice();
      expect(new Date(result.timestamp).getTime()).not.toBeNaN();
    });
  });

  /**
   * SECTION 2: CRON SCHEDULER ORCHESTRATION
   * Requirement: Daniel's Compliance - Automated tasks must trigger at 
   * exact intervals to maintain ledger integrity.
   */
  describe('Cron Scheduler - Task Orchestration', () => {

    test('Orchestration: Should initialize exactly 3 core automated tasks on boot', () => {
      CronScheduler.init();
      expect(cron.schedule).toHaveBeenCalledTimes(3);
    });

    test('Scheduling: Daily Price Job must be set for Midnight UTC', () => {
      CronScheduler.init();
      expect(cron.schedule).toHaveBeenCalledWith(
        '0 0 * * *', 
        expect.any(Function), 
        expect.objectContaining({ timezone: "UTC" })
      );
    });

    test('Scheduling: Monthly Vesting must be set for the 1st of each month', () => {
      CronScheduler.init();
      expect(cron.schedule).toHaveBeenCalledWith(
        '0 0 1 * *', 
        expect.any(Function), 
        expect.objectContaining({ timezone: "UTC" })
      );
    });

    test('Scheduling: Final Whale Settlement must trigger on the 28th day', () => {
      CronScheduler.init();
      expect(cron.schedule).toHaveBeenCalledWith(
        '0 23 28 * *', 
        expect.any(Function), 
        expect.objectContaining({ timezone: "UTC" })
      );
    });
  });
});

