/**
 * Global Error Handling Middleware v1.3
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: High-Availability Standards
 * * PURPOSE:
 * Catches all unhandled exceptions across the API lifecycle.
 * Prevents application crashes in the Pi Browser/Mobile UI and 
 * ensures a standardized, professional error response to Pioneers.
 * ---------------------------------------------------------
 */

import ResponseHelper from '../utils/response.helper.js';

/**
 * @function errorMiddleware
 * @desc Centralized error interceptor for Express.
 */
const errorMiddleware = (err, req, res, next) => {
    /**
     * DETERMINING STATUS CODE:
     * Defaults to 500 (Internal Server Error) if no specific status is set.
     */
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    /**
     * AUDIT LOGGING:
     * Critical for Daniel's oversight. Logs the exact error and timestamp 
     * to the server console for backend debugging.
     */
    console.error(`[FATAL_SYSTEM_ERROR] ${new Date().toISOString()}: ${err.message}`);

    /**
     * PRODUCTION PRIVACY:
     * The 'stack' trace (line numbers/code logic) is hidden in production 
     * to prevent exposing system vulnerabilities to the public.
     */
    const errorResponse = {
        message: err.message || "An unexpected system error occurred. Please try again later.",
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
        errorCode: statusCode,
        path: req.originalUrl
    };

    // Utilizing our standardized ResponseHelper to deliver the error
    return ResponseHelper.error(res, errorResponse.message, statusCode);
};

export default errorMiddleware;
