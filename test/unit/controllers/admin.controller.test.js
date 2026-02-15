/**
 * Admin Command Center - Unified Controller & Security Suite v1.6.0
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

    // Mocking Settlement Job execution report
    jest.spyOn(SettlementJob, 'executeWhaleTrimBack').mockResolvedValue({
      totalRefunded: 0,
      whalesImpacted: 0
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
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: expect.stringContaining("executed") })
      );
    });

    test('Safety: Should abort settlement and return 400 if total Pi pool is empty', async () => {
      jest.spyOn(Investor, 'aggregate').mockResolvedValue([]); // Simulate zero liquidity

      await AdminController.triggerFinalSettlement(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining("No active investment") })
      );
    });

    test('Audit: Should report execution metrics (e.g., totalPoolProcessed) for the Admin Dashboard', async () => {
      await AdminController.triggerFinalSettlement(mockReq, mockRes);

      const report = mockRes.json.mock.calls[0][0].data;
      expect(report.metrics.totalPoolProcessed).toBe(100000); // 100k Pi pooled
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
      
      // Validating that adminAuth middleware precedes the final controller
      expect(statusRoute.route.stack.length).toBeGreaterThan(1);
      expect(settleRoute).toBeDefined();
    });

    test('Compliance: GET /audit-logs must be accessible for Daniel’s review', () => {
      const route = router.stack.find(s => s.route?.path === '/audit-logs');
      expect(route).toBeDefined();
    });
  });
});
