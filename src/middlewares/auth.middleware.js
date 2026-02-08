/**
 * Admin Authentication Middleware
 * ---------------------------------------------------------
 * Security guard to ensure only Philip or Daniel can trigger
 * administrative actions like Whale Refunds.
 */

const adminAuth = (req, res, next) => {
    // In a simple setup, we check for a specific header or token
    const adminToken = req.headers['x-admin-token'];

    // This token should match the one we set in .env for Philip/Daniel
    if (adminToken && adminToken === process.env.ADMIN_SECRET_TOKEN) {
        console.log("[SECURITY] Authorized Admin Access Granted");
        next(); // Proceed to the Controller
    } else {
        console.warn("[SECURITY ALERT] Unauthorized Admin Access Attempt blocked.");
        res.status(403).json({ 
            success: false, 
            message: "Access Denied: You do not have permission to perform this action." 
        });
    }
};

module.exports = adminAuth;

