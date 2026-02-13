/**
 * IPO Controller Unit Tests - Pulse Engine v1.7
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Validates the Dashboard Data Aggregator.
 * Ensures the 'Pulse' correctly calculates user gains, 
 * total liquidity, and enforces the 10% Whale-Shield status.
 * ---------------------------------------------------------
 */

import IpoController from '../../src/controllers/ipo.controller.js';
import Investor from '../../src/models/investor.model.js';
import { jest } from '@jest/globals';

describe('IPO Controller - Dashboard Logic Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Identity resolution mock for Pi Network Auth
    mockReq = {
      user: { uid: 'test-pioneer-001' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Mocking MongoDB Model methods to ensure deterministic results
    jest.spyOn(Investor, 'aggregate').mockResolvedValue([{ totalPi: 100000, investorCount: 50 }]);
    jest.spyOn(Investor, 'findOne').mockResolvedValue({ 
      piAddress: 'test-pioneer-001', 
      totalPiContributed: 5000,
      vestingMonthsCompleted: 2 
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * TEST: Dashboard Statistics Aggregation
   * Requirement: Synchronize V1, V2, V3, and V4 for the Pulse UI.
   */
  test('Dashboard Stats: Should deliver accurate financial values (V1-V4)', async () => {
    await IpoController.getScreenStats(mockReq, mockRes);

    const responseData = mockRes.json.mock.calls[0][0].data;

    // Value 1: Total Investors check
    expect(responseData.values.v1_totalInvestors).toBe(50);
    // Value 2: Total Pool formatting check
    expect(responseData.values.v2_totalPool).toBe("100,000.00");
    // Value 4: Capital Gain calculation (5000 * 1.20)
    expect(responseData.values.v4_capitalGain).toBe("6,000.00");
  });

  /**
   * TEST: Whale-Shield Compliance Status
   * Requirement: Status must be COMPLIANT if share is <= 10.0%.
   */
  test('Compliance: Should return COMPLIANT status for shares within the 10% cap', async () => {
    await IpoController.getScreenStats(mockReq, mockRes);

    const compliance = mockRes.json.mock.calls[0][0].data.compliance;
    
    // Analysis: 5,000 stake in 100,000 pool = 5% (Within Limit)
    expect(compliance.isWhale).toBe(false);
    expect(compliance.status).toBe("COMPLIANT");
  });

  /**
   * TEST: Controller Resilience
   * Requirement: Fail gracefully if DB pipeline is offline.
   */
  test('Safety: Should handle database aggregation failures with 500 status', async () => {
    jest.spyOn(Investor, 'aggregate').mockRejectedValue(new Error("DB_OFFLINE"));
    
    await IpoController.getScreenStats(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });
});

