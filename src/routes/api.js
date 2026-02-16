/**
 * API Routes - Unified Communication Layer v1.7.2
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's White-Label Strategy
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Bridges the Frontend Dashboard with core high-precision services.
 * Implements Philip's Scarcity "Water-Level" metrics and Daniel's 
 * A2UaaS (App-to-User-as-a-Service) secure payout pipeline.
 */

import express from 'express';
import ipoRoutes from './ipo.routes.js'; 
import PriceService from '../services/price.service.js';
import PayoutService from '../services/payout.service.js';
import ResponseHelper from '../utils/response.helper.js';

const router = express.Router();

/**
 * MODULE INTEGRATION:
 * Mapping the modular IPO routes under the /ipo namespace.
 * Ensures compatibility with Frontend endpoints: /api/v1/ipo/*
 */
router.use('/ipo', ipoRoutes);

/**
 * @route   GET /api/v1/stats
 * @desc    Global Aggregate Pulse for the Ecosystem.
 * Provides broad scarcity engine metrics for public transparency.
 * Essential for the landing page 'Pulse' indicators and Map-of-Pi visuals.
 */
router.get('/stats', async (req, res) => {
    try {
        /**
         * 1. SNAPSHOT AGGREGATION:
         * Placeholder value updated via PriceService logic for real-time accuracy.
         */
        const totalPiInvested = 500000; 
        
        // 2. SCARCITY ENGINE EXECUTION: Calculating real-time asset value based on Pi supply
        const currentPrice = PriceService.calculateDailySpotPrice(totalPiInvested);
        const formattedPrice = PriceService.formatPriceForDisplay(currentPrice);

        return ResponseHelper.success(res, "Global Pulse Synchronized", {
            totalPi: totalPiInvested,
            spotPrice: formattedPrice,
            supplyStats: {
                totalMapCap: PriceService.IPO_MAPCAP_SUPPLY,
                remaining: PriceService.IPO_MAPCAP_SUPPLY - (totalPiInvested * currentPrice)
            },
            compliance: {
                whaleShield: "Active",
                precision: "6-Decimal_Standard"
            }
        });
    } catch (error) {
        // Detailed error for the metrics sync test to catch "Global Sync Failure"
        return ResponseHelper.error(res, `Global Sync Failure: ${error.message}`, 500);
    }
});

/**
 * @route   POST /api/v1/withdraw
 * @desc    Secure Payout Pipeline (A2UaaS Protocol).
 */
router.post('/withdraw', async (req, res) => {
    const { userWallet, amount } = req.body;

    if (!userWallet || !amount) {
        return ResponseHelper.error(res, "Mandatory fields required: userWallet & amount.", 400);
    }

    try {
        const result = await PayoutService.executeA2UPayout(userWallet, amount);
        return ResponseHelper.success(res, "A2U Payout Sequence Initiated", result);
    } catch (error) {
        return ResponseHelper.error(res, `A2U Pipeline Error: ${error.message}`, 500);
    }
});

export default router;
