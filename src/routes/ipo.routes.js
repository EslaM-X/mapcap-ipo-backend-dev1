/**
 * IPO Routes - Dashboard & Pulse Data v1.2
 * ---------------------------------------------------------
 * Architect: Eslam Kora | AppDev @Map-of-Pi
 * Purpose: 
 * Centralized routing for real-time IPO statistics.
 * This file connects the Frontend Dashboard to the High-Precision 
 * Financial Controller, delivering Philip's 4 core valuation metrics.
 */

import express from 'express';
import IpoController from '../controllers/ipo.controller.js';

const router = express.Router();

/**
 * @route   GET /api/ipo/dashboard-stats
 * @desc    Fetch Values 1, 2, 3, and 4 (Investors, Total Pi, User Pi, 20% Alpha Gain)
 * @access  Public (Strategic for the 4-week high-transparency IPO period)
 * * Compliance Note: 
 * This route is the heartbeat of the 'Single Screen' requirement. 
 * Any latency here affects Philip's 'Water-Level' UX.
 */
router.get('/dashboard-stats', IpoController.getScreenStats);

/**
 * FUTURE SCALABILITY:
 * We've isolated the 'dashboard-stats' to allow Daniel to add 
 * 'Withdrawal' or 'Investment' POST routes here later without 
 * disrupting the primary pulse data flow.
 */

export default router;
