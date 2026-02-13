/**
 * Admin Auth Controller Unit Tests - Security v1.4
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * * PURPOSE:
 * Validates Administrative Authentication and JWT Issuance.
 * Ensures the 'System Health' engine correctly reports operational metrics.
 * -------------------------------------------------------------------------
 */

import AuthController from '../../src/controllers/admin/auth.controller.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

describe('Admin Auth Controller - Security Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
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
    
    // Environment Setup
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD = 'MapCap2026';
    process.env.ADMIN_SECRET_TOKEN = 'test_secret_key';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * TEST: Successful Admin Login
   * Verifies that correct credentials return a 24h JWT token.
   */
  test('Login Success: Should return a signed JWT token for valid credentials', async () => {
    await AuthController.adminLogin(mockReq, mockRes);

    const response = mockRes.json.mock.calls[0][0];
    expect(response.success).toBe(true);
    expect(response.data.token).toBeDefined();
    
    // Verify JWT payload
    const decoded = jwt.verify(response.data.token, 'test_secret_key');
    expect(decoded.user).toBe('admin');
    expect(decoded.role).toBe('SUPER_ADMIN');
  });

  /**
   * TEST: Failed Login Attempt
   * Requirement: Return 401 Unauthorized for incorrect passwords.
   */
  test('Security: Should block access and return 401 for invalid credentials', async () => {
    mockReq.body.password = 'WRONG_PASSWORD';

    await AuthController.adminLogin(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  /**
   * TEST: System Health Synchronization
   * Ensures the 'IPO Pulse' status reports correct environmental data.
   */
  test('System Health: Should report operational status and node version', async () => {
    await AuthController.getSystemStatus(mockReq, mockRes);

    const data = mockRes.json.mock.calls[0][0].data;
    expect(data.status).toBe("Operational");
    expect(data.engine).toBe("MapCap_Pulse_v1.4");
    expect(data.nodeVersion).toBe(process.version);
  });
});

