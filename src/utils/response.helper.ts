/**
 * ResponseHelper - API Standardization Utility v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Defined ISuccessResponse and IErrorResponse interfaces for strict output.
 * - Implemented type-safe Express Response handling.
 * - Maintained forensic Trace ID logic for Daniel's compliance tracking.
 */

import { Response } from 'express';
import { writeAuditLog } from '../config/logger.js';

/**
 * @interface ISuccessResponse
 * Represents the unified structure for all successful API calls.
 */
interface ISuccessResponse {
  success: boolean;
  status: string;
  message: string;
  timestamp: string;
  data: any;
}

/**
 * @interface IErrorResponse
 * Represents the forensic structure for failed API calls.
 */
interface IErrorResponse {
  success: boolean;
  status: string;
  message: string;
  timestamp: string;
  error: {
    code: number;
    trace_id: string;
    documentation: string;
  };
}

class ResponseHelper {
  /**
   * @method success
   * @desc Dispatches a standardized success payload for IPO and A2UaaS operations.
   */
  static success(res: Response, message: string, data: any = {}): Response {
    const payload: ISuccessResponse = {
      success: true,
      status: "OK", // Critical for Frontend state management
      message,
      timestamp: new Date().toISOString(),
      data
    };
    return res.status(200).json(payload);
  }

  /**
   * @method error
   * @desc Dispatches a structured error response with forensic Trace ID.
   */
  static error(res: Response, message: string, statusCode: number = 500): Response {
    /**
     * TRACE ID GENERATION:
     * Format: ERR-[TIMESTAMP_BASE36]-[RANDOM_SALT]
     */
    const traceId: string = `ERR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    // Log the anomaly into the permanent audit trail for forensic review
    try {
      writeAuditLog('ERROR', `[${traceId}] Code: ${statusCode} | Message: ${message}`);
    } catch (logError: any) {
      console.error(`[CRITICAL_LOGGER_FAILURE]: ${logError.message}`);
    }

    const payload: IErrorResponse = {
      success: false,
      status: "FAIL", // Critical for Frontend global interceptors
      message,
      timestamp: new Date().toISOString(),
      error: {
        code: statusCode,
        trace_id: traceId,
        documentation: "https://docs.map-of-pi.com/errors" 
      }
    };

    return res.status(statusCode).json(payload);
  }
}

export default ResponseHelper;
