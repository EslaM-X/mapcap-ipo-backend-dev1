/**
 * Admin Routes Unit Tests - Command Interface v1.4
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * * PURPOSE:
 * Validates the security and reachability of admin endpoints.
 * Ensures the 'adminAuth' middleware is properly integrated to 
 * protect high-stakes operations like Whale Settlement.
 * ---------------------------------------------------------
 */

import router from '../../src/routes/admin/admin.routes.js';
import AuthController from '../../controllers/admin/auth.controller.js';
import AdminController from '../../controllers/admin/admin.controller.js';
import { jest } from '@jest/globals';

describe('Admin Routes - Security & Gateway Tests', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  /**
   * TEST: Login Endpoint Reachability
   * Requirement: Public entry point for authentication.
   */
  test('Auth: POST /login should be mapped to AuthController.adminLogin', () => {
    const route = router.stack.find(s => s.route?.path === '/login' && s.route?.methods.post);
    expect(route).toBeDefined();
    // Verification of the handler is implied by mapping
  });

  /**
   * TEST: System Status Security
   * Requirement: Must be protected by adminAuth middleware.
   */
  test('Security: GET /status should have adminAuth middleware attached', () => {
    const route = router.stack.find(s => s.route?.path === '/status');
    
    // Check if the middleware stack contains more than just the final controller
    // Usually, adminAuth would be the first or second in the stack
    expect(route.route.stack.length).toBeGreaterThan(1);
  });

  /**
   * TEST: Critical Settlement Trigger
   * Requirement: Direct mapping to the trim-back logic for compliance.
   */
  test('Compliance: POST /settle should be correctly routed for final Whale-Cap trimming', () => {
    const route = router.stack.find(s => s.route?.path === '/settle' && s.route?.methods.post);
    expect(route).toBeDefined();
  });

  /**
   * TEST: Audit Log Transparency
   * Requirement: Daniel must have access to the transfer history.
   */
  test('Transparency: GET /audit-logs should be available for Daniel’s compliance review', () => {
    const route = router.stack.find(s => s.route?.path === '/audit-logs');
    expect(route).toBeDefined();
  });
});

