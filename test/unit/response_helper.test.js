/**
 * Response Helper Unit Tests - API Standardization v1.4
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Validates the consistency of JSON response structures.
 * Ensures Success/Error payloads contain the mandatory fields 
 * required for UI synchronization and audit traceability.
 * ---------------------------------------------------------
 */

import ResponseHelper from '../../src/utils/response.helper.js';
import { jest } from '@jest/globals';

describe('Response Helper - API Output Validation', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  /**
   * TEST: Standardized Success Payload
   * Requirement: Must return 200 OK with data and timestamp.
   */
  test('Success: Should return a 200 status with correctly structured data', () => {
    const message = "Stats Synced";
    const data = { piValue: 3.14 };

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

  /**
   * TEST: Standardized Error Payload & Traceability
   * Requirement: Must generate a Trace ID and return correct status code.
   */
  test('Error: Should generate a Trace ID and return the provided status code', () => {
    const errorMessage = "Invalid Transaction";
    const statusCode = 400;

    ResponseHelper.error(mockRes, errorMessage, statusCode);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    const responseJson = mockRes.json.mock.calls[0][0];

    expect(responseJson.success).toBe(false);
    expect(responseJson.error).toHaveProperty('trace_id');
    expect(responseJson.error.trace_id).toMatch(/^ERR-/); // Verification of naming convention
    expect(responseJson.error.code).toBe(400);
  });
});

