/**
 * Error Middleware Unit Tests - Resilience v1.3
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: High-Availability Standards
 * * PURPOSE:
 * Validates the Global Exception Interceptor.
 * Ensures privacy in production and accurate error reporting
 * during high-stakes financial operations.
 * ---------------------------------------------------------
 */

import errorMiddleware from '../../src/middlewares/error.middleware.js';
import ResponseHelper from '../../src/utils/response.helper.js';
import { jest } from '@jest/globals';

describe('Error Middleware - Safety & Privacy Tests', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { originalUrl: '/api/v1/ipo/stats' };
    mockRes = {
      statusCode: 200,
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    
    // Silence console.error for clean test logs
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * TEST: Standard Error Catching
   * Requirement: Should convert a 200 status to 500 when an error is caught.
   */
  test('Capture: Should return 500 if an error occurs but status was 200', () => {
    const error = new Error('Database Connection Lost');
    
    errorMiddleware(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ 
        success: false, 
        message: 'Database Connection Lost' 
      })
    );
  });

  /**
   * TEST: Production Privacy (Security Check)
   * Requirement: Stack traces must NOT be visible in production.
   */
  test('Security: Should hide stack trace when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    const error = new Error('Sensitive SQL Query Failed');

    errorMiddleware(error, mockReq, mockRes, mockNext);

    const responseData = mockRes.json.mock.calls[0][0];
    
    // Ensure the message is sent but stack is absent
    expect(responseData.message).toBe('Sensitive SQL Query Failed');
    expect(responseData).not.toHaveProperty('stack');
  });

  /**
   * TEST: Custom Status Propagation
   * Requirement: Should maintain the existing status code if already set (e.g., 404, 403).
   */
  test('Propagation: Should maintain 403 status for authorization errors', () => {
    mockRes.statusCode = 403;
    const error = new Error('Admin Access Required');

    errorMiddleware(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
  });
});

