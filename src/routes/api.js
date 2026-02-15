/**
 * API Routes - Unified Communication Layer v1.7.1
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's White-Label Strategy
 * -------------------------------------------------------------------------
 * ARCHITECTURAL ROLE:
 * Bridges the Frontend Dashboard with core high-precision services.
 * Implements Philip's Scarcity "Water-Level" metrics and Daniel's 
 * A2UaaS (App-to-User-as-a-Service) secure payout pipeline.
 * -------------------------------------------------------------------------
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
 * Endpoints: /api/v1/ipo/dashboard-stats, /api/v1/ipo/invest, /api/v1/ipo/status
 */
router.use('/ipo', ipoRoutes);

/**
 * @route   GET /api/v1/stats
 * @desc    Global Aggregate Pulse for the Ecosystem.
 * Provides broad scarcity engine metrics for public transparency.
 * Essential for the landing page 'Pulse' indicators.
 */
router.get('/stats', async (req, res) => {
    try {
        /**
         * 1. SNAPSHOT AGGREGATION:
         * Note: In production, this pulls from a cached 'GlobalMetrics' model.
         */
        const totalPiInvested = 500000; // Placeholder for aggregate liquidity
        
        // 2. SCARCITY ENGINE EXECUTION: Calculating real-time asset value
        const currentPrice = PriceService.calculateDailySpotPrice(totalPiInvested);
        const formattedPrice = PriceService.formatPriceForDisplay(currentPrice);

        return ResponseHelper.success(res, "Global Pulse Synchronized", {
            totalPi: totalPiInvested,
            spotPrice: formattedPrice,
            supplyStats: {
                totalMapCap: PriceService.IPO_MAPCAP_SUPPLY,
                // Remaining supply calculation based on fixed allocation
                remaining: PriceService.IPO_MAPCAP_SUPPLY - (totalPiInvested * currentPrice)
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
 * Used for approved Pioneer withdrawals or direct financial settlements.
 * @access  Protected (Requires administrative/owner-level authorization)
 */
router.post('/withdraw', async (req, res) => {
    const { userWallet, amount } = req.body;

    // VALIDATION: Essential check for A2UaaS metadata
    if (!userWallet || !amount) {
        return ResponseHelper.error(res, "Mandatory fields required: userWallet & amount.", 400);
    }

    try {
        /**
         * EXECUTION:
         * Interacts with PayoutService to trigger the Pi SDK A2U transfer.
         * Fees (0.01 Pi) are auto-deducted within the service layer per Spec Page 5.
         */
        const result = await PayoutService.executeA2UPayout(userWallet, amount);
        
        return ResponseHelper.success(res, "A2U Payout Sequence Initiated", result);
    } catch (error) {
        /**
         * EXCEPTION INTERCEPTOR:
         * Logs failure to Daniel's financial reconciliation pipeline.
         */
        return ResponseHelper.error(res, `A2U Pipeline Error: ${error.message}`, 500);
    }
});



export default router;
