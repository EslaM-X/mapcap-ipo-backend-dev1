/**
 * ResponseHelper - API Standardization Utility v1.4.2
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Enforces a strict, predictable JSON structure for all API communications.
 * This standardization is critical for the 'Pulse Dashboard' synchronization
 * and ensures Daniel's audit logs capture every system interaction.
 * -------------------------------------------------------------------------
 * UPDATES:
 * - Documentation: Enhanced professional JSDoc headers.
 * - Stability: Retained legacy keys ('status', 'success') for Frontend parity.
 * - Compliance: Integrated unique Trace ID logic for error forensics.
 */

import { writeAuditLog } from '../config/logger.js';

class ResponseHelper {
  /**
   * @method success
   * @desc Dispatches a standardized success payload for IPO and A2UaaS operations.
   * Ensures the Frontend receives consistent 'OK' status and data encapsulation.
   * @param {object} res - Express response object.
   * @param {string} message - Human-readable success description.
   * @param {object} data - Payload (Market stats, Pioneer balances, etc.).
   */
  static success(res, message, data = {}) {
    return res.status(200).json({
      success: true,
      status: "OK", // Critical for Frontend state management
      message,
      timestamp: new Date().toISOString(),
      data
    });
  }

  /**
   * @method error
   * @desc Dispatches a structured error response for security or financial failures.
   * Generates a forensic Trace ID for Daniel's compliance tracking.
   * @param {object} res - Express response object.
   * @param {string} message - Sanitized error message for UI display.
   * @param {number} statusCode - Standard HTTP status code (4xx, 5xx).
   */
  static error(res, message, statusCode = 500) {
    /**
     * TRACE ID GENERATION:
     * Generates a unique identifier for audit log reconciliation.
     * Format: ERR-[TIMESTAMP_BASE36]-[RANDOM_SALT]
     */
    const traceId = `ERR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    // Log the anomaly into the permanent audit trail for forensic review
    try {
      writeAuditLog('ERROR', `[${traceId}] Code: ${statusCode} | Message: ${message}`);
    } catch (logError) {
      // Fallback console log if the dedicated logger fails
      console.error(`[CRITICAL_LOGGER_FAILURE]: ${logError.message}`);
    }

    return res.status(statusCode).json({
      success: false,
      status: "FAIL", // Critical for Frontend global interceptors
      message,
      timestamp: new Date().toISOString(),
      error: {
        code: statusCode,
        trace_id: traceId,
        // Documentation link for standardized error resolution
        documentation: "https://docs.map-of-pi.com/errors" 
      }
    });
  }
}

export default ResponseHelper;
