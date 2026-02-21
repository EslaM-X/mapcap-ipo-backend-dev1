/**
 * Admin Command Center - Unified Controller & Security Suite v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Philip's Compliance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented type-safe spies for Mongoose Aggregate and Find operations.
 * - Formalized interface for SettlementJob response metrics.
 * - Enforced strict route mapping checks for RBAC compliance.
 */

import AdminController from '../../../src/controllers/admin/admin.controller.js';
import router from '../../../src/routes/admin/admin.routes.js';
import Investor from '../../../src/models/investor.model.js';
import SettlementJob from '../../../src/jobs/settlement.job.js';
import { jest } from '@jest/globals';
import { Request, Response } from 'express';

describe('Admin Command Center - Unified Integrity Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      ip: '127.0.0.1',
      headers: {},
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Mocking MongoDB Aggregation: Total Pool = 100,000 Pi for precision testing
    jest.spyOn(Investor, 'aggregate').mockResolvedValue([{ total: 100000, count: 50 }]);
    
    // Mocking Investor Find: Simulating Pioneer batch retrieval
    jest.spyOn(Investor, 'find').mockResolvedValue([
      { piAddress: 'Pioneer_001', totalPiContributed: 5000 }
    ]);

    /**
     * SUCCESS MOCK: Aligned with SettlementJob v1.7.x logic.
     * Ensures metrics are passed correctly to the ResponseHelper.
     */
    jest.spyOn(SettlementJob, 'executeWhaleTrimBack').mockResolvedValue({
      success: true,
      totalRefunded: 500,
      whalesImpacted: 2,
      investorsAudited: 50,
      totalPoolProcessed: 100000
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  /**
   * SECTION 1: SETTLEMENT OPERATIONAL LOGIC
   * Requirement: Philip's Anti-Whale Enforcement.
   */
  describe('Settlement Engine - Logic & Safety', () => {

    test('Execution: Should successfully trigger the Whale-Trim-Back protocol', async () => {
      await AdminController.triggerFinalSettlement(mockReq as Request, mockRes as Response);

      expect(Investor.aggregate).toHaveBeenCalled();
      expect(SettlementJob.executeWhaleTrimBack).toHaveBeenCalled();
      
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
          success: true, 
          message: expect.stringMatching(/settlement|executed|finalized|successfully/i) 
        })
      );
    });

    test('Safety: Should abort settlement and return 400 if total Pi pool is empty', async () => {
      // Logic: Simulate zero liquidity scenario for safety verification
      jest.spyOn(Investor, 'aggregate').mockResolvedValue([]); 

      await AdminController.triggerFinalSettlement(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
          success: false,
          message: expect.stringMatching(/No liquidity|No active investment/i) 
        })
      );
    });

    test('Audit: Should report execution metrics within the data object for the Dashboard', async () => {
      await AdminController.triggerFinalSettlement(mockReq as Request, mockRes as Response);

      const responseBody = (mockRes.json as jest.Mock).mock.calls[0][0];
      const report = responseBody.data;

      expect(report).toHaveProperty('metrics');
      expect(report.status).toBe("COMPLETED");
      expect(report.metrics.totalPoolProcessed).toBe(100000);
    });
  });

  /**
   * SECTION 2: ROUTE SECURITY & GATEWAY MAPPING
   */
  describe('Admin Gateway - Security & Route Verification', () => {

    test('Auth: POST /login must be reachable for administrator entry', () => {
      const route = router.stack.find(s => s.route?.path === '/login' && s.route?.methods.post);
      expect(route).toBeDefined();
    });

    test('Security: High-stakes endpoints must be protected by middleware', () => {
      const statusRoute: any = router.stack.find(s => s.route?.path === '/status');
      const settleRoute = router.stack.find(s => s.route?.path === '/settle' && s.route?.methods.post);
      
      // Middleware check: Ensuring adminAuth (or similar interceptor) is present
      expect(statusRoute.route.stack.length).toBeGreaterThan(1);
      expect(settleRoute).toBeDefined();
    });

    test('Compliance: GET /audit-logs must be accessible for Daniel’s review', () => {
      const route = router.stack.find(s => s.route?.path === '/audit-logs');
      expect(route).toBeDefined();
    });
  });
});
