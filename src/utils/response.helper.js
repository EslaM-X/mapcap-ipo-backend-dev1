/**
 * ResponseHelper - API Standardization Utility v1.4
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Enforces a strict, predictable JSON structure for all responses.
 * Essential for the 'Pulse Dashboard' real-time synchronization.
 * ---------------------------------------------------------
 */

import { writeAuditLog } from '../config/logger.js';

class ResponseHelper {
  /**
   * @method success
   * @desc Standardized Success Response for IPO operations.
   * @param {object} res - Express response object.
   * @param {string} message - Success description.
   * @param {object} data - Payload (Market stats, balances, etc.).
   */
  static success(res, message, data = {}) {
    return res.status(200).json({
      success: true,
      status: "OK",
      message,
      timestamp: new Date().toISOString(),
      data
    });
  }

  /**
   * @method error
   * @desc Standardized Error Response for security/financial failures.
   * @param {object} res - Express response object.
   * @param {string} message - Sanitized message for the UI.
   * @param {number} statusCode - HTTP status code (4xx, 5xx).
   */
  static error(res, message, statusCode = 500) {
    /**
     * TRACE ID GENERATION:
     * Creates a unique identifier for Daniel's compliance tracking.
     */
    const traceId = `ERR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    // Record the failure in the permanent audit log
    writeAuditLog('ERROR', `[${traceId}] Code: ${statusCode} | Message: ${message}`);

    

    return res.status(statusCode).json({
      success: false,
      status: "FAIL",
      message,
      timestamp: new Date().toISOString(),
      error: {
        code: statusCode,
        trace_id: traceId,
        documentation: "https://docs.map-of-pi.com/errors" // Professional touch for devs
      }
    });
  }
}

export default ResponseHelper;
