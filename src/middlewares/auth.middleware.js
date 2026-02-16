/**
 * Admin Authentication Middleware v1.5.2
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance Standard
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Acts as the Primary Security Gatekeeper for the Administrative Layer.
 * Validates session integrity before permitting high-stakes operations 
 * such as the Post-IPO Whale Settlement and Liquidity Audits.
 * -------------------------------------------------------------------------
 */

/**
 * @function adminAuth
 * @description Intercepts administrative requests to validate the 'x-admin-token'.
 * Synchronizes with environment-level secrets for Zero-Trust enforcement.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void | Object} Proceeds to the next layer or returns a 403 Forbidden.
 */
const adminAuth = (req, res, next) => {
    /**
     * SECURITY LAYER: HEADER EXTRACTION
     * Supports both lowercase and capitalized header naming conventions.
     * Ensures seamless compatibility between Axios (Frontend) and Integration Tests.
     */
    const adminToken = req.headers['x-admin-token'] || req.headers['X-Admin-Token'];

    /**
     * INTEGRITY VERIFICATION:
     * Validates the provided token against the 'ADMIN_SECRET_TOKEN' 
     * defined in the secure environment environment configuration.
     */
    const IS_AUTHORIZED = adminToken && adminToken === process.env.ADMIN_SECRET_TOKEN;

    if (IS_AUTHORIZED) {
        /**
         * AUDIT TRAIL LOGGING: 
         * Records successful administrative elevation for Daniel's compliance logs.
         */
        console.log(`[SECURITY_LOG] Administrative privilege elevated at ${new Date().toISOString()}`);
        return next(); 
    }

    /**
     * THREAT MITIGATION:
     * Logs unauthorized access attempts with origin IP tracking for security auditing.
     * Returns a standardized JSON error structure to maintain system stability.
     */
    console.warn(`[SECURITY_ALERT] Unauthorized Administrative attempt blocked. Origin IP: ${req.ip}`);

    return res.status(403).json({ 
        success: false, 
        status: "FORBIDDEN",
        message: "Access Denied: High-level administrative credentials required.",
        audit_reference: `MAPCAP-SEC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    });
};

export default adminAuth;
