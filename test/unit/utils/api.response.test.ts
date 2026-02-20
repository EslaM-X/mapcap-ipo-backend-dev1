/**
 * API Response & Error Handling Unit Tests - Standardization v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented Partial<Request> and Partial<Response> for type-safe Express mocking.
 * - Formalized Trace ID validation (ERR- prefix check).
 * - Enforced strict production security checks (Stack trace suppression).
 * - Validated global status code propagation (403, 500, etc.).
 */

import ResponseHelper from '../../../src/utils/response.helper.js';
import errorMiddleware from '../../../src/middlewares/error.middleware.js';
import { jest } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';

describe('Global API Consistency - Response & Error Resilience', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { originalUrl: '/api/v1/pulse/metrics' };
    mockRes = {
      statusCode: 200, // Initial default status for Express
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn() as NextFunction;
    
    // Suppression of console error logs to maintain clean test telemetry
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    // Resetting environment variable to avoid side effects between tests
    delete process.env.NODE_ENV;
  });

  /**
   * SECTION 1: RESPONSE HELPER (Standard Success/Error)
   * Requirement: Philip's UI Spec - Standardized JSON for Pulse Dashboard sync.
   */
  describe('ResponseHelper - Output Formatting', () => {

    test('Success: Should return a 200 status with standardized data and timestamp', () => {
      const message = "Pulse Stats Updated";
      const data = { spotPrice: 4.3636 };

      ResponseHelper.success(mockRes as Response, message, data);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        status: "OK",
        message: message,
        data: data,
        timestamp: expect.any(String)
      }));
    });

    test('Error Handling: Should generate a unique Trace ID prefixed with ERR-', () => {
      const errorMessage = "Invalid Wallet Format";
      const statusCode = 400;

      ResponseHelper.error(mockRes as Response, errorMessage, statusCode);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      const responseBody = (mockRes.json as jest.Mock).mock.calls[0][0];

      // Audit Requirement: Trace ID is vital for Daniel's debugging without leaking system internals
      expect(responseBody.success).toBe(false);
      expect(responseBody.error.trace_id).toMatch(/^ERR-/);
      expect(responseBody.error.code).toBe(400);
    });
  });

  /**
   * SECTION 2: ERROR MIDDLEWARE (Global Exception Catching)
   * Requirement: Resilience Spec - High-availability exception normalization.
   */
  describe('Error Middleware - Global Resilience & Privacy', () => {

    test('Capture: Should normalize unhandled exceptions to a 500 JSON response', () => {
      const error = new Error('Unexpected Pi SDK Timeout');
      
      errorMiddleware(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
          success: false, 
          message: 'Unexpected Pi SDK Timeout' 
        })
      );
    });

    test('Security: Should hide sensitive stack traces in production mode', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Database Password Failure');

      errorMiddleware(error, mockReq as Request, mockRes as Response, mockNext);

      const responseJson = (mockRes.json as jest.Mock).mock.calls[0][0];
      
      // Daniel's Compliance: Do NOT leak internal code paths to the public API
      expect(responseJson.message).toBe('Database Password Failure');
      expect(responseJson).not.toHaveProperty('stack');
    });

    test('Propagation: Should maintain the existing HTTP status code (e.g., 403 Forbidden)', () => {
      (mockRes as any).statusCode = 403;
      const error = new Error('Administrative Privileges Required');

      errorMiddleware(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });
});

