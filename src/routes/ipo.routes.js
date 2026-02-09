/**
 * IPO Routes - Dashboard & Pulse Data v1.4 (Production Build)
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE: 
 * Centralized routing for real-time IPO analytics and status.
 * Connects the 'Single-Screen' Frontend to the Financial Engine,
 * delivering high-precision metrics with minimal latency.
 * ---------------------------------------------------------
 */

import express from 'express';
import IpoController from '../controllers/ipo.controller.js';

const router = express.Router();

/**
 * @route   GET /api/ipo/dashboard-stats
 * @desc    Fetch Values 1, 2, 3, and 4 (Total Investors, Pool Liquidity, User Stake, 20% Alpha)
 * @access  Public (Strategic for the 4-week transparency window)
 * * COMPLIANCE NOTE: 
 * This is the primary heartbeat of the 'Water-Level' UX. 
 * High availability on this route is critical to prevent UI flicker.
 */
router.get('/dashboard-stats', IpoController.getScreenStats);

/**
 * @route   GET /api/ipo/status
 * @desc    System Health Check for the IPO Financial Engine.
 * Monitors uptime and engine versioning for Vercel deployment logs.
 */
router.get('/status', (req, res) => {
    res.status(200).json({ 
        success: true,
        status: "Operational", 
        engine: "MapCap_Pulse_v1.4",
        compliance: "Daniel_Audit_Ready",
        timestamp: new Date().toISOString() 
    });
});

/**
 * ARCHITECTURAL SCALABILITY:
 * Isolated the pulse routes to facilitate future integration of:
 * 1. POST /invest - Pioneer investment processing via A2UaaS.
 * 2. GET /audit-whale - Real-time compliance monitoring for the 10% cap.
 */

export default router;
