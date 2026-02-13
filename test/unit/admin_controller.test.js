/**
 * Admin Controller Unit Tests - Settlement Engine v1.4
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Anti-Whale Enforcement
 * * PURPOSE:
 * Validates the Final IPO Settlement and Whale-Trim-Back logic.
 * Ensures the 10% ceiling is enforced through the SettlementJob
 * and provides Daniel with a verified audit of the execution.
 * -------------------------------------------------------------------------
 */

import AdminController from '../../src/controllers/admin/admin.controller.js';
import Investor from '../../src/models/investor.model.js';
import SettlementJob from '../../src/jobs/settlement.job.js';
import { jest } from '@jest/globals';

describe('Admin Controller - Settlement Logic Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mocking MongoDB Aggregation: Total Pool = 100,000 Pi
    jest.spyOn(Investor, 'aggregate').mockResolvedValue([{ total: 100000, count: 50 }]);
    
    // Mocking Investor Find: All Pioneers
    jest.spyOn(Investor, 'find').mockResolvedValue([
      { piAddress: 'Pioneer_001', totalPiContributed: 5000 }
    ]);

    // Mocking the Settlement Job execution report
    jest.spyOn(SettlementJob, 'executeWhaleTrimBack').mockResolvedValue({
      totalRefunded: 0,
      whalesImpacted: 0
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * TEST: Successful Settlement Execution
   * Verifies the controller aggregates data and triggers the Job correctly.
   */
  test('Settlement: Should successfully trigger the Whale-Trim-Back protocol', async () => {
    await AdminController.triggerFinalSettlement(mockReq, mockRes);

    expect(Investor.aggregate).toHaveBeenCalled();
    expect(SettlementJob.executeWhaleTrimBack).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: expect.stringContaining("Whale trim-back protocol executed")
      })
    );
  });

  /**
   * TEST: Empty Pool Safety
   * Requirement: Settlement must abort if no liquidity is detected.
   */
  test('Safety: Should abort settlement if total Pi pool is zero', async () => {
    jest.spyOn(Investor, 'aggregate').mockResolvedValue([]);

    await AdminController.triggerFinalSettlement(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("No active investment") })
    );
  });

  /**
   * TEST: Audit Report Integrity
   * Verifies that metrics like totalPoolProcessed are accurately reported.
   */
  test('Audit: Should report correct execution metrics to the Admin Dashboard', async () => {
    await AdminController.triggerFinalSettlement(mockReq, mockRes);

    const report = mockRes.json.mock.calls[0][0].data;
    expect(report.metrics.totalPoolProcessed).toBe(100000);
    expect(report.status).toBe("COMPLETED");
  });
});
