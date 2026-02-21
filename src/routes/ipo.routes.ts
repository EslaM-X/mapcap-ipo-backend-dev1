/**
 * IPO Routes - Dashboard & Pulse Data v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented Express Router with explicit Request/Response typing.
 * - Centralized IPO logic mapping for 'Water-Level' analytics.
 * - Maintained standardized JSON health check for audit readiness.
 */

import express, { Router, Request, Response } from 'express';
import IpoController from '../controllers/ipo.controller.js';
import PaymentController from '../controllers/payment.controller.js';

const router: Router = express.Router();

/**
 * @route   GET /api/v1/ipo/dashboard-stats
 * @desc    Fetch Values 1, 2, 3, and 4 (Global Stats, User Stake, & Alpha Gain).
 * This is the primary heartbeat for the 'Water-Level' UI logic.
 */
router.get('/dashboard-stats', IpoController.getScreenStats);

/**
 * @route   POST /api/v1/ipo/invest
 * @desc    Processes incoming Pioneer investment following a successful 
 * Pi SDK payment callback.
 */
router.post('/invest', PaymentController.processInvestment);

/**
 * @route   GET /api/v1/ipo/status
 * @desc    System Health Check for the IPO Financial Engine.
 */
router.get('/status', (req: Request, res: Response) => {
    /**
     * INLINE STATUS REPORT:
     * Provides immediate feedback on engine version and environment stability.
     */
    res.status(200).json({ 
        success: true,
        status: "Operational", 
        engine: "MapCap_Pulse_v1.7.5_TS",
        compliance: "Daniel_Audit_Ready",
        environment: process.env.NODE_ENV || "production",
        timestamp: new Date().toISOString() 
    });
});

export default router;
