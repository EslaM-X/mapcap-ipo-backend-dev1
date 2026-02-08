/**
 * IPO Routes - Dashboard & Pulse Data
 * This route provides the real-time statistics for the IPO Pulse Dashboard.
 * Optimized for the 4-week high-intensity IPO cycles.
 */
const express = require('express');
const router = express.Router();
const PriceService = require('../services/price.service');

/**
 * @route   GET /api/ipo/dashboard-stats
 * @desc    Fetch real-time IPO performance, price, and investor metrics.
 * @access  Public (for the IPO duration)
 */
router.get('/dashboard-stats', async (req, res) => {
    try {
        /**
         * For the Demo phase, we use static values. 
         * These will be replaced by real-time database queries once DB is connected.
         */
        const totalPiInvested = 500000; // Simulated investment total
        const totalInvestors = 1250;    // Simulated investor count

        // Calculate the current Spot Price based on Philip's simple formula
        const currentPrice = PriceService.calculateDailySpotPrice(totalPiInvested);
        const formattedPrice = PriceService.formatPriceForDisplay(currentPrice);

        res.json({
            success: true,
            dashboardName: "IPO Pulse Dashboard", // The engaging title approved by Philip
            stats: {
                totalPi: totalPiInvested,
                investorsCount: totalInvestors,
                spotPrice: formattedPrice,
                // Calculate remaining MapCap supply for the white-label configuration
                mapCapRemaining: PriceService.TOTAL_MAPCAP_SUPPLY - (totalPiInvested * currentPrice)
            }
        });
    } catch (error) {
        // Simple and direct error response as requested by Daniel
        res.status(500).json({ 
            success: false, 
            message: "Error fetching IPO pulse data: " + error.message 
        });
    }
});

module.exports = router;
