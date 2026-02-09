/**
 * API Routes - Unified Communication Layer
 * This file exposes the backend services to the Frontend.
 * Following Philip's "Working Demo ASAP" and "White-Label" strategy.
 */
const express = require('express');
const router = express.Router();

// Importing our professional services
const PriceService = require('../services/price.service');
const PayoutService = require('../services/payout.service');

/**
 * @route   GET /api/stats
 * @desc    Fetch real-time IPO stats for the "IPO Pulse Dashboard"
 */
router.get('/stats', async (req, res) => {
    try {
        // In a real scenario, this comes from the database
        const totalPiInvested = 500000; 
        
        // Calculate spot price using Philip's daily formula
        const currentPrice = PriceService.calculateDailySpotPrice(totalPiInvested);
        const formattedPrice = PriceService.formatPriceForDisplay(currentPrice);

        res.json({
            success: true,
            data: {
                totalPi: totalPiInvested,
                spotPrice: formattedPrice,
                mapCapRemaining: PriceService.TOTAL_MAPCAP_SUPPLY - (totalPiInvested * currentPrice),
                status: "IPO Active"
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @route   POST /api/withdraw
 * @desc    Execute a simple Pi withdrawal (A2UaaS)
 */
router.post('/withdraw', async (req, res) => {
    const { userWallet, amount } = req.body;

    if (!userWallet || !amount) {
        return res.status(400).json({ success: false, message: "Missing wallet or amount" });
    }

    try {
        // Using Daniel's requested simple payout logic
        const result = await PayoutService.simpleWithdraw(userWallet, amount);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Transaction failed" });
    }
});

module.exports = router;
