/**
 * Admin Authentication Middleware v1.2
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security Protocol
 * * ROLE:
 * Acting as the security gatekeeper for administrative endpoints.
 * Ensures only authorized personnel (Philip/Daniel) can trigger 
 * sensitive financial actions like the 10% Whale Cap Settlement.
 * ---------------------------------------------------------
 */

/**
 * @function adminAuth
 * @desc Validates the administrative token against the environment secret.
 */
const adminAuth = (req, res, next) => {
    /**
     * SECURITY LAYER:
     * Extracts the 'x-admin-token' from the request headers.
     * In a production environment, this could be expanded to JWT verification.
     */
    const adminToken = req.headers['x-admin-token'];

    // Secure comparison against the environment-stored secret
    const IS_AUTHORIZED = adminToken && adminToken === process.env.ADMIN_SECRET_TOKEN;

    if (IS_AUTHORIZED) {
        /**
         * AUDIT TRAIL: 
         * Daniel's requirement: Log all successful admin entries.
         */
        console.log(`[SECURITY_LOG] Authorized Admin access granted at ${new Date().toISOString()}`);
        return next(); // Proceed to the protected controller
    }

    /**
     * BREACH PREVENTION:
     * Unauthorized attempts are logged with source metadata for inspection.
     */
    console.warn(`[SECURITY_ALERT] Blocked unauthorized Admin attempt from IP: ${req.ip}`);

    return res.status(403).json({ 
        success: false, 
        status: "FORBIDDEN",
        message: "Access Denied: Administrative privileges required for this operation.",
        audit_reference: `SEC-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    });
};

export default adminAuth;
