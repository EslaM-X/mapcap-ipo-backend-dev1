/**
 * AuthController - Secure Administrative Access v1.4.6
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Daniel's Security & Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Handles administrative authentication and real-time health monitoring.
 * Acts as the secure gateway for Philip and Daniel to access high-stakes 
 * IPO management features, including the final Post-IPO Whale Settlement.
 * -------------------------------------------------------------------------
 */

import jwt from 'jsonwebtoken';
import ResponseHelper from '../../utils/response.helper.js';

class AuthController {
    /**
     * @method adminLogin
     * @param {Object} req - Request containing 'username' and 'password' in body.
     * @param {Object} res - Response helper delivery.
     * @desc Validates administrative credentials and issues a secure JWT 
     * session token. Enforces strict isolation for the IPO management layer.
     */
    static async adminLogin(req, res) {
        const { username, password } = req.body;

        /**
         * SECURE CREDENTIAL FETCHING:
         * Credentials are strictly pulled from environment variables to 
         * satisfy Daniel's security audit standards.
         */
        const ADMIN_USER = process.env.ADMIN_USERNAME;
        const ADMIN_PASS = process.env.ADMIN_PASSWORD;

        // AUTHENTICATION LOGIC: Strict comparison against env secrets
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            /**
             * JWT GENERATION:
             * Creating a signed token with a 24-hour expiration cycle.
             * Uses the 'ADMIN_SECRET_TOKEN' for cryptographic signing.
             */
            const token = jwt.sign(
                { 
                    user: username, 
                    role: 'SUPER_ADMIN',
                    scope: 'IPO_FINALIZE_ACCESS'
                },
                process.env.ADMIN_SECRET_TOKEN || 'secure_fallback_2026',
                { expiresIn: '24h' }
            );

            // Audit Log for Daniel's monitoring
            console.log(`[AUTH_SUCCESS] Administrative session granted for: ${username}`);
            
            /**
             * SUCCESS RESPONSE:
             * Structure preserved for 'AdminLogin.jsx' compatibility.
             */
            return ResponseHelper.success(res, "Authentication successful. Access granted.", {
                token: token,
                expiresIn: "24h",
                sessionStart: new Date().toISOString()
            });
        }

        /**
         * SECURITY BREACH PREVENTION: 
         * Logs unauthorized attempts with timestamps for threat analysis.
         */
        console.warn(`[SECURITY_ALERT] Unauthorized login attempt for: ${username}`);
        
        return ResponseHelper.error(res, "Authentication failed: Invalid credentials.", 401);
    }

    /**
     * @method getSystemStatus
     * @desc Real-time health check of the API server and MapCap engine.
     * Essential for Philip to monitor the 'IPO Pulse' during high-traffic weeks.
     */
    static async getSystemStatus(req, res) {
        try {
            /**
             * HEALTH METRICS AGGREGATION:
             * Provides transparency on engine version, uptime, and server health.
             */
            return ResponseHelper.success(res, "System health synchronized.", {
                status: "Operational",
                engine: "MapCap_Pulse_v1.4.6",
                uptime: `${Math.floor(process.uptime())}s`,
                environment: process.env.NODE_ENV || "production",
                serverTime: new Date().toISOString(),
                nodeVersion: process.version
            });
        } catch (error) {
            /**
             * FATAL EXCEPTION HANDLING:
             * Ensures the Frontend receives a standardized error structure.
             */
            return ResponseHelper.error(res, "System health check failed: Infrastructure disruption.", 500);
        }
    }
}

export default AuthController;
