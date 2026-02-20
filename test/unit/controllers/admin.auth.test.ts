/**
 * Admin Auth Controller Unit Tests - Security & Telemetry v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented Partial<Request> and Partial<Response> for type-safe mocking.
 * - Formalized JWT payload verification for 'SUPER_ADMIN' role.
 * - Maintained 2026 Administrative Credentials for environment parity.
 */

import AuthController from '../../../src/controllers/admin/auth.controller.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';
import { Request, Response } from 'express';

describe('Admin Auth Controller - Security & Integrity Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    /**
     * REQUEST MOCKING:
     * Simulating a secure administrative login payload.
     */
    mockReq = {
      body: {
        username: 'admin',
        password: 'MapCap2026'
      }
    };
    
    // Mocking Express Response methods with chainable jest functions
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    // Controlled Environmental Variables for deterministic testing
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD = 'MapCap2026';
    process.env.ADMIN_SECRET_TOKEN = 'test_secret_key';
  });

  afterEach(() => {
    // Resetting mocks to ensure test isolation
    jest.restoreAllMocks();
  });

  /**
   * @test Administrative Authentication & Token Issuance
   * Requirement: Successful validation must return a cryptographically signed JWT.
   */
  test('Login Success: Should generate a secure JWT for authorized administrative access', async () => {
    await AuthController.adminLogin(mockReq as Request, mockRes as Response);

    const response = (mockRes.json as jest.Mock).mock.calls[0][0];
    expect(response.success).toBe(true);
    expect(response.data.token).toBeDefined();
    
    // Verifying JWT payload integrity and role-based claims
    const decoded: any = jwt.verify(response.data.token, 'test_secret_key');
    expect(decoded.user).toBe('admin');
    expect(decoded.role).toBe('SUPER_ADMIN');
  });

  /**
   * @test Unauthorized Access Mitigation
   * Requirement: Daniel's Security Protocol - Any credential mismatch triggers a 401.
   */
  test('Security: Should enforce strict 401 Unauthorized status for invalid credentials', async () => {
    if (mockReq.body) mockReq.body.password = 'PROTECTED_FIELD_MISMATCH';

    await AuthController.adminLogin(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  /**
   * @test System Health & Operational Telemetry
   * Requirement: Philip's Dashboard 'Heartbeat' must reflect real-time node status.
   */
  test('Telemetry: Should provide accurate operational status for the Pulse Dashboard', async () => {
    await AuthController.getSystemStatus(mockReq as Request, mockRes as Response);

    const data = (mockRes.json as jest.Mock).mock.calls[0][0].data;
    expect(data.status).toBe("Operational");
    // Validating engine identifier for Pulse visualizer synchronization
    expect(data.engine).toContain("MapCap_Pulse");
  });
});
