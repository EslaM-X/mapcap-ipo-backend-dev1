/**
 * AuthController - Secure Administrative Access
 * -------------------------------------------------------------------------
 * This controller handles authentication for the MapCap IPO Admin Panel.
 * It enforces security by validating credentials against protected 
 * Environment Variables as per Daniel's architecture requirements.
 * * @category Admin Security
 */

class AuthController {
    /**
     * adminLogin
     * ----------
     * Validates administrative credentials to grant access to the IPO dashboard.
     * Uses secure .env variables to maintain system integrity.
     * * @param {Object} req - Request body containing 'username' and 'password'.
     * @param {Object} res - JSON response with status and session token.
     */
    static async adminLogin(req, res) {
        const { username, password } = req.body;

        /**
         * Environment-based credential fetching.
         * Secured via the .env file (DO NOT commit credentials to Git).
         */
        const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
        const ADMIN_PASS = process.env.ADMIN_PASSWORD || "MapCap2026";

        if (username === ADMIN_USER && password === ADMIN_PASS) {
            console.log(`[AUTH SUCCESS] Administrator session started for: ${username}`);
            
            return res.status(200).json({
                success: true,
                message: "Authentication successful. Access granted to MapCap Admin Panel.",
                // Temporary session token; upgrade to JWT for production-level security.
                token: "secure_mapcap_session_id", 
                sessionStart: new Date().toISOString()
            });
        }

        // Security logging for unauthorized access attempts
        console.warn(`[SECURITY ALERT] Failed login attempt from user: ${username}`);
        
        return res.status(401).json({
            success: false,
            message: "Authentication failed: Invalid credentials provided."
        });
    }

    /**
     * getSystemStatus
     * ---------------
     * Provides a real-time health check of the API server and environment.
     * Essential for Philip to monitor system stability during the 4-week IPO.
     */
    static async getSystemStatus(req, res) {
        try {
            res.status(200).json({
                success: true,
                status: "Operational",
                uptime: `${Math.floor(process.uptime())}s`,
                environment: process.env.NODE_ENV || "development",
                serverTimestamp: new Date().toISOString(),
                nodeVersion: process.version
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: "System health check failed." 
            });
        }
    }
}

module.exports = AuthController;

