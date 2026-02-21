/**
 * Global Error Handling Middleware v1.7.5 (TS)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: High-Availability Standards
 * ---------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented strict Error, Request, Response, and NextFunction types.
 * - Formalized the errorPayload interface for internal logging.
 * - Maintained standardized error dispatching via ResponseHelper.
 */

import { Request, Response, NextFunction } from 'express';
import ResponseHelper from '../utils/response.helper.js';

/**
 * @interface IErrorPayload
 * Contract for internal error reporting and debugging.
 */
interface IErrorPayload {
    message: string;
    stack?: string;
    errorCode: number;
    requestPath: string;
}

/**
 * @function errorMiddleware
 * @desc Centralized error interceptor for the Express framework.
 */
const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction): void | Response => {
    /**
     * STATUS CODE RESOLUTION:
     * Defaults to 500 (Internal Server Error) if the preceding 
     * controller failed to specify a status.
     */
    const statusCode: number = res.statusCode === 200 ? 500 : res.statusCode;
    
    /**
     * DANIEL'S AUDIT PROTOCOL:
     * Logs the exact error trace for real-time backend debugging.
     */
    console.error(`[FATAL_SYSTEM_ERROR] ${new Date().toISOString()}: ${err.message}`);

    /**
     * PRODUCTION PRIVACY & SECURITY:
     * Stack traces are omitted in production to prevent system exposure.
     */
    const errorPayload: IErrorPayload = {
        message: err.message || "An unexpected system anomaly occurred. Pipeline offline.",
        errorCode: statusCode,
        requestPath: req.originalUrl,
        // Detailed stack trace only for EslaM-X in development
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    };

    /**
     * STANDARDIZED RESPONSE:
     * Uses ResponseHelper to maintain JSON parity with the Pulse Dashboard.
     */
    return ResponseHelper.error(res, errorPayload.message, statusCode);
};

export default errorMiddleware;
