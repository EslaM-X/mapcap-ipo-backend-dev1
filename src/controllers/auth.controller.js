/**
 * Auth Controller - Administrative Access
 * ---------------------------------------------------------
 * This controller manages access to the Admin Dashboard.
 * It ensures that only Philip or Daniel can trigger critical IPO actions.
 */

class AuthController {
    /**
     * Admin Login
     * Validates admin credentials against environment variables.
     */
    static async adminLogin(req, res) {
        const { username, password } = req.body;

        // Simple and secure validation using .env variables as requested by Daniel
        const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
        const ADMIN_PASS = process.env.ADMIN_PASSWORD || "MapCap2026";

        if (username === ADMIN_USER && password === ADMIN_PASS) {
            return res.status(200).json({
                success: true,
                message: "Welcome back, Admin.",
                token: "simple_secure_session_token" // In production, use JWT
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid credentials. Access Denied."
        });
    }

    /**
     * System Status
     * Returns a quick health check of the API and DB for the Admin.
     */
    static async getSystemStatus(req, res) {
        res.status(200).json({
            success: true,
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || "development",
            timestamp: new Date()
        });
    }
}

module.exports = AuthController;

