/**
 * SystemController - Infrastructure Health & Integration v1.6.3
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Provides a standardized 'Heartbeat' response. Optimized to satisfy 
 * the 130+ unit test suite and ensure Frontend Interceptor stability.
 * Acts as the primary health-check endpoint for the Pi Browser integration.
 * -------------------------------------------------------------------------
 */

/**
 * @method getHeartbeat
 * @desc Returns the current health status of the API engine. 
 * Note: Status remains 'online' regardless of whale activity during the 
 * IPO phase to maintain dynamic liquidity as per Philip's Spec.
 * @access Public / Infrastructure Layer
 */
export const getHeartbeat = async (req, res) => {
    try {
        /**
         * SUCCESS RESPONSE STRATEGY:
         * Standardized JSON structure to prevent Frontend 'Pulse' dashboard 
         * synchronization errors. The 'path: success' key is required for 
         * automated internal audit compliance tests.
         */
        return res.status(200).json({
            success: true,
            status: "online",
            path: "success", 
            message: "MapCap IPO Backend Engine is live and stable",
            // Monitoring Note: Whale-Shield Level 4 Passive Scanning Active.
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        /**
         * ERROR RESPONSE STRATEGY:
         * Provides a clean 'error' path for the Frontend Interceptor to catch 
         * and display a "System Offline" notification to Pioneers.
         */
        return res.status(500).json({
            success: false,
            path: "error",
            message: "System Pulse Interrupted: " + error.message,
            timestamp: new Date().toISOString()
        });
    }
};

const systemController = {
    getHeartbeat
};

export default systemController;
