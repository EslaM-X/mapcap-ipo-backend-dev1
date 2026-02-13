/**
 * Security Middleware Unit Tests - Spec-Compliant v1.2
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Audit: Daniel's Security Protocol
 * * PURPOSE:
 * Validates the Administrative Security Gatekeeper.
 * Ensures that only requests with a verified 'x-admin-token' 
 * can access sensitive financial endpoints.
 * ---------------------------------------------------------
 */

import adminAuth from '../../src/middlewares/auth.middleware.js';
import { jest } from '@jest/globals';

describe('Security Middleware - Unit Tests', () => {
  let mockReq, mockRes, nextFunction;

  beforeEach(() => {
    // Mocking the request and response objects
    mockReq = {
      headers: {},
      ip: '127.0.0.1'
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
    
    // Setting up the environment variable for testing
    process.env.ADMIN_SECRET_TOKEN = 'CORE_SECURE_TOKEN_XYZ';
  });

  /**
   * TEST: Authorized Access
   * Requirement: Valid 'x-admin-token' must grant access.
   */
  test('Access Control: Should call next() when a valid admin token is provided', () => {
    mockReq.headers['x-admin-token'] = 'CORE_SECURE_TOKEN_XYZ';
    
    adminAuth(mockReq, mockRes, nextFunction);
    
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  /**
   * TEST: Breach Prevention (Invalid Token)
   * Requirement: Return 403 Forbidden for incorrect tokens.
   */
  test('Breach Prevention: Should return 403 status if token is invalid', () => {
    mockReq.headers['x-admin-token'] = 'WRONG_UNAUTHORIZED_TOKEN';
    
    adminAuth(mockReq, mockRes, nextFunction);
    
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        status: "FORBIDDEN"
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  /**
   * TEST: Missing Credentials
   * Requirement: Block access if 'x-admin-token' header is missing.
   */
  test('Security Audit: Should block access if the auth header is completely missing', () => {
    adminAuth(mockReq, mockRes, nextFunction);
    
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(nextFunction).not.toHaveBeenCalled();
  });
});

