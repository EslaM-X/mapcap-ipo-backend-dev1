/**
 * IPO Routes - Dashboard & Pulse Data v1.3 (Production Build)
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * PURPOSE: 
 * Centralized routing for real-time IPO statistics.
 * This file connects the Frontend Dashboard to the High-Precision 
 * Financial Controller, delivering the 'Single Screen' experience.
 * ---------------------------------------------------------
 */

import express from 'express';
import IpoController from '../controllers/ipo.controller.js';

const router = express.Router();

/**
 * @route   GET /api/ipo/dashboard-stats
 * @desc    Fetch Values 1, 2, 3, and 4 (Investors, Total Pi, User Pi, 20% Alpha Gain)
 * @access  Public (Strategic for the 4-week high-transparency IPO period)
 * * COMPLIANCE NOTE: 
 * This route is the heartbeat of the 'Water-Level' UX. Any disruption 
 * here triggers the "Synchronizing..." state in the Frontend.
 */
router.get('/dashboard-stats', IpoController.getScreenStats);

/**
 * @route   GET /api/ipo/status
 * @desc    Health check for the IPO Pulse Engine.
 * Useful for Vercel deployment monitoring.
 */
router.get('/status', (req, res) => {
    res.json({ 
        status: "Operational", 
        engine: "MapCap Pulse v1.3",
        timestamp: new Date().toISOString() 
    });
});

/**
 * FUTURE SCALABILITY:
 * Isolated routes to allow Daniel to integrate 'Investment' POST 
 * and 'Whale-Shield' audits without breaking the primary stats flow.
 */

export default router;
