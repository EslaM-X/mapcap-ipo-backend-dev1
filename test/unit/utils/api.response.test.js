/**
 * API Response & Error Handling Unit Tests - Standardization v1.5.0
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Validates the consistency of the Global API Output and Error Interception.
 * Ensures that Success/Error payloads are predictable for Frontend sync,
 * audit-ready for Daniel, and resilient against data leaks in production.
 * -------------------------------------------------------------------------
 */

import ResponseHelper from '../../../src/utils/response.helper.js';
import errorMiddleware from '../../../src/middlewares/error.middleware.js';
import { jest } from '@jest/globals';

describe('Global API Consistency - Response & Error Resilience', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { originalUrl: '/api/v1/pulse/metrics' };
    mockRes = {
      statusCode: 200, // Initial default status
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    
    // Suppression of console error logs to maintain clean test telemetry
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * SECTION 1: RESPONSE HELPER (Standard Success/Error)
   * Requirement: Philip's UI Spec - All responses must be JSON objects 
   * with a mandatory 'success' flag and 'timestamp' for sorting.
   */
  describe('ResponseHelper - Output Formatting', () => {

    test('Success: Should return a 200 status with standardized data and timestamp', () => {
      const message = "Pulse Stats Updated";
      const data = { spotPrice: 4.3636 };

      ResponseHelper.success(mockRes, message, data);

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

      ResponseHelper.error(mockRes, errorMessage, statusCode);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      const responseBody = mockRes.json.mock.calls[0][0];

      // Requirement: Trace ID is vital for Daniel's audit/debugging
      expect(responseBody.success).toBe(false);
      expect(responseBody.error.trace_id).toMatch(/^ERR-/);
      expect(responseBody.error.code).toBe(400);
    });
  });

  /**
   * SECTION 2: ERROR MIDDLEWARE (Global Exception Catching)
   * Requirement: Resilience Spec - High-availability must convert runtime 
   * crashes into clean JSON responses without leaking server secrets.
   */
  describe('Error Middleware - Global Resilience & Privacy', () => {

    test('Capture: Should normalize unhandled exceptions to a 500 JSON response', () => {
      const error = new Error('Unexpected Pi SDK Timeout');
      
      errorMiddleware(error, mockReq, mockRes, mockNext);

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

      errorMiddleware(error, mockReq, mockRes, mockNext);

      const responseJson = mockRes.json.mock.calls[0][0];
      
      // Daniel's Compliance: Do NOT leak internal code paths to the public API
      expect(responseJson.message).toBe('Database Password Failure');
      expect(responseJson).not.toHaveProperty('stack');
    });

    test('Propagation: Should maintain the existing HTTP status code (e.g., 403 Forbidden)', () => {
      mockRes.statusCode = 403;
      const error = new Error('Administrative Privileges Required');

      errorMiddleware(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });
});

