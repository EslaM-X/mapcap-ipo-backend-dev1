/**
 * API Routes - Unified Communication Layer v1.5
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's White-Label Strategy
 * * PURPOSE:
 * Bridges the Frontend Dashboard with the core financial services.
 * Implements Philip's "Water-Level" metrics and Daniel's A2UaaS payouts.
 * ---------------------------------------------------------
 */

import express from 'express';
import PriceService from '../services/price.service.js';
import PayoutService from '../services/payout.service.js';
import ResponseHelper from '../utils/response.helper.js';

const router = express.Router();

/**
 * @route   GET /api/stats
 * @desc    Fetch real-time IPO stats for the "IPO Pulse Dashboard"
 * Requirement: Value 1 & 2 (Total Pi & Spot Price) [Page 4, 73-74].
 */
router.get('/stats', async (req, res) => {
    try {
        /**
         * REAL-TIME CALCULATION:
         * In production, this pulls live data from the Investor Model.
         * For the "Working Demo ASAP" phase, we use the core PriceService logic.
         */
        const totalPiInvested = 500000; // Snapshot of the current pool
        
        // Calculate spot price using Philip's scarcity-driven formula
        const currentPrice = PriceService.calculateDailySpotPrice(totalPiInvested);
        const formattedPrice = PriceService.formatPrice(currentPrice);

        return ResponseHelper.success(res, "IPO Pulse Data Synchronized", {
            totalPi: totalPiInvested,
            spotPrice: formattedPrice,
            mapCapRemaining: 2181818 - (totalPiInvested * currentPrice),
            status: "IPO Active",
            whaleShield: "Active"
        });
    } catch (error) {
        return ResponseHelper.error(res, `Stats Sync Failed: ${error.message}`, 500);
    }
});

/**
 * @route   POST /api/withdraw
 * @desc    Execute a secure Pi withdrawal (A2UaaS - App-to-User)
 * Requirement: Daniel's requested simple payout logic.
 */
router.post('/withdraw', async (req, res) => {
    const { userWallet, amount } = req.body;

    if (!userWallet || !amount) {
        return ResponseHelper.error(res, "Missing wallet address or amount", 400);
    }

    try {
        /**
         * EXECUTION:
         * Triggers the automated PayoutService to interact with the Pi SDK.
         */
        const result = await PayoutService.executeA2UPayout(userWallet, amount);
        return ResponseHelper.success(res, "Withdrawal Sequence Initiated", result);
    } catch (error) {
        return ResponseHelper.error(res, "Transaction failed: A2U Pipeline Disrupted", 500);
    }
});

export default router;
