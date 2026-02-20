/**
 * Unified API & IPO Routes Unit Tests - Communication Layer v1.7.2
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's "White-Label" & Daniel's Audit
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Validates the integrity of API entry points and IPO analytics channels.
 * Ensures the Frontend 'Pulse Dashboard' receives deterministic data and 
 * payment pipelines remain securely mapped to their controllers.
 * -------------------------------------------------------------------------
 */

import apiRouter from '../../../src/routes/api.js';
import ipoRouter from '../../../src/routes/ipo.routes.js';
import PayoutService from '../../../src/services/payout.service.js';
import { jest } from '@jest/globals';

describe('API & IPO Routing Architecture - Integrity Tests', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    // Ensuring a clean state for Daniel's audit-trail simulation
    jest.clearAllMocks();
  });

  /**
   * SECTION 1: GLOBAL PULSE & STATS (Philip's Requirements)
   * Ensures the Dashboard can fetch real-time "Water-Level" metrics.
   */
  describe('Global Stats & Health Endpoints', () => {
    
    test('Pulse: GET /stats should deliver synchronized scarcity engine metrics', async () => {
      const mockReq = {};
      const statsRoute = apiRouter.stack.find(s => s.route?.path === '/stats');
      
      await statsRoute.route.stack[0].handle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const responseData = mockRes.json.mock.calls[0][0];
      
      // Critical check for Frontend compatibility
      expect(responseData.data).toHaveProperty('spotPrice');
      expect(responseData.data.compliance.whaleShield).toBe('Active');
    });

    test('Health: GET /status should confirm "Daniel_Audit_Ready" operational state', async () => {
      const mockReq = {};
      const statusRoute = ipoRouter.stack.find(s => s.route?.path === '/status');
      
      await statusRoute.route.stack[0].handle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        status: "Operational"
      }));
    });
  });

  /**
   * SECTION 2: PAYMENT & PAYOUT PIPELINES (A2UaaS Security)
   * Validates the mapping for Pi Network SDK integration.
   */
  describe('Financial Transaction Mapping', () => {

    test('Payment: POST /invest must map to PaymentController logic', () => {
      const route = ipoRouter.stack.find(s => s.route?.path === '/invest' && s.route?.methods.post);
      expect(route).toBeDefined();
      // Verifying naming convention to prevent Frontend breakage
      expect(route.route.stack[0].name).toBe('processInvestment');
    });

    test('A2UaaS: POST /withdraw should securely trigger PayoutService sequence', async () => {
      const mockReq = {
        body: { userWallet: 'GBV...VALID_ADDR', amount: 500 }
      };

      // Mocking PayoutService to simulate Pi Network SDK response
      jest.spyOn(PayoutService, 'executeA2UPayout').mockResolvedValue({ txId: 'pi_tx_test_123' });

      const withdrawHandler = apiRouter.stack.find(s => s.route?.path === '/withdraw').route.stack[0].handle;
      await withdrawHandler(mockReq, mockRes);

      expect(PayoutService.executeA2UPayout).toHaveBeenCalledWith('GBV...VALID_ADDR', 500);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('Security: POST /withdraw should intercept and reject missing wallet parameters', async () => {
      const mockReq = { body: { amount: 1000 } }; // Missing userWallet

      const withdrawHandler = apiRouter.stack.find(s => s.route?.path === '/withdraw').route.stack[0].handle;
      await withdrawHandler(mockReq, mockRes);

      // Daniel's protocol: Fail fast on incomplete data
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(PayoutService.executeA2UPayout).not.toHaveBeenCalled();
    });
  });
});
