/**
 * Validation Middleware Unit Tests - Logic Guard v1.2
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Financial Compliance
 * * PURPOSE:
 * Validates the Request Interceptor logic.
 * Ensures withdrawal percentages are strictly enforced within 
 * the 0.01% - 100% range before reaching financial services.
 * ---------------------------------------------------------
 */

import { validateWithdrawal } from '../../src/middlewares/validate.middleware.js';
import { jest } from '@jest/globals';

describe('Validation Middleware - Withdrawal Guard Tests', () => {
  let mockReq, mockRes, nextFunction;

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
    
    // Silence console.warn for clean test output
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * TEST: Valid Input
   * Requirement: Should allow valid percentages and call next().
   */
  test('Success: Should allow a valid 50% withdrawal and call next()', () => {
    mockReq.body = { percentage: "50", userWallet: "GBV...ADDR" };
    
    validateWithdrawal(mockReq, mockRes, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq.body.percentage).toBe(50); // Ensuring it was parsed to a number
  });

  /**
   * TEST: Missing Fields
   * Requirement: Return 400 if mandatory metadata is missing.
   */
  test('Security: Should return 400 if userWallet is missing', () => {
    mockReq.body = { percentage: 10 };

    validateWithdrawal(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  /**
   * TEST: Out of Range (Upper Bound)
   * Requirement: Should block anything over 100%.
   */
  test('Compliance: Should reject withdrawal percentages over 100%', () => {
    mockReq.body = { percentage: 150, userWallet: "GBV...ADDR" };

    validateWithdrawal(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("Invalid range") })
    );
  });

  /**
   * TEST: Out of Range (Lower Bound)
   * Requirement: Should block 0% or negative values.
   */
  test('Compliance: Should reject 0% or negative withdrawal attempts', () => {
    mockReq.body = { percentage: 0, userWallet: "GBV...ADDR" };

    validateWithdrawal(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});

