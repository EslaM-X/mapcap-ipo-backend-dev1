/**
 * AuthController - Secure Administrative Access v1.5.2
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Handles administrative authentication and real-time health monitoring.
 * Acts as the secure gateway for Philip and Daniel to access high-stakes 
 * IPO management features, including the final Post-IPO Whale Settlement.
 * -------------------------------------------------------------------------
 * UPDATED: Optimized pathing and standardized documentation for v1.5.2.
 */

import jwt from 'jsonwebtoken';
import ResponseHelper from '../../utils/response.helper.js';

class AuthController {
    /**
     * @method adminLogin
     * @description Validates administrative credentials and issues a secure JWT 
     * session token. Enforces strict isolation for the IPO management layer.
     * @param {Object} req - Request containing 'username' and 'password' in body.
     * @param {Object} res - Response helper delivery.
     * @returns {Promise<Object>} Secure session token or authentication error.
     */
    static async adminLogin(req, res) {
        const { username, password } = req.body;

        /**
         * SECURE CREDENTIAL FETCHING:
         * Credentials are synchronized with environment variables to 
         * satisfy Daniel's security audit and Zero-Trust standards.
         */
        const ADMIN_USER = process.env.ADMIN_USERNAME;
        const ADMIN_PASS = process.env.ADMIN_PASSWORD;

        // AUTHENTICATION LOGIC: Direct comparison against high-entropy secrets
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            /**
             * JWT GENERATION:
             * Encodes privilege scopes including 'IPO_FINALIZE_ACCESS'.
             * Signed with 'ADMIN_SECRET_TOKEN' for 24-hour session persistence.
             */
            const token = jwt.sign(
                { 
                    user: username, 
                    role: 'SUPER_ADMIN', // Role matches AdminSchema ENUM
                    scope: 'IPO_FINALIZE_ACCESS'
                },
                process.env.ADMIN_SECRET_TOKEN || 'secure_fallback_2026',
                { expiresIn: '24h' }
            );

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
     * Essential for Philip to monitor the 'IPO Pulse' during high-traffic weeks.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    static async getSystemStatus(req, res) {
        try {
            /**
             * INFRASTRUCTURE METRICS:
             * Aggregates engine version, uptime, and node environment details.
             */
            return ResponseHelper.success(res, "System health synchronized.", {
                status: "Operational",
                engine: "MapCap_Pulse_v1.5.2",
                uptime: `${Math.floor(process.uptime())}s`,
                environment: process.env.NODE_ENV || "production",
                serverTime: new Date().toISOString(),
                nodeVersion: process.version
            });
        } catch (error) {
            /**
             * EXCEPTION HANDLING:
             * Ensures the UI receives a graceful error response on infrastructure failure.
             */
            console.error("[STATUS_SYNC_ERROR]:", error.message);
            return ResponseHelper.error(res, "System health check failed: Infrastructure disruption.", 500);
        }
    }
}

export default AuthController;
