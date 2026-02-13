/**
 * API Routes - Unified Communication Layer v1.7
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's White-Label Strategy
 * * PURPOSE:
 * Bridges the Frontend Dashboard with core high-precision services.
 * Implements Philip's Scarcity "Water-Level" metrics and Daniel's 
 * A2UaaS (App-to-User-as-a-Service) secure payout pipeline.
 * ---------------------------------------------------------
 */

import express from 'express';
import ipoRoutes from './ipo.routes.js'; // Modular IPO Routes
import PriceService from '../services/price.service.js';
import PayoutService from '../services/payout.service.js';
import ResponseHelper from '../utils/response.helper.js';

const router = express.Router();

/**
 * MODULE INTEGRATION:
 * Mapping the modular IPO routes under the /ipo namespace.
 * This includes dashboard-stats, invest, and status.
 */
router.use('/ipo', ipoRoutes);

/**
 * @route   GET /api/v1/stats
 * @desc    Global Aggregate Pulse for the Ecosystem.
 * Provides broad scarcity engine metrics for public transparency.
 */
router.get('/stats', async (req, res) => {
    try {
        // 1. Snapshot Aggregation (Simulated for real-time pulse)
        const totalPiInvested = 500000; 
        
        // 2. Scarcity Engine Execution
        const currentPrice = PriceService.calculateDailySpotPrice(totalPiInvested);
        const formattedPrice = PriceService.formatPriceForDisplay(currentPrice);

        return ResponseHelper.success(res, "Global Pulse Synchronized", {
            totalPi: totalPiInvested,
            spotPrice: formattedPrice,
            supplyStats: {
                totalMapCap: PriceService.TOTAL_MAPCAP_SUPPLY,
                remaining: PriceService.TOTAL_MAPCAP_SUPPLY - (totalPiInvested * currentPrice)
            },
            compliance: {
                whaleShield: "Active",
                precision: "6-Decimal_Standard"
            }
        });
    } catch (error) {
        return ResponseHelper.error(res, `Global Sync Failure: ${error.message}`, 500);
    }
});

/**
 * @route   POST /api/v1/withdraw
 * @desc    Secure Payout Pipeline (A2UaaS Protocol).
 * Used for manual admin refunds or approved Pioneer withdrawals.
 */
router.post('/withdraw', async (req, res) => {
    const { userWallet, amount } = req.body;

    if (!userWallet || !amount) {
        return ResponseHelper.error(res, "Required: wallet_address & amount", 400);
    }

    try {
        /**
         * EXECUTION:
         * Interacts with PayoutService to trigger the Pi SDK A2U transfer.
         * Fees are auto-deducted within the service layer per Spec Page 5.
         */
        const result = await PayoutService.executeA2UPayout(userWallet, amount);
        
        return ResponseHelper.success(res, "A2U Payout Sequence Initiated", result);
    } catch (error) {
        return ResponseHelper.error(res, `A2U Pipeline Error: ${error.message}`, 500);
    }
});



export default router;
