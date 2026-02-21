/**
 * Validation Middleware - Financial Logic Guard v1.7.5 (TS)
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Financial Compliance
 * ---------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented Express middleware typing (Request, Response, NextFunction).
 * - Added strict numeric parsing for 'percentage' to ensure financial accuracy.
 * - Maintained standardized error responses for Frontend Interceptor parity.
 */

import { Request, Response, NextFunction } from 'express';
import ResponseHelper from '../utils/response.helper.js';

/**
 * @function validateWithdrawal
 * @desc Ensures withdrawal parameters adhere to the legal 0.01% - 100% range.
 */
export const validateWithdrawal = (req: Request, res: Response, next: NextFunction): void | Response => {
    const { percentage, userWallet } = req.body;

    // 1. DATA INTEGRITY CHECK: Verify all required fields are present
    if (percentage === undefined || !userWallet) {
        return ResponseHelper.error(res, "Compliance Error: 'percentage' and 'userWallet' are mandatory.", 400);
    }

    // 2. RANGE VALIDATION: Enforce numerical boundaries for Pi liquidity safety
    const percentNum: number = parseFloat(percentage);
    
    if (isNaN(percentNum) || percentNum <= 0 || percentNum > 100) {
        /**
         * DANIEL'S AUDIT TRAIL: 
         * Logs out-of-range attempts to identify potential bot activity.
         */
        console.warn(`[VALIDATION_REJECTED] Out-of-range withdrawal: ${percentage}% from ${userWallet}`);
        
        return ResponseHelper.error(res, "Protocol Violation: Withdrawal must be within 0.01% to 100% range.", 400);
    }

    /**
     * 3. DATA CLEANING:
     * Sanitize the input by passing the parsed number back to the request object.
     */
    req.body.percentage = percentNum;
    
    next();
};

/**
 * SCALABILITY NOTE: 
 * Centralized for future validation modules.
 */
const validateMiddleware = {
    validateWithdrawal
};

export default validateMiddleware;
