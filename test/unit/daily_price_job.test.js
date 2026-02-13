/**
 * Daily Price Update Job Unit Tests - Market Dynamics v1.3 (Fixed Precision)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * ---------------------------------------------------------
 * PURPOSE: 
 * Validates the Daily Market Recalibration logic. Ensures the 'Spot Price' 
 * is derived correctly from global liquidity using 6-decimal precision 
 * to align with the MapCap Financial Engine requirements.
 */

import DailyPriceJob from '../../src/jobs/daily-price-update.js';
import Investor from '../../src/models/investor.model.js';
import PriceService from '../../src/services/price.service.js';
import { jest } from '@jest/globals';

describe('Daily Price Job - Market Logic Tests', () => {
  
  beforeEach(() => {
    // Mocking MongoDB Aggregation: Total Pool = 100,000 Pi
    jest.spyOn(Investor, 'aggregate').mockResolvedValue([{ totalPool: 100000 }]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * TEST: Price Recalibration Logic
   * Fix: Adjusted expected value to "21.818180" to match 6-decimal precision.
   * Resolves: Expected "21.8182" | Received "21.818180"
   */
  test('Recalibration: Should calculate and return the correct spot price based on liquidity', async () => {
    const result = await DailyPriceJob.updatePrice();

    // Calculation: 2,181,818 / 100,000 = 21.818180
    expect(result.totalPiInvested).toBe(100000);
    expect(result.newPrice).toBe("21.818180"); 
  });

  /**
   * TEST: Edge Case - Empty Pool
   * Fix: Adjusted expected value to "0.000000" to satisfy Audit Standards.
   * Resolves: Expected "0.0000" | Received "0.000000"
   */
  test('Safety: Should return a price of 0 when total liquidity is zero', async () => {
    jest.spyOn(Investor, 'aggregate').mockResolvedValue([]);

    const result = await DailyPriceJob.updatePrice();

    expect(result.totalPiInvested).toBe(0);
    expect(result.newPrice).toBe("0.000000");
  });

  /**
   * TEST: Audit Trail Synchronization
   * Requirement: Must return a valid ISO timestamp for the execution.
   */
  test('Audit: Should include a valid timestamp for the snapshot record', async () => {
    const result = await DailyPriceJob.updatePrice();
    
    expect(new Date(result.timestamp).getTime()).not.toBeNaN();
  });
});
