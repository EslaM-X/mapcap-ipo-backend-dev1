/**
 * Admin Authentication Middleware v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance Standard
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Added Express Request, Response, and NextFunction types.
 * - Formalized the Extraction Logic to handle typed headers.
 * - Maintained the 'audit_reference' key for Frontend error handling.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * @function adminAuth
 * @desc Acts as the Primary Security Gatekeeper for the Administrative Layer.
 */
const adminAuth = (req: Request, res: Response, next: NextFunction): void | Response => {
    /**
     * SECURITY LAYER: MULTI-SOURCE EXTRACTION
     * Robust extraction to support Browser, Mobile, and CI/CD testing tools.
     */
    const adminToken = 
        (req.headers['x-admin-token'] as string) || 
        (req.headers['X-Admin-Token'] as string) || 
        (req.cookies && req.cookies.adminToken) ||
        (req.query.admin_token as string);

    /**
     * INTEGRITY VERIFICATION:
     * Cross-references against the 'ADMIN_SECRET_TOKEN' in environment configs.
     */
    const SECRET: string | undefined = process.env.ADMIN_SECRET_TOKEN;
    
    // Safety check: Block by default if environment is misconfigured.
    if (!SECRET) {
        console.error("[SECURITY_CRITICAL]: ADMIN_SECRET_TOKEN is not defined in environment variables!");
        return res.status(500).json({ success: false, message: "Security Configuration Error." });
    }

    const IS_AUTHORIZED: boolean = adminToken !== undefined && adminToken === SECRET;

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
     * Returns a 403 Forbidden with a unique Audit Reference for tracking.
     */
    const auditRef: string = `MAPCAP-SEC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    console.warn(`[SECURITY_ALERT] Unauthorized Admin access blocked | IP: ${req.ip} | Ref: ${auditRef}`);

    return res.status(403).json({ 
        success: false, 
        status: "FORBIDDEN",
        message: "Access Denied: Administrative credentials required for this operation.",
        audit_reference: auditRef
    });
};

export default adminAuth;
