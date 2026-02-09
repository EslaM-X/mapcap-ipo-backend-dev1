/**
 * IPO Routes - Dashboard & Pulse Data v1.6 (Production Ready)
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE: 
 * Provides centralized routing for real-time IPO analytics,
 * investment processing, and Whale-Shield compliance monitoring.
 * ---------------------------------------------------------
 */

import express from 'express';
import IpoController from '../controllers/ipo.controller.js';
import PaymentController from '../controllers/payment.controller.js';

const router = express.Router();

/**
 * @route   GET /api/v1/ipo/dashboard-stats
 * @desc    Fetch Values 1, 2, 3, and 4 (Global Stats, User Stake, & Alpha Gain)
 * @access  Protected/Public (Heartbeat of the 'Water-Level' UX)
 */
router.get('/dashboard-stats', IpoController.getScreenStats);

/**
 * @route   POST /api/v1/ipo/invest
 * @desc    Process incoming Pioneer investment post-SDK callback.
 * @access  Protected (Requires Pi Network UID/Auth)
 */
router.post('/invest', PaymentController.processInvestment);

/**
 * @route   GET /api/v1/ipo/status
 * @desc    System Health Check for the IPO Financial Engine.
 * Ensures the 'Pulse' is beating and the database is accessible.
 */
router.get('/status', (req, res) => {
    res.status(200).json({ 
        success: true,
        status: "Operational", 
        engine: "MapCap_Pulse_v1.6",
        compliance: "Daniel_Audit_Ready",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString() 
    });
});

/**
 * FUTURE INTEGRATION HOOKS:
 * -------------------------
 * 1. GET /audit-whale - For Daniel to monitor the 10% cap via Admin Dashboard.
 * 2. GET /history - Returns a Pioneer's personal immutable transaction log.
 */

export default router;
