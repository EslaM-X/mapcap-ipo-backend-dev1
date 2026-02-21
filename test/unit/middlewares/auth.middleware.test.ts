/**
 * Security & Validation Middleware - Unified Guard Suite v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Philip's Compliance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented Partial<Request> and Partial<Response> for type-safe Express mocking.
 * - Formalized withdrawal schema validation (percentage range 0.01 - 100).
 * - Enforced strict header check for 'x-admin-token'.
 * - Synchronized string-to-number parsing verification for financial payloads.
 */

import adminAuth from '../../../src/middlewares/auth.middleware.js';
import { validateWithdrawal } from '../../../src/middlewares/validate.middleware.js';
import { jest } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';

describe('API Guard - Security & Validation Unit Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    // Standard Mock Setup for Express Objects
    mockReq = {
      headers: {},
      body: {},
      ip: '127.0.0.1'
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    nextFunction = jest.fn() as NextFunction;
    
    // Setup Environment for Auth parity with 2026 spec
    process.env.ADMIN_SECRET_TOKEN = 'CORE_SECURE_TOKEN_XYZ';
    
    // Silence warnings for clean test telemetry during validation failures
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: ADMINISTRATIVE AUTHENTICATION (Daniel's Protocol)
   */
  describe('Admin Auth Middleware - Access Control', () => {

    test('Access: Should grant entry (next()) when a valid x-admin-token is provided', () => {
      if (mockReq.headers) mockReq.headers['x-admin-token'] = 'CORE_SECURE_TOKEN_XYZ';
      
      adminAuth(mockReq as Request, mockRes as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
    });

    test('Protection: Should return 403 Forbidden for invalid or missing tokens', () => {
      if (mockReq.headers) mockReq.headers['x-admin-token'] = 'INTRUDER_TOKEN';
      
      adminAuth(mockReq as Request, mockRes as Response, nextFunction);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ status: "FORBIDDEN" })
      );
    });
  });

  /**
   * SECTION 2: FINANCIAL DATA VALIDATION (Philip's Logic)
   */
  describe('Withdrawal Validation - Financial Guard', () => {

    test('Integrity: Should parse and allow valid withdrawal percentages (e.g., 50%)', () => {
      mockReq.body = { percentage: "50", userWallet: "GBV...ADDR" };
      
      validateWithdrawal(mockReq as Request, mockRes as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      // Verified: Middleware must convert string "50" to number 50 for precision math
      expect(mockReq.body.percentage).toBe(50); 
    });

    test('Safety: Should reject out-of-range percentages (>100% or <=0%)', () => {
      // Test Case: Over 100% (Mathematical impossibility for equity release)
      mockReq.body = { percentage: 150, userWallet: "GBV...ADDR" };
      validateWithdrawal(mockReq as Request, mockRes as Response, nextFunction);
      expect(mockRes.status).toHaveBeenCalledWith(400);

      // Test Case: Zero percentage
      mockReq.body.percentage = 0;
      validateWithdrawal(mockReq as Request, mockRes as Response, nextFunction);
      expect(mockRes.status).toHaveBeenLastCalledWith(400);
    });

    test('Compliance: Should return 400 if the mandatory userWallet is missing', () => {
      // Daniel's requirement: No transaction can proceed without a destination address
      mockReq.body = { percentage: 10 }; 
      
      validateWithdrawal(mockReq as Request, mockRes as Response, nextFunction);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
