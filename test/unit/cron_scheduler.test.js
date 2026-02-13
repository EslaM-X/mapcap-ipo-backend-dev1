/**
 * Cron Scheduler Unit Tests - Automation Engine v1.6 (ESM Stabilized)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * PURPOSE: 
 * Validates the Automated Task Orchestrator. Ensures Daily Pricing, Final 
 * Settlement, and Monthly Vesting jobs are correctly scheduled and triggered.
 */

import { jest } from '@jest/globals';

/**
 * STRATEGY: ESM Mocking for node-cron
 * Resolves: "ReferenceError: require is not defined" in Termux.
 */
jest.unstable_mockModule('node-cron', () => ({
  default: {
    schedule: jest.fn()
  }
}));

// Dynamic imports to ensure Mocks are applied before the scheduler loads
const { default: cron } = await import('node-cron');
const { default: CronScheduler } = await import('../../src/jobs/cron.scheduler.js');

describe('Cron Scheduler - Automation Logic Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * TEST: Initialization & Task Count
   * Requirement: Daniel's Audit - Should initialize exactly 3 core automated tasks.
   */
  test('Orchestration: Should initialize all 3 core automated tasks on boot', () => {
    CronScheduler.init();
    
    // Verifying that the scheduler registered 3 distinct tasks
    expect(cron.schedule).toHaveBeenCalledTimes(3);
  });

  /**
   * TEST: Daily Price Schedule (Task 1)
   * Requirement: Must run at Midnight UTC to sync with market opening.
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
   * Requirement: Automated tranche release on the 1st of every month.
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
   * Requirement: IPO Closure Protocol - Triggers on the 28th day.
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
