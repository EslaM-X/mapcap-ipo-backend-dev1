/**
 * AuthController - Secure Administrative Access v1.4
 * -------------------------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * * PURPOSE:
 * Handles administrative authentication and real-time health monitoring.
 * Implements JWT-based security to protect the high-stakes IPO dashboard.
 * -------------------------------------------------------------------------
 */

import jwt from 'jsonwebtoken';
import ResponseHelper from '../../utils/response.helper.js';

class AuthController {
    /**
     * @method adminLogin
     * @desc Validates credentials and issues a secure JWT session token.
     * @access Public
     */
    static async adminLogin(req, res) {
        const { username, password } = req.body;

        /**
         * SECURE CREDENTIAL FETCHING:
         * These values must be stored in the .env file for the Vercel deployment.
         */
        const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
        const ADMIN_PASS = process.env.ADMIN_PASSWORD || "MapCap2026";

        if (username === ADMIN_USER && password === ADMIN_PASS) {
            /**
             * JWT GENERATION:
             * Creating a signed token that expires in 24h to maintain session security.
             * The 'ADMIN_SECRET_TOKEN' should be a long, random string in .env.
             */
            const token = jwt.sign(
                { user: username, role: 'SUPER_ADMIN' },
                process.env.ADMIN_SECRET_TOKEN || 'fallback_secret_for_dev',
                { expiresIn: '24h' }
            );

            console.log(`[AUTH_SUCCESS] Admin session initiated for: ${username}`);
            
            return ResponseHelper.success(res, "Authentication successful. Access granted.", {
                token: token,
                expiresIn: "24h",
                sessionStart: new Date().toISOString()
            });
        }

        // SECURITY LOGGING: Capturing failed attempts for Daniel's audit.
        console.warn(`[SECURITY_ALERT] Unauthorized login attempt from: ${username}`);
        
        return ResponseHelper.error(res, "Authentication failed: Invalid credentials.", 401);
    }

    /**
     * @method getSystemStatus
     * @desc Real-time health check of the API server and Node.js environment.
     * @access Private (Admin Only)
     */
    static async getSystemStatus(req, res) {
        try {
            /**
             * HEALTH METRICS:
             * Vital for Philip to monitor the 'IPO Pulse' during high-traffic weeks.
             */
            return ResponseHelper.success(res, "System health synchronized.", {
                status: "Operational",
                engine: "MapCap_Pulse_v1.4",
                uptime: `${Math.floor(process.uptime())}s`,
                environment: process.env.NODE_ENV || "production",
                serverTime: new Date().toISOString(),
                nodeVersion: process.version
            });
        } catch (error) {
            return ResponseHelper.error(res, "System health check failed.", 500);
        }
    }
}

export default AuthController;
