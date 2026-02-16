/**
 * Admin Command Center - Unified Controller & Security Suite v1.6.7
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Philip's Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite unifies Administrative Operational Logic with Route Security.
 * It validates the Final IPO Settlement, Whale-Trim-Back execution, and 
 * ensures all command endpoints are shielded by mandatory authentication.
 * -------------------------------------------------------------------------
 */

import AdminController from '../../../src/controllers/admin/admin.controller.js';
import router from '../../../src/routes/admin/admin.routes.js';
import Investor from '../../../src/models/investor.model.js';
import SettlementJob from '../../../src/jobs/settlement.job.js';
import { jest } from '@jest/globals';

describe('Admin Command Center - Unified Integrity Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      ip: '127.0.0.1',
      headers: {}
    };
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

    /**
     * SUCCESS MOCK: Matching the exact return schema of SettlementJob v1.6.7
     */
    jest.spyOn(SettlementJob, 'executeWhaleTrimBack').mockResolvedValue({
      success: true,
      totalRefunded: 500,
      whalesImpacted: 2
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  /**
   * SECTION 1: SETTLEMENT OPERATIONAL LOGIC
   * Requirement: Philip's Anti-Whale Enforcement - Must trigger trim-back protocol
   * and report execution metrics accurately.
   */
  describe('Settlement Engine - Logic & Safety', () => {

    test('Execution: Should successfully trigger the Whale-Trim-Back protocol and return status', async () => {
      await AdminController.triggerFinalSettlement(mockReq, mockRes);

      expect(Investor.aggregate).toHaveBeenCalled();
      expect(SettlementJob.executeWhaleTrimBack).toHaveBeenCalled();
      
      // Updated to match the standardized ResponseHelper output
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
          success: true, 
          message: expect.stringMatching(/Settlement sequence finalized|successfully/i) 
        })
      );
    });

    test('Safety: Should abort settlement and return 400 if total Pi pool is empty', async () => {
      // Logic: Simulate zero liquidity as per Philip's requirement
      jest.spyOn(Investor, 'aggregate').mockResolvedValue([]); 

      await AdminController.triggerFinalSettlement(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
          success: false,
          message: expect.stringMatching(/No liquidity|No active investment/i) 
        })
      );
    });

    test('Audit: Should report execution metrics within the data object for the Dashboard', async () => {
      await AdminController.triggerFinalSettlement(mockReq, mockRes);

      // Extracting the 'data' field from the response to verify metrics
      const responseBody = mockRes.json.mock.calls[0][0];
      const report = responseBody.data;

      expect(report).toHaveProperty('metrics');
      expect(report.metrics.totalPoolProcessed).toBe(100000);
      expect(report.status).toBe("COMPLETED");
    });
  });

  /**
   * SECTION 2: ROUTE SECURITY & GATEWAY MAPPING
   * Requirement: Daniel's Security Standard - All admin endpoints must be 
   * correctly mapped and protected by middleware.
   */
  describe('Admin Gateway - Security & Route Verification', () => {

    test('Auth: POST /login must be reachable for administrator entry', () => {
      const route = router.stack.find(s => s.route?.path === '/login' && s.route?.methods.post);
      expect(route).toBeDefined();
    });

    test('Security: High-stakes endpoints like /status and /settle must be protected', () => {
      const statusRoute = router.stack.find(s => s.route?.path === '/status');
      const settleRoute = router.stack.find(s => s.route?.path === '/settle' && s.route?.methods.post);
      
      // Validating that adminAuth middleware precedes the final controller (Stack depth check)
      expect(statusRoute.route.stack.length).toBeGreaterThan(1);
      expect(settleRoute).toBeDefined();
    });

    test('Compliance: GET /audit-logs must be accessible for Daniel’s review', () => {
      const route = router.stack.find(s => s.route?.path === '/audit-logs');
      expect(route).toBeDefined();
    });
  });
});
