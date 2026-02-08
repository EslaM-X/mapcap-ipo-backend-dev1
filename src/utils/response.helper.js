/**
 * ResponseHelper - API Standardization Utility
 * ---------------------------------------------------------
 * Ensures all API responses follow a consistent structure.
 * This is crucial for seamless Frontend integration and 
 * professional error tracking as per Daniel's standards.
 */

class ResponseHelper {
    /**
     * Standard Success Response
     * @param {object} res - Express response object
     * @param {string} message - Success message
     * @param {object} data - Data payload to return
     */
    static success(res, message, data = {}) {
        return res.status(200).json({
            success: true,
            message: message,
            timestamp: new Date().toISOString(),
            data: data
        });
    }

    /**
     * Standard Error Response
     * @param {object} res - Express response object
     * @param {string} message - Error description
     * @param {number} statusCode - HTTP status code (default 500)
     */
    static error(res, message, statusCode = 500) {
        return res.status(statusCode).json({
            success: false,
            message: message,
            timestamp: new Date().toISOString(),
            error_code: statusCode
        });
    }
}

module.exports = ResponseHelper;

