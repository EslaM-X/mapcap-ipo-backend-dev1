/**
 * AuthController - Secure Administrative Access v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * -------------------------------------------------------------------------
 * TS STABILIZATION LOG:
 * - Resolved TS2835: Integrated mandatory .js extension for ESM/NodeNext resolution.
 * - Resolved TS2322: Adjusted return types to Promise<any> for Express compatibility.
 * - Integrity Guard: Preserved JWT payload structure and JSON response keys 
 * to ensure seamless synchronization with AdminLogin.jsx.
 */

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

/**
 * INTERNAL MODULE IMPORTS
 * Mandatory .js extension for NodeNext module resolution.
 */
import ResponseHelper from '../../utils/response.helper.js';

/**
 * @interface AdminJwtPayload
 * Defines the structure of the encoded administrative session token.
 */
interface AdminJwtPayload {
    user: string;
    role: 'SUPER_ADMIN';
    scope: 'IPO_FINALIZE_ACCESS';
}

class AuthController {
    /**
     * @method adminLogin
     * @description Validates credentials and issues a secure JWT session token.
     * @access Public (Secure Endpoint)
     * @returns Promise<any>
     */
    static async adminLogin(req: Request, res: Response): Promise<any> {
        const { username, password } = req.body;

        /**
         * SECURE CREDENTIAL FETCHING:
         * Credentials are synchronized with high-entropy environment variables.
         */
        const ADMIN_USER = process.env.ADMIN_USERNAME as string;
        const ADMIN_PASS = process.env.ADMIN_PASSWORD as string;

        // AUTHENTICATION LOGIC: Direct comparison against infrastructure secrets
        if (username === ADMIN_USER && password === ADMIN_PASS && ADMIN_USER) {
            /**
             * JWT GENERATION:
             * Encodes privilege scopes and signs with ADMIN_SECRET_TOKEN.
             */
            const payload: AdminJwtPayload = { 
                user: username, 
                role: 'SUPER_ADMIN',
                scope: 'IPO_FINALIZE_ACCESS'
            };

            const secret: string = (process.env.ADMIN_SECRET_TOKEN as string) || 'secure_fallback_2026';

            // Sign token with a 24-hour expiration cycle
            const token: string = jwt.sign(payload, secret, { expiresIn: '24h' });

            // Audit Trail for compliance monitoring and security logs
            console.log(`[AUTH_SUCCESS] Administrative session granted for: ${username}`);
            
            /**
             * SUCCESS RESPONSE:
             * Data structure strictly preserved for 'AdminLogin.jsx' frontend integration.
             * Keys maintained: token, expiresIn, sessionStart.
             */
            return ResponseHelper.success(res, "Authentication successful. Access granted.", {
                token: token,
                expiresIn: "24h",
                sessionStart: new Date().toISOString()
            });
        }

        /**
         * SECURITY BREACH PREVENTION: 
         * Standardized logging for unauthorized access attempts to monitor brute-force risks.
         */
        console.warn(`[SECURITY_ALERT] Unauthorized login attempt for user: ${username}`);
        
        return ResponseHelper.error(res, "Authentication failed: Invalid credentials.", 401);
    }

    /**
     * @method getSystemStatus
     * @description Real-time health check of the API server and MapCap engine status.
     * @access Private / Admin Only
     */
    static async getSystemStatus(req: Request, res: Response): Promise<any> {
        try {
            /**
             * INFRASTRUCTURE METRICS:
             * Aggregates engine version, uptime, and node environment details for DevOps monitoring.
             */
            return ResponseHelper.success(res, "System health synchronized.", {
                status: "Operational",
                engine: "MapCap_Pulse_v1.7.5",
                uptime: `${Math.floor(process.uptime())}s`,
                environment: process.env.NODE_ENV || "production",
                serverTime: new Date().toISOString(),
                nodeVersion: process.version
            });
        } catch (error: any) {
            /**
             * EXCEPTION HANDLING:
             * Ensures the Management UI receives a graceful error response during outages.
             */
            console.error("[STATUS_SYNC_ERROR]:", error.message);
            return ResponseHelper.error(res, "System health check failed: Infrastructure disruption.", 500);
        }
    }
}

export default AuthController;
