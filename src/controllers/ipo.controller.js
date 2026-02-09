/**
 * MapCap IPO Controller - Financial Engine v1.3
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem Backend (Node.js/Express)
 * * * PURPOSE:
 * This controller acts as the central hub for Philip's "Single Screen" layout.
 * It integrates high-precision calculations for the 4 Mandatory Metrics,
 * ensuring Daniel's security and audit standards are maintained.
 */

import Investor from '../models/investor.model.js';
import MathHelper from '../utils/math.helper.js';
import ResponseHelper from '../utils/response.helper.js';
import { IPO_CONFIG } from '../config/ipo.config.js';

class IpoController {
    /**
     * getScreenStats
     * Fetches Value 1, 2, 3, and 4 with high mathematical precision.
     * Required for real-time synchronization with the PriceGraph and StatsPanel.
     */
    static async getScreenStats(req, res) {
        try {
            /**
             * SECURITY CHECK (Daniel's Standard)
             * The username/piAddress comes from the 'auth' middleware 
             * after Pi SDK token verification.
             */
            const { username } = req.user; 

            // 1. GLOBAL AGGREGATION (Philip's Transparency Rule)
            // Efficiently calculates total pool size and headcount in one pass.
            const globalMetrics = await Investor.aggregate([
                { 
                    $group: { 
                        _id: null, 
                        totalPi: { $sum: "$totalPiContributed" }, 
                        investorCount: { $sum: 1 } 
                    } 
                }
            ]);

            const totalPiInvested = globalMetrics[0]?.totalPi || 0;
            const totalInvestors = globalMetrics[0]?.investorCount || 0;

            // 2. INDIVIDUAL LEDGER SYNC (Value 3 & 4)
            const pioneer = await Investor.findOne({ username });
            const userPiBalance = pioneer ? pioneer.totalPiContributed : 0;

            /**
             * 3. FINANCIAL LOGIC (Value 4: Alpha Gain)
             * Calculates the 20% Capital Increase using MathHelper for 
             * Pi-specific precision (Avoids floating point errors).
             */
            const userCapitalGain = MathHelper.calculateAlphaGain(userPiBalance);
            
            /**
             * 4. SPOT PRICE CALCULATION (Water-Level Formula)
             * Derived from the IPO Pool vs Total Contribution.
             */
            const rawSpotPrice = totalPiInvested > 0 
                ? (IPO_CONFIG.POOL_SIZE / totalPiInvested) 
                : IPO_CONFIG.INITIAL_PRICE;
            
            const spotPrice = MathHelper.toPiPrecision(rawSpotPrice);

            // Fetching a simplified daily price history for the SVG graph
            const dailyPrices = pioneer?.priceHistory || [0.31, 0.35, 0.39, 0.42, 0.45];

            /**
             * 5. STANDARDIZED DELIVERY (Daniel's Compliance)
             * Sending the exact structure expected by the Frontend Zod Schema.
             */
            return ResponseHelper.success(res, "MapCap IPO Metrics Sync Complete", {
                totalInvestors,            // Value 1
                totalPiInvested,           // Value 2
                userPiInvested: userPiBalance, // Value 3
                userCapitalGain,           // Value 4
                spotPrice,                 // Current Market Value
                dailyPrices,               // Dataset for PriceGraph.jsx
                status: totalPiInvested < IPO_CONFIG.SOFT_CAP ? "Seeding" : "Liquid"
            });

        } catch (error) {
            // Detailed logging for Daniel's server-side audit trails
            console.error(`[CRITICAL_LEDGER_ERROR]: ${error.message}`);
            return ResponseHelper.error(res, "Audit Failure: Unable to compute IPO stats.", 500);
        }
    }
}

export default IpoController;
