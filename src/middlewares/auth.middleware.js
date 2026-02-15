/**
 * Admin Authentication Middleware v1.2.5
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security Protocol
 * ---------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Acting as the security gatekeeper for administrative endpoints.
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
     * Extracts the 'x-admin-token' from the request headers.
     * This ensures the Dashboard's administrative requests are verified.
     */
    const adminToken = req.headers['x-admin-token'];

    // Secure comparison against the environment-stored secret token
    const IS_AUTHORIZED = adminToken && adminToken === process.env.ADMIN_SECRET_TOKEN;

    if (IS_AUTHORIZED) {
        /**
         * AUDIT TRAIL: 
         * Daniel's requirement: Logs every successful administrative entry.
         */
        console.log(`[SECURITY_LOG] Admin access granted at ${new Date().toISOString()}`);
        return next(); // Proceed to the protected controller
    }

    /**
     * BREACH PREVENTION:
     * Unauthorized attempts are logged with source metadata for inspection.
     * We return a standardized JSON error to ensure Frontend stability.
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
