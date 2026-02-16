/**
 * Admin Authentication Middleware v1.2.6
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security Protocol
 * ---------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Security gatekeeper for administrative endpoints.
 * Ensures only authorized personnel (Philip/Daniel) can trigger 
 * high-stakes financial actions like the 'Whale-Shield' Settlement.
 * ---------------------------------------------------------
 */

/**
 * @function adminAuth
 * @desc Validates the administrative token against the environment secret.
 * @access Private Layer (Administrative)
 */
const adminAuth = (req, res, next) => {
    /**
     * SECURITY LAYER:
     * Extracts 'x-admin-token' from request headers.
     * Added flexibility for header naming (Case-insensitive) to ensure 
     * compatibility between Frontend Axios calls and Jest test suites.
     */
    const adminToken = req.headers['x-admin-token'] || req.headers['X-Admin-Token'];

    // Secure comparison against the environment-stored secret token
    const IS_AUTHORIZED = adminToken && adminToken === process.env.ADMIN_SECRET_TOKEN;

    if (IS_AUTHORIZED) {
        /**
         * AUDIT TRAIL: 
         * Logs every successful administrative entry as per security requirements.
         */
        console.log(`[SECURITY_LOG] Admin access granted at ${new Date().toISOString()}`);
        return next(); 
    }

    /**
     * BREACH PREVENTION:
     * Unauthorized attempts are logged for inspection.
     * Returns a standardized JSON error to maintain Frontend and App stability.
     */
    console.warn(`[SECURITY_ALERT] Blocked unauthorized Admin attempt from IP: ${req.ip}`);

    return res.status(403).json({ 
        success: false, 
        status: "FORBIDDEN",
        message: "Access Denied: Administrative privileges required.",
        audit_reference: `SEC-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    });
};

export default adminAuth;
