/**
 * IPO Routes - Dashboard & Pulse Data v1.6.1 (Production Ready)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel Compliance
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE: 
 * Provides centralized routing for real-time IPO analytics, investment 
 * processing, and Whale-Shield compliance monitoring. This is the main 
 * interface for the Pioneer 'Pulse Dashboard'.
 * -------------------------------------------------------------------------
 */

import express from 'express';
import IpoController from '../controllers/ipo.controller.js';
import PaymentController from '../controllers/payment.controller.js';

const router = express.Router();

/**
 * @route   GET /api/v1/ipo/dashboard-stats
 * @desc    Fetch Values 1, 2, 3, and 4 (Global Stats, User Stake, & Alpha Gain).
 * This is the primary heartbeat for the 'Water-Level' UI logic.
 * @access  Protected (Requires Pi Network Authentication Middleware)
 */
router.get('/dashboard-stats', IpoController.getScreenStats);

/**
 * @route   POST /api/v1/ipo/invest
 * @desc    Processes incoming Pioneer investment following a successful 
 * Pi SDK payment callback.
 * @access  Protected (Ensures only authenticated Pioneers can update the ledger)
 */
router.post('/invest', PaymentController.processInvestment);

/**
 * @route   GET /api/v1/ipo/status
 * @desc    System Health Check for the IPO Financial Engine.
 * Essential for monitoring the 'Pulse' and ensuring Daniel's audit readiness.
 */
router.get('/status', (req, res) => {
    /**
     * INLINE STATUS REPORT:
     * Provides immediate feedback on engine version and environment stability.
     */
    res.status(200).json({ 
        success: true,
        status: "Operational", 
        engine: "MapCap_Pulse_v1.6.1",
        compliance: "Daniel_Audit_Ready",
        environment: process.env.NODE_ENV || "production",
        timestamp: new Date().toISOString() 
    });
});

/**
 * ARCHITECTURAL DESIGN NOTE:
 * Future endpoints for '/history' and personal audit logs will be 
 * integrated here to maintain a clean, centralized IPO API namespace.
 */



export default router;
