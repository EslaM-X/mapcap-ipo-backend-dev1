/**
 * Security & Validation Middleware - Unified Guard Suite v1.5.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Philip's Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * This suite acts as the primary firewall for the MapCap API. It unifies
 * Administrative Gatekeeping (Auth) with Financial Request Validation,
 * ensuring zero unauthorized access and strict numerical range enforcement.
 * -------------------------------------------------------------------------
 */

import adminAuth from '../../../src/middlewares/auth.middleware.js';
import { validateWithdrawal } from '../../../src/middlewares/validate.middleware.js';
import { jest } from '@jest/globals';

describe('API Guard - Security & Validation Unit Tests', () => {
  let mockReq, mockRes, nextFunction;

  beforeEach(() => {
    // Standard Mock Setup for Express Objects
    mockReq = {
      headers: {},
      body: {},
      ip: '127.0.0.1'
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
    
    // Setup Environment for Auth
    process.env.ADMIN_SECRET_TOKEN = 'CORE_SECURE_TOKEN_XYZ';
    
    // Silence warnings for clean test telemetry
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: ADMINISTRATIVE AUTHENTICATION (Daniel's Protocol)
   * Validates the x-admin-token gatekeeper for sensitive financial ops.
   *
   */
  describe('Admin Auth Middleware - Access Control', () => {

    test('Access: Should grant entry (next()) when a valid x-admin-token is provided', () => {
      mockReq.headers['x-admin-token'] = 'CORE_SECURE_TOKEN_XYZ';
      adminAuth(mockReq, mockRes, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
    });

    test('Protection: Should return 403 Forbidden for invalid or missing tokens', () => {
      mockReq.headers['x-admin-token'] = 'INTRUDER_TOKEN';
      adminAuth(mockReq, mockRes, nextFunction);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: "FORBIDDEN" })
      );
    });
  });

  /**
   * SECTION 2: FINANCIAL DATA VALIDATION (Philip's Logic)
   * Ensures withdrawal percentages are strictly within the 0.01% - 100% range.
   *
   */
  describe('Withdrawal Validation - Financial Guard', () => {

    test('Integrity: Should parse and allow valid withdrawal percentages (e.g., 50%)', () => {
      mockReq.body = { percentage: "50", userWallet: "GBV...ADDR" };
      validateWithdrawal(mockReq, mockRes, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockReq.body.percentage).toBe(50); // Verified: String-to-Number parsing
    });

    test('Safety: Should reject missing metadata or out-of-range percentages (>100% or <=0%)', () => {
      // Test Case: Over 100%
      mockReq.body = { percentage: 150, userWallet: "GBV...ADDR" };
      validateWithdrawal(mockReq, mockRes, nextFunction);
      expect(mockRes.status).toHaveBeenCalledWith(400);

      // Test Case: Negative/Zero
      mockReq.body.percentage = 0;
      validateWithdrawal(mockReq, mockRes, nextFunction);
      expect(mockRes.status).toHaveBeenLastCalledWith(400);
    });

    test('Compliance: Should return 400 if the mandatory userWallet is missing', () => {
      mockReq.body = { percentage: 10 }; // Missing wallet
      validateWithdrawal(mockReq, mockRes, nextFunction);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
