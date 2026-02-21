/**
 * API Routes - Unified Communication Layer v1.7.5 (TS)
 * -------------------------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip's White-Label Strategy
 * -------------------------------------------------------------------------
 * TS CONVERSION LOG:
 * - Implemented strict Express Router typing.
 * - Formalized the 'Stats' response structure for Frontend parity.
 * - Maintained standardized A2UaaS pipeline endpoints.
 */

import express, { Router, Request, Response } from 'express';
import ipoRoutes from './ipo.routes.js'; 
import PriceService from '../services/price.service.js';
import PayoutService from '../services/payout.service.js';
import ResponseHelper from '../utils/response.helper.js';

const router: Router = express.Router();

/**
 * MODULE INTEGRATION:
 * Mapping the modular IPO routes under the /ipo namespace.
 * Ensures compatibility with Frontend endpoints: /api/v1/ipo/*
 */
router.use('/ipo', ipoRoutes);

/**
 * @route   GET /api/v1/stats
 * @desc    Global Aggregate Pulse for the Ecosystem.
 */
router.get('/stats', async (req: Request, res: Response) => {
    try {
        /**
         * 1. SNAPSHOT AGGREGATION:
         * Placeholder value representing the 'Water-Level' (To be dynamic in v1.8).
         */
        const totalPiInvested: number = 500000; 
        
        // 2. SCARCITY ENGINE EXECUTION: Calculating real-time asset value
        const currentPrice: number = PriceService.calculateDailySpotPrice(totalPiInvested);
        const formattedPrice: string = PriceService.formatPriceForDisplay(currentPrice);

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
    } catch (error: any) {
        return ResponseHelper.error(res, `Global Sync Failure: ${error.message}`, 500);
    }
});

/**
 * @route   POST /api/v1/withdraw
 * @desc    Secure Payout Pipeline (A2UaaS Protocol).
 */
router.post('/withdraw', async (req: Request, res: Response) => {
    const { userWallet, amount }: { userWallet: string; amount: number } = req.body;

    if (!userWallet || !amount) {
        return ResponseHelper.error(res, "Mandatory fields required: userWallet & amount.", 400);
    }

    try {
        const result = await PayoutService.executeA2UPayout(userWallet, amount);
        return ResponseHelper.success(res, "A2U Payout Sequence Initiated", result);
    } catch (error: any) {
        return ResponseHelper.error(res, `A2U Pipeline Error: ${error.message}`, 500);
    }
});

export default router;
