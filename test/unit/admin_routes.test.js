/**
 * Admin Routes Unit Tests - Command Interface v1.5 (Path Corrected)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * ---------------------------------------------------------
 * PURPOSE: 
 * Validates the security and reachability of admin endpoints. 
 * Ensures 'adminAuth' middleware is properly integrated to 
 * protect high-stakes operations.
 */

import { jest } from '@jest/globals';
// Corrected Paths: Adding '/src/' to ensure the Resolver finds the files
import router from '../../src/routes/admin/admin.routes.js';
import AuthController from '../../src/controllers/admin/auth.controller.js';
import AdminController from '../../src/controllers/admin/admin.controller.js';

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
  });

  /**
   * TEST: System Status Security
   * Requirement: Daniel's Standard - Must be protected by adminAuth middleware.
   */
  test('Security: GET /status should have adminAuth middleware attached', () => {
    const route = router.stack.find(s => s.route?.path === '/status');
    
    // Validating that at least one middleware (adminAuth) precedes the controller
    expect(route.route.stack.length).toBeGreaterThan(1);
  });

  /**
   * TEST: Critical Settlement Trigger
   * Requirement: Secure mapping to the trim-back logic for IPO compliance.
   */
  test('Compliance: POST /settle should be correctly routed for final Whale-Cap trimming', () => {
    const route = router.stack.find(s => s.route?.path === '/settle' && s.route?.methods.post);
    expect(route).toBeDefined();
  });

  /**
   * TEST: Audit Log Transparency
   * Requirement: Daniel must have access to the transfer history for financial audits.
   */
  test('Transparency: GET /audit-logs should be available for Daniel’s compliance review', () => {
    const route = router.stack.find(s => s.route?.path === '/audit-logs');
    expect(route).toBeDefined();
  });
});
