/**
 * AuthController - Secure Administrative Access v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Handles administrative authentication and real-time health monitoring.
 * Acts as the secure gateway for high-stakes IPO management features.
 */

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
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
     */
    static async adminLogin(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;

        /**
         * SECURE CREDENTIAL FETCHING:
         * Credentials are synchronized with environment variables.
         */
        const ADMIN_USER: string | undefined = process.env.ADMIN_USERNAME;
        const ADMIN_PASS: string | undefined = process.env.ADMIN_PASSWORD;

        // AUTHENTICATION LOGIC: Direct comparison against high-entropy secrets
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

            const secret: string = process.env.ADMIN_SECRET_TOKEN || 'secure_fallback_2026';

            const token: string = jwt.sign(payload, secret, { expiresIn: '24h' });

            // Audit Trail for compliance monitoring
            console.log(`[AUTH_SUCCESS] Administrative session granted for: ${username}`);
            
            /**
             * SUCCESS RESPONSE:
             * Structure strictly preserved for 'AdminLogin.jsx' integration.
             */
            return ResponseHelper.success(res, "Authentication successful. Access granted.", {
                token: token,
                expiresIn: "24h",
                sessionStart: new Date().toISOString()
            });
        }

        /**
         * SECURITY BREACH PREVENTION: 
         * Standardized logging for unauthorized access attempts.
         */
        console.warn(`[SECURITY_ALERT] Unauthorized login attempt for: ${username}`);
        
        return ResponseHelper.error(res, "Authentication failed: Invalid credentials.", 401);
    }

    /**
     * @method getSystemStatus
     * @description Real-time health check of the API server and MapCap engine.
     */
    static async getSystemStatus(req: Request, res: Response): Promise<void> {
        try {
            /**
             * INFRASTRUCTURE METRICS:
             * Aggregates engine version, uptime, and node environment details.
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
             * Ensures the UI receives a graceful error response.
             */
            console.error("[STATUS_SYNC_ERROR]:", error.message);
            return ResponseHelper.error(res, "System health check failed: Infrastructure disruption.", 500);
        }
    }
}

export default AuthController;
