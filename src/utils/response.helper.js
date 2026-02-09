/**
 * ResponseHelper - API Standardization Utility v1.3
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE:
 * Ensures all API responses follow a strict, immutable structure.
 * Standardizes communication between the Node.js Financial Engine 
 * and the MapCap Frontend (Pi Browser / Mobile UI).
 * ---------------------------------------------------------
 */

class ResponseHelper {
  /**
   * @method success
   * @desc Standardized Success Response for IPO transactions and stats.
   * @param {object} res - Express response object.
   * @param {string} message - Professional success status message.
   * @param {object} data - The validated dataset (Values 1-4, etc.).
   */
  static success(res, message, data = {}) {
    return res.status(200).json({
      success: true,
      status: "OK",
      message,
      timestamp: new Date().toISOString(), // Vital for real-time audit trails
      data
    });
  }

  /**
   * @method error
   * @desc Unified Error Handler for financial failures or SDK disconnects.
   * @param {object} res - Express response object.
   * @param {string} message - Human-readable error for the Pioneer UI.
   * @param {number} statusCode - Standard HTTP status (400, 401, 403, 500).
   */
  static error(res, message, statusCode = 500) {
    /**
     * AUDIT LOGGING: 
     * Records the error locally for Daniel's compliance review 
     * before delivering the sanitised error to the end-user.
     */
    console.error(`[AUDIT_LOG_ERROR] Code: ${statusCode} | Msg: ${message} | Time: ${new Date().toISOString()}`);

    return res.status(statusCode).json({
      success: false,
      status: "FAIL",
      message,
      timestamp: new Date().toISOString(),
      error_details: {
        code: statusCode,
        reference: `ERR-${Math.random().toString(36).substr(2, 9).toUpperCase()}` // Unique Trace ID
      }
    });
  }
}

// Exporting as ES Module to align with Vercel/Node.js ES6 configuration
export default ResponseHelper;
