/**
 * Daily Automation & Pricing Integrity - Unified Suite v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented ESM-compliant mocking for 'node-cron' via unstable_mockModule.
 * - Formalized PriceResult interface for 6-decimal precision validation.
 * - Synchronized scheduling strings with the 2026 IPO Roadmap.
 * - Enforced strict timezone (UTC) checks for compliance audit.
 */

import { jest } from '@jest/globals';

// --- ESM Mocking Strategy for node-cron ---
// This ensures that actual timers are not triggered during the unit test.
jest.unstable_mockModule('node-cron', () => ({
  default: { 
    schedule: jest.fn() 
  }
}));

// Dynamic imports to satisfy ESM requirements and Mocking order
const { default: cron } = await import('node-cron');
const { default: CronScheduler } = await import('../../../src/jobs/cron.scheduler.js');
const { default: DailyPriceJob } = await import('../../../src/jobs/daily-price-update.js');
const { default: Investor } = await import('../../../src/models/investor.model.js');

describe('Daily Automation & Market Logic - Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // Default Mock: Total Pool = 100,000 Pi for precise price calculations
    jest.spyOn(Investor, 'aggregate').mockResolvedValue([{ totalPool: 100000 }]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: MARKET RECALIBRATION LOGIC
   * Requirement: Spot Price must be (Total Supply / Total Pool) with 6-decimal precision.
   */
  describe('Daily Price Job - Financial Precision', () => {

    test('Recalibration: Should calculate correct spot price with 6-decimal precision', async () => {
      const result = await DailyPriceJob.updatePrice();

      /**
       * CALCULATION AUDIT:
       * 2,181,818 (Fixed Supply) / 100,000 (Current Pool) = 21.818180
       */
      expect(result.totalPiInvested).toBe(100000);
      expect(result.newPrice).toBe("21.818180"); 
    });

    test('Safety: Should return a 0.000000 price when total liquidity is zero', async () => {
      // Logic: Prevent NaN/Infinity errors in Frontend charts and dashboards.
      jest.spyOn(Investor, 'aggregate').mockResolvedValue([]);
      const result = await DailyPriceJob.updatePrice();

      expect(result.newPrice).toBe("0.000000");
    });

    test('Audit: Should include a valid ISO timestamp for the price snapshot', async () => {
      const result = await DailyPriceJob.updatePrice();
      expect(new Date(result.timestamp).getTime()).not.toBeNaN();
    });
  });

  /**
   * SECTION 2: CRON SCHEDULER ORCHESTRATION
   * Requirement: Automated tasks must trigger at exact intervals for Daniel's Compliance.
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
