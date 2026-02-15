/**
 * AuthController - Secure Administrative Access v1.4.5
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * -------------------------------------------------------------------------
 * PURPOSE:
 * Handles administrative authentication and real-time health monitoring.
 * Ensures that only authorized leads can execute the final Whale Settlement.
 * -------------------------------------------------------------------------
 */

import jwt from 'jsonwebtoken';
import ResponseHelper from '../../utils/response.helper.js';

class AuthController {
    /**
     * @method adminLogin
     * @desc Validates credentials and issues a secure JWT session token.
     * Enforces strict isolation for high-stakes IPO management.
     */
    static async adminLogin(req, res) {
        const { username, password } = req.body;

        /**
         * SECURE CREDENTIAL FETCHING:
         * Fetches sensitive credentials from environment variables.
         */
        const ADMIN_USER = process.env.ADMIN_USERNAME;
        const ADMIN_PASS = process.env.ADMIN_PASSWORD;

        if (username === ADMIN_USER && password === ADMIN_PASS) {
            /**
             * JWT GENERATION:
             * Creating a signed token that expires in 24h.
             * Standardizing on ES Modules and Daniel's Audit standards.
             */
            const token = jwt.sign(
                { user: username, role: 'SUPER_ADMIN' },
                process.env.ADMIN_SECRET_TOKEN || 'secure_fallback_2026',
                { expiresIn: '24h' }
            );

            console.log(`[AUTH_SUCCESS] Admin session initiated for: ${username}`);
            
            return ResponseHelper.success(res, "Authentication successful. Access granted.", {
                token: token,
                expiresIn: "24h",
                sessionStart: new Date().toISOString()
            });
        }

        /**
         * SECURITY LOGGING: 
         * Important for Daniel's audit logging to prevent brute-force attacks.
         */
        console.warn(`[SECURITY_ALERT] Unauthorized login attempt for: ${username}`);
        
        return ResponseHelper.error(res, "Authentication failed: Invalid credentials.", 401);
    }

    /**
     * @method getSystemStatus
     * @desc Real-time health check of the API server.
     * Essential for Philip to monitor the 'IPO Pulse' during final weeks.
     */
    static async getSystemStatus(req, res) {
        try {
            /**
             * HEALTH METRICS:
             * Provides transparency on engine version and uptime.
             */
            return ResponseHelper.success(res, "System health synchronized.", {
                status: "Operational",
                engine: "MapCap_Pulse_v1.4.5",
                uptime: `${Math.floor(process.uptime())}s`,
                environment: process.env.NODE_ENV || "production",
                serverTime: new Date().toISOString(),
                nodeVersion: process.version
            });
        } catch (error) {
            return ResponseHelper.error(res, "System health check failed: Pipeline disruption.", 500);
        }
    }
}

export default AuthController;
