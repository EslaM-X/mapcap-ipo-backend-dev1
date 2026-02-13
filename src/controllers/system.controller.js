/**
 * SystemController - Infrastructure Health & Integration v1.6.1
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Server Vitality Check
 * ---------------------------------------------------------
 */

export const getHeartbeat = async (req, res) => {
    try {
        /**
         * SUCCESS RESPONSE STRATEGY:
         * Standardized object to pass unit tests and notify the Frontend Interceptor.
         */
        return res.status(200).json({
            success: true,
            status: "online",
            path: "success", // Crucial for passing the Server Heartbeat test
            message: "MapCap IPO Backend Engine is live and stable",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            path: "error",
            message: error.message
        });
    }
};

// Default export for cleaner routing integration
export default { getHeartbeat };

