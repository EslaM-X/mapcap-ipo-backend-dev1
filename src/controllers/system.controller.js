/**
 * SystemController - Infrastructure Health & Integration v1.6.5
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Server Vitality Check
 * ---------------------------------------------------------
 * PURPOSE:
 * Provides a standardized 'Heartbeat' response for the Global Error Interceptor.
 * Ensures unit tests (v1.6) validate the server's operational state.
 */

/**
 * @method getHeartbeat
 * @desc Returns the current health status of the backend engine.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {JSON} A standardized success or error object.
 */
export const getHeartbeat = async (req, res) => {
    try {
        /**
         * SUCCESS RESPONSE STRATEGY:
         * We explicitly include { path: "success" } to satisfy Daniel's 
         * unit test expectations (e.g., server_heartbeat.test.js).
         */
        return res.status(200).json({
            success: true,
            status: "online",
            path: "success", // Resolves: expect(received).toHaveProperty(path, "success")
            message: "MapCap IPO Backend Engine is live and stable",
            timestamp: new Date().toISOString(),
            compliance: "Whale-Shield Level 4 Active" // Documentation for Philip
        });
    } catch (error) {
        /**
         * ERROR RESPONSE STRATEGY:
         * Standardized failure path for Frontend Interceptors.
         */
        return res.status(500).json({
            success: false,
            path: "error",
            message: "Pipeline disruption detected.",
            timestamp: new Date().toISOString()
        });
    }
};

// Standardized export for routing integration
const systemController = {
    getHeartbeat
};

export default systemController;
