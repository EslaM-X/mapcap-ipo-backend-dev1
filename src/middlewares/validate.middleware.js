/**
 * Validation Middleware - Financial Logic Guard v1.2.5
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's Financial Compliance
 * ---------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Intercepts incoming requests to validate financial parameters 
 * before they reach the service layer. This ensures the integrity 
 * of the 'Water-Level' and prevents logic-based exploits.
 * ---------------------------------------------------------
 */

import ResponseHelper from '../utils/response.helper.js';

/**
 * @function validateWithdrawal
 * @desc Ensures withdrawal parameters adhere to the legal 0.01% - 100% range.
 * This supports Philip's flexible withdrawal specification [Page 5].
 * @access Global Pipeline
 */
export const validateWithdrawal = (req, res, next) => {
    const { percentage, userWallet } = req.body;

    // 1. DATA INTEGRITY CHECK: Verify all required fields are present
    if (percentage === undefined || !userWallet) {
        return ResponseHelper.error(res, "Compliance Error: 'percentage' and 'userWallet' are mandatory.", 400);
    }

    // 2. RANGE VALIDATION: Enforce numerical boundaries for Pi liquidity safety
    const percentNum = parseFloat(percentage);
    
    if (isNaN(percentNum) || percentNum <= 0 || percentNum > 100) {
        /**
         * DANIEL'S AUDIT TRAIL: 
         * Logs out-of-range attempts to identify potential bot activity or UI bugs.
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
 * Centralized for future validation modules (e.g., validateInvestment, validateAdminActions).
 */
export default { validateWithdrawal };
