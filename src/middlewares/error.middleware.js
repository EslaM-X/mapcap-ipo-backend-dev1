/**
 * Global Error Handling Middleware v1.3.5
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: High-Availability Standards
 * ---------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Catches all unhandled exceptions across the API lifecycle.
 * Prevents application crashes within the Pi Browser and ensures 
 * a professional, standardized error response for Pioneers.
 * ---------------------------------------------------------
 */

import ResponseHelper from '../utils/response.helper.js';

/**
 * @function errorMiddleware
 * @desc Centralized error interceptor for the Express framework.
 * @access Global System Layer
 */
const errorMiddleware = (err, req, res, next) => {
    /**
     * STATUS CODE RESOLUTION:
     * Defaults to 500 (Internal Server Error) if the preceding 
     * controller failed to specify a status.
     */
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    /**
     * DANIEL'S AUDIT PROTOCOL:
     * Critical for compliance monitoring. Logs the exact error trace 
     * to the server console for real-time backend debugging.
     */
    console.error(`[FATAL_SYSTEM_ERROR] ${new Date().toISOString()}: ${err.message}`);

    /**
     * PRODUCTION PRIVACY & SECURITY:
     * The code 'stack' trace is strictly hidden in production environments 
     * to prevent exposing system internals or vulnerabilities to end-users.
     */
    const errorPayload = {
        message: err.message || "An unexpected system anomaly occurred. Pipeline offline.",
        // Stack trace is only visible in development for EslaM-X's debugging
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
        errorCode: statusCode,
        requestPath: req.originalUrl
    };

    /**
     * STANDARDIZED RESPONSE:
     * Dispatches the error via ResponseHelper to maintain consistent 
     * JSON structures for the Frontend 'Pulse Dashboard'.
     */
    return ResponseHelper.error(res, errorPayload.message, statusCode);
};

export default errorMiddleware;
