/**
 * Admin Authentication Middleware v1.5.3
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance Standard
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Acts as the Primary Security Gatekeeper for the Administrative Layer.
 * Validates session integrity before permitting high-stakes operations.
 */

const adminAuth = (req, res, next) => {
    /**
     * SECURITY LAYER: MULTI-SOURCE EXTRACTION
     * Checks Headers (Axios) and Cookies (Browser) for the 'x-admin-token'.
     * This ensures the Admin Dashboard remains accessible across different environments.
     */
    const adminToken = 
        req.headers['x-admin-token'] || 
        req.headers['X-Admin-Token'] || 
        (req.cookies && req.cookies.adminToken);

    /**
     * INTEGRITY VERIFICATION:
     * Cross-references the token with the system's ADMIN_SECRET_TOKEN.
     */
    const IS_AUTHORIZED = adminToken && adminToken === process.env.ADMIN_SECRET_TOKEN;

    if (IS_AUTHORIZED) {
        // Log elevation for compliance and audit trails
        console.log(`[SECURITY_LOG] Admin Access Granted: ${new Date().toISOString()}`);
        return next(); 
    }

    /**
     * THREAT MITIGATION:
     * Standardized 403 Forbidden response to prevent unauthorized dashboard access.
     */
    console.warn(`[SECURITY_ALERT] Unauthorized Admin attempt blocked. IP: ${req.ip}`);

    return res.status(403).json({ 
        success: false, 
        status: "FORBIDDEN",
        message: "Access Denied: Administrative privileges required.",
        audit_reference: `MAPCAP-SEC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    });
};

export default adminAuth;
