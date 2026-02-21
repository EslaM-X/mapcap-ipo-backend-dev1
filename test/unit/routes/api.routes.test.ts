/**
 * Unified API & IPO Routes Unit Tests - Communication Layer v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's "White-Label" & Daniel's Audit
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented Partial<Response> for type-safe Express mocking.
 * - Formalized route stack traversal for Express 4.x/5.x compatibility.
 * - Synchronized A2UaaS withdrawal sequence validation.
 * - Enforced strict parameter checks for 'GBV...VALID_ADDR' consistency.
 */

import apiRouter from '../../../src/routes/api.js';
import ipoRouter from '../../../src/routes/ipo.routes.js';
import PayoutService from '../../../src/services/payout.service.js';
import { jest } from '@jest/globals';
import { Request, Response } from 'express';

describe('API & IPO Routing Architecture - Integrity Tests', () => {
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    // Ensuring a clean state for Daniel's audit-trail simulation
    jest.clearAllMocks();
  });

  /**
   * SECTION 1: GLOBAL PULSE & STATS (Philip's Requirements)
   */
  describe('Global Stats & Health Endpoints', () => {
    
    test('Pulse: GET /stats should deliver synchronized scarcity engine metrics', async () => {
      const mockReq = {} as Request;
      // Search the router stack for the specific endpoint
      const statsRoute = apiRouter.stack.find(s => s.route?.path === '/stats');
      
      await statsRoute.route.stack[0].handle(mockReq, mockRes as Response, () => {});

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const lastCall = (mockRes.json as jest.Mock).mock.calls[0][0];
      
      // Critical check for Frontend 'Pulse Dashboard' compatibility
      expect(lastCall.data).toHaveProperty('spotPrice');
      expect(lastCall.data.compliance.whaleShield).toBe('Active');
    });

    test('Health: GET /status should confirm "Daniel_Audit_Ready" operational state', async () => {
      const mockReq = {} as Request;
      const statusRoute = ipoRouter.stack.find(s => s.route?.path === '/status');
      
      await statusRoute.route.stack[0].handle(mockReq, mockRes as Response, () => {});

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        status: "Operational"
      }));
    });
  });

  /**
   * SECTION 2: PAYMENT & PAYOUT PIPELINES (A2UaaS Security)
   */
  describe('Financial Transaction Mapping', () => {

    test('Payment: POST /invest must map to PaymentController logic', () => {
      const route = ipoRouter.stack.find(s => s.route?.path === '/invest' && s.route?.methods.post);
      expect(route).toBeDefined();
      // Verifying naming convention to prevent Frontend-to-Backend linkage breakage
      expect(route.route.stack[0].name).toBe('processInvestment');
    });

    test('A2UaaS: POST /withdraw should securely trigger PayoutService sequence', async () => {
      const mockReq = {
        body: { userWallet: 'GBV...VALID_ADDR', amount: 500 }
      } as Request;

      // Mocking PayoutService to simulate Pi Network SDK response for A2UaaS
      jest.spyOn(PayoutService, 'executeA2UPayout').mockResolvedValue({ txId: 'pi_tx_test_123' } as any);

      const withdrawHandler = apiRouter.stack.find(s => s.route?.path === '/withdraw').route.stack[0].handle;
      await withdrawHandler(mockReq, mockRes as Response, () => {});

      expect(PayoutService.executeA2UPayout).toHaveBeenCalledWith('GBV...VALID_ADDR', 500);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('Security: POST /withdraw should intercept and reject missing wallet parameters', async () => {
      const mockReq = { body: { amount: 1000 } } as Request;

      const withdrawHandler = apiRouter.stack.find(s => s.route?.path === '/withdraw').route.stack[0].handle;
      await withdrawHandler(mockReq, mockRes as Response, () => {});

      // Daniel's protocol: Fail fast on incomplete financial data to save gas/fees
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(PayoutService.executeA2UPayout).not.toHaveBeenCalled();
    });
  });
});
