/**
 * ResponseHelper - API Standardization Utility v1.2
 * ---------------------------------------------------------
 * Architect: Eslam Kora | AppDev @Map-of-Pi
 * Purpose: 
 * Ensures all API responses follow a strict, immutable structure.
 * Standardizes communication between Node.js and the MapCap Frontend.
 */

class ResponseHelper {
  /**
   * success
   * Standardized Success Response for IPO transactions and stats.
   * @param {object} res - Express response object.
   * @param {string} message - Descriptive success status.
   * @param {object} data - The validated dataset (Value 1, 2, 3, or 4).
   */
  static success(res, message, data = {}) {
    return res.status(200).json({
      success: true,
      message,
      timestamp: new Date().toISOString(), // Vital for Daniel's Audit trail
      data
    });
  }

  /**
   * error
   * Unified Error Handler for financial failures or SDK disconnects.
   * @param {object} res - Express response object.
   * @param {string} message - Human-readable error for the Pioneer.
   * @param {number} statusCode - Standard HTTP status (400, 401, 403, 500).
   */
  static error(res, message, statusCode = 500) {
    // Audit Logging: Records the error locally before sending to user
    console.error(`[API_ERROR] ${statusCode} - ${message}`);

    return res.status(statusCode).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
      error_code: statusCode,
      // Trace ID could be added here for enterprise-level debugging
    });
  }
}

// Exporting as ES Module to align with project configuration
export default ResponseHelper;
