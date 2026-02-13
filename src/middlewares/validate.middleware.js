/**
 * Validation Middleware - Financial Logic Guard v1.2
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Financial Compliance
 * * PURPOSE:
 * Intercepts incoming requests to validate financial parameters 
 * before they reach the service layer. Prevents logical errors 
 * and ensures data integrity within the IPO Pulse Engine.
 * ---------------------------------------------------------
 */

import ResponseHelper from '../utils/response.helper.js';

/**
 * @function validateWithdrawal
 * @desc Ensures withdrawal percentage is within the legal 0.01% - 100% range.
 * This is a core requirement for Philip's flexible withdrawal specs [Page 5].
 */
export const validateWithdrawal = (req, res, next) => {
    const { percentage, userWallet } = req.body;

    // 1. Mandatory Fields Check
    if (!percentage || !userWallet) {
        return ResponseHelper.error(res, "Missing mandatory parameters: 'percentage' and 'userWallet' are required.", 400);
    }

    // 2. Numerical Range Validation
    const percentNum = parseFloat(percentage);
    
    if (isNaN(percentNum) || percentNum <= 0 || percentNum > 100) {
        /**
         * SECURITY LOG: 
         * Daniel's Audit requirement: Log out-of-range attempts for monitoring.
         */
        console.warn(`[VALIDATION_REJECTED] Invalid withdrawal percentage: ${percentage} from ${userWallet}`);
        
        return ResponseHelper.error(res, "Invalid range: Withdrawal percentage must be between 0.01% and 100%.", 400);
    }

    // Pass the cleaned number back to the request for service use
    req.body.percentage = percentNum;
    
    next();
};

/**
 * FUTURE SCALABILITY:
 * Add additional validators here (e.g., validateInvestment, validateAdminLogin).
 */
