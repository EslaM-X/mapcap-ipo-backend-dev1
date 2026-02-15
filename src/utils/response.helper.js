/**
 * ResponseHelper - API Standardization Utility v1.4.1
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Enforces a strict, predictable JSON structure for all API communications.
 * This standardization is critical for the 'Pulse Dashboard' synchronization
 * and ensures Daniel's audit logs capture every system interaction.
 * -------------------------------------------------------------------------
 */

import { writeAuditLog } from '../config/logger.js';

class ResponseHelper {
  /**
   * @method success
   * @desc Dispatches a standardized success payload for IPO and A2UaaS operations.
   * @param {object} res - Express response object.
   * @param {string} message - Human-readable success description.
   * @param {object} data - Payload (Market stats, Pioneer balances, etc.).
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
   * @desc Dispatches a structured error response for security or financial failures.
   * @param {object} res - Express response object.
   * @param {string} message - Sanitized error message for UI display.
   * @param {number} statusCode - Standard HTTP status code (4xx, 5xx).
   */
  static error(res, message, statusCode = 500) {
    /**
     * TRACE ID GENERATION:
     * Generates a unique, high-visibility identifier for Daniel's compliance tracking.
     * Format: ERR-[TIMESTAMP]-[RANDOM_SALT]
     */
    const traceId = `ERR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    // Log the anomaly into the permanent audit trail for forensic review
    try {
      writeAuditLog('ERROR', `[${traceId}] Code: ${statusCode} | Message: ${message}`);
    } catch (logError) {
      console.error(`[CRITICAL] Logger Failure: ${logError.message}`);
    }

    return res.status(statusCode).json({
      success: false,
      status: "FAIL",
      message,
      timestamp: new Date().toISOString(),
      error: {
        code: statusCode,
        trace_id: traceId,
        // Maintains a professional developer experience for future auditors
        documentation: "https://docs.map-of-pi.com/errors" 
      }
    });
  }
}



export default ResponseHelper;
