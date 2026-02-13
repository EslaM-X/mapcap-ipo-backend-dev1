/**
 * Cron Scheduler Unit Tests - Automation Engine v1.5
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Validates the Automated Task Orchestrator.
 * Ensures Daily Pricing, Final Settlement, and Monthly Vesting 
 * jobs are correctly scheduled and triggered within the UTC timeline.
 * -------------------------------------------------------------------------
 */

import CronScheduler from '../../src/jobs/cron.scheduler.js';
import cron from 'node-cron';
import DailyPriceJob from '../../src/jobs/daily-price-update.js';
import VestingJob from '../../src/jobs/vesting.job.js';
import { jest } from '@jest/globals';

// Mocking node-cron to intercept scheduling without waiting for real time
jest.mock('node-cron', () => ({
  schedule: jest.fn()
}));

describe('Cron Scheduler - Automation Logic Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * TEST: Initialization & Task Count
   * Requirement: Should initialize 3 core automated tasks.
   */
  test('Orchestration: Should initialize all 3 core automated tasks on boot', () => {
    CronScheduler.init();
    
    // Check if cron.schedule was called 3 times (Price, Settlement, Vesting)
    expect(cron.schedule).toHaveBeenCalledTimes(3);
  });

  /**
   * TEST: Daily Price Schedule (Task 1)
   * Requirement: Must run at Midnight UTC (0 0 * * *).
   */
  test('Scheduling: Daily Price Job must be set for Midnight UTC', () => {
    CronScheduler.init();
    
    expect(cron.schedule).toHaveBeenCalledWith(
      '0 0 * * *', 
      expect.any(Function), 
      expect.objectContaining({ timezone: "UTC" })
    );
  });

  /**
   * TEST: Monthly Vesting Schedule (Task 3)
   * Requirement: Must run on the 1st of every month (0 0 1 * *).
   */
  test('Scheduling: Monthly Vesting must be set for the 1st of each month', () => {
    CronScheduler.init();
    
    expect(cron.schedule).toHaveBeenCalledWith(
      '0 0 1 * *', 
      expect.any(Function), 
      expect.objectContaining({ timezone: "UTC" })
    );
  });

  /**
   * TEST: Whale Settlement Trigger (Task 2)
   * Requirement: Must run on the 28th day for IPO closure (0 23 28 * *).
   */
  test('Scheduling: Final Whale Settlement must trigger at IPO threshold', () => {
    CronScheduler.init();
    
    expect(cron.schedule).toHaveBeenCalledWith(
      '0 23 28 * *', 
      expect.any(Function), 
      expect.objectContaining({ timezone: "UTC" })
    );
  });
});

