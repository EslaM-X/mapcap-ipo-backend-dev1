/**
 * IPO Routes Unit Tests - Analytics & Flow v1.6
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Validates the core IPO communication channels.
 * Ensures the dashboard stats and investment endpoints are 
 * correctly mapped to their respective controllers.
 * ---------------------------------------------------------
 */

import router from '../../src/routes/ipo.routes.js';
import IpoController from '../../src/controllers/ipo.controller.js';
import PaymentController from '../../src/controllers/payment.controller.js';
import { jest } from '@jest/globals';

describe('IPO Routes - Pulse & Payment Mapping Tests', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  /**
   * TEST: Dashboard Stats Reachability
   * Requirement: Philip's "Water-Level" UI depends on this endpoint.
   */
  test('Dashboard: GET /dashboard-stats should be mapped correctly', () => {
    const route = router.stack.find(s => s.route?.path === '/dashboard-stats' && s.route?.methods.get);
    expect(route).toBeDefined();
    // Logic check: ensure it points to the correct Controller method
    expect(route.route.stack[0].name).toBe('getScreenStats');
  });

  /**
   * TEST: Investment Pipeline Entry
   * Requirement: Vital for processing Pi Network SDK callbacks.
   */
  test('Payment: POST /invest should be mapped to PaymentController.processInvestment', () => {
    const route = router.stack.find(s => s.route?.path === '/invest' && s.route?.methods.post);
    expect(route).toBeDefined();
    expect(route.route.stack[0].name).toBe('processInvestment');
  });

  /**
   * TEST: System Health & Compliance Status
   * Requirement: Daniel needs an "Audit-Ready" status for the engine.
   */
  test('Health: GET /status should return 200 and Operational status', async () => {
    const mockReq = {};
    const routeHandler = router.stack.find(s => s.route?.path === '/status').route.stack[0].handle;
    
    await routeHandler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      status: "Operational",
      compliance: "Daniel_Audit_Ready"
    }));
  });
});

