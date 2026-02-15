/**
 * Admin Auth Controller Unit Tests - Security & Telemetry v1.4.2
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite validates the Administrative Authentication layer and JWT issuance.
 * It also ensures 'System Health' telemetry provides accurate operational 
 * metrics for the 'Pulse Dashboard' without disrupting IPO liquidity flows.
 * -------------------------------------------------------------------------
 */

import AuthController from '../../../src/controllers/admin/auth.controller.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

describe('Admin Auth Controller - Security & Integrity Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    /**
     * REQUEST MOCKING:
     * Simulating a secure administrative login payload.
     * Aligns with the credentials defined in the global deployment spec.
     */
    mockReq = {
      body: {
        username: 'admin',
        password: 'MapCap2026'
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Controlled Environmental Variables for deterministic testing
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD = 'MapCap2026';
    process.env.ADMIN_SECRET_TOKEN = 'test_secret_key';
  });

  afterEach(() => {
    // Resetting mocks to ensure test isolation and prevent state pollution
    jest.restoreAllMocks();
  });

  /**
   * TEST: Administrative Authentication & Token Issuance
   * Requirement: Successful validation must return a cryptographically signed JWT.
   * Ensures the Frontend receives a persistent session for the 24h duration.
   */
  test('Login Success: Should generate a secure JWT for authorized administrative access', async () => {
    await AuthController.adminLogin(mockReq, mockRes);

    const response = mockRes.json.mock.calls[0][0];
    expect(response.success).toBe(true);
    expect(response.data.token).toBeDefined();
    
    // Verifying JWT payload integrity and role-based claims
    const decoded = jwt.verify(response.data.token, 'test_secret_key');
    expect(decoded.user).toBe('admin');
    expect(decoded.role).toBe('SUPER_ADMIN');
  });

  /**
   * TEST: Unauthorized Access Mitigation
   * Requirement: Daniel's Security Protocol - Any credential mismatch triggers a 401.
   * Prevents brute-force escalation and unauthorized dashboard entry.
   */
  test('Security: Should enforce strict 401 Unauthorized status for invalid credentials', async () => {
    mockReq.body.password = 'PROTECTED_FIELD_MISMATCH';

    await AuthController.adminLogin(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  /**
   * TEST: System Health & Operational Telemetry
   * Requirement: Philip's Dashboard 'Heartbeat' must reflect real-time node status.
   * Ensures synchronization between the backend engine and the Pulse visualizer.
   */
  test('Telemetry: Should provide accurate operational status for the Pulse Dashboard', async () => {
    await AuthController.getSystemStatus(mockReq, mockRes);

    const data = mockRes.json.mock.calls[0][0].data;
    expect(data.status).toBe("Operational");
    // Validating engine identifier to ensure correct versioning is reported to UI
    expect(data.engine).toContain("MapCap_Pulse");
  });
});
