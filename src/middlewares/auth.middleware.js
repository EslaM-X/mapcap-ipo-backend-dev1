/**
 * Admin Authentication Middleware v1.5.4
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance Standard
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Acts as the Primary Security Gatekeeper for the Administrative Layer.
 * Validates session integrity before permitting high-stakes operations 
 * like Whale Capping audits or Asset Settlement.
 */

const adminAuth = (req, res, next) => {
    /**
     * SECURITY LAYER: MULTI-SOURCE EXTRACTION
     * Fetches 'x-admin-token' from Headers (Postman/Axios), Cookies (Browser), 
     * or even Query Params (for quick debugging/demo if enabled).
     */
    const adminToken = 
        req.headers['x-admin-token'] || 
        req.headers['X-Admin-Token'] || 
        (req.cookies && req.cookies.adminToken) ||
        req.query.admin_token; // Added for flexibility during Demo/MVP phase

    /**
     * INTEGRITY VERIFICATION:
     * Cross-references against the 'ADMIN_SECRET_TOKEN' in environment configs.
     * Note: In MVP/Testing environment, if the secret is missing, we log a warning.
     */
    const SECRET = process.env.ADMIN_SECRET_TOKEN;
    
    // Safety check: If no secret is defined in .env, we block by default to protect the system.
    if (!SECRET) {
        console.error("[SECURITY_CRITICAL]: ADMIN_SECRET_TOKEN is not defined in environment variables!");
        return res.status(500).json({ success: false, message: "Security Configuration Error." });
    }

    const IS_AUTHORIZED = adminToken && adminToken === SECRET;

    if (IS_AUTHORIZED) {
        /**
         * AUDIT TRAIL:
         * Essential for Daniel's compliance tracking.
         */
        console.log(`[SECURITY_LOG] Admin Privilege Elevated | Time: ${new Date().toISOString()} | IP: ${req.ip}`);
        return next(); 
    }

    /**
     * THREAT MITIGATION:
     * Returns a 403 Forbidden with a unique Audit Reference to assist 
     * in tracking unauthorized access attempts without leaking system info.
     */
    const auditRef = `MAPCAP-SEC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    console.warn(`[SECURITY_ALERT] Unauthorized Admin access blocked | IP: ${req.ip} | Ref: ${auditRef}`);

    return res.status(403).json({ 
        success: false, 
        status: "FORBIDDEN",
        message: "Access Denied: Administrative credentials required for this operation.",
        audit_reference: auditRef
    });
};

export default adminAuth;
