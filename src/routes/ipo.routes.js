/**
 * IPO Routes - Dashboard & Pulse Data
 * ---------------------------------------------------------
 * Centralized routing for public IPO statistics.
 * This file connects the frontend dashboard to the IPO Controller,
 * ensuring real-time delivery of Philip's 4 core valuation metrics.
 * Optimized for the 4-week high-intensity dashboard refresh.
 */

const express = require('express');
const router = express.Router();

// Importing the controller that handles the real DB logic and 20% gain calculation
const IpoController = require('../controllers/ipo.controller');

/**
 * @route   GET /api/ipo/dashboard-stats
 * @desc    Fetch Value 1 (Investors), Value 2 (Total Pi), Value 3 (User Pi), and Value 4 (20% Gain)
 * @access  Public (Strategic for the 4-week IPO transparency)
 */
router.get('/dashboard-stats', IpoController.getScreenStats);

/**
 * NOTE: The logic for calculating the 'Spot Price' and 'Capital Gain' 
 * is now fully encapsulated within the IpoController and PriceService 
 * to maintain clean architecture standards.
 */

module.exports = router;
