/**
 * SystemController - Infrastructure Health & Integration v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip & Daniel Compliance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Added explicit Request/Response typing from Express.
 * - Formalized the HeartbeatResponse interface for strict API contracts.
 * - Maintained legacy 'path' keys for internal audit tool compatibility.
 */

import { Request, Response } from 'express';

/**
 * @interface HeartbeatResponse
 * Standardized structure for health monitoring and CI/CD pipelines.
 */
interface HeartbeatResponse {
    success: boolean;
    status?: string;
    path: "success" | "error";
    message: string;
    timestamp: string;
}

/**
 * @method getHeartbeat
 * @desc Returns the current health status of the API engine.
 */
export const getHeartbeat = async (req: Request, res: Response): Promise<Response> => {
    try {
        /**
         * SUCCESS RESPONSE STRATEGY:
         * Standardized JSON structure to prevent Frontend 'Pulse' dashboard 
         * synchronization errors.
         */
        const payload: HeartbeatResponse = {
            success: true,
            status: "online",
            path: "success", 
            message: "MapCap IPO Backend Engine is live and stable",
            timestamp: new Date().toISOString()
        };
        
        return res.status(200).json(payload);
    } catch (error: any) {
        /**
         * ERROR RESPONSE STRATEGY:
         * Provides a clean 'error' path for the Frontend Interceptor.
         */
        const errorPayload: HeartbeatResponse = {
            success: false,
            path: "error",
            message: "System Pulse Interrupted: " + error.message,
            timestamp: new Date().toISOString()
        };

        return res.status(500).json(errorPayload);
    }
};

const systemController = {
    getHeartbeat
};

export default systemController;
