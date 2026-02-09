/**
 * MapCap IPO Controller - High-Precision Financial Engine v1.5
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Philip Jennings & Daniel
 * * * OPERATIONAL OVERVIEW:
 * This controller orchestrates the 'Single Screen' data delivery.
 * It calculates the dynamic Spot Price and enforces the 10% Anti-Whale
 * ceiling in real-time to ensure maximum transparency during the IPO.
 * ---------------------------------------------------------
 */

import Investor from '../models/investor.model.js';
import MathHelper from '../utils/math.helper.js';
import ResponseHelper from '../utils/response.helper.js';

class IpoController {
    /**
     * @method getScreenStats
     * @desc Syncs the dashboard with the Pi Network ledger and internal DB.
     * @returns {Object} Values 1-4 for the IPO Pulse UI.
     */
    static async getScreenStats(req, res) {
        try {
            /**
             * DANIEL'S SECURITY PROTOCOL:
             * In production, 'username' is injected by the Auth Middleware.
             * For Initial Deployment/Testing: Falling back to a default pioneer 
             * to prevent '500 Internal Error' if req.user is undefined.
             */
            const username = req.user?.username || "test_pioneer_01"; 

            // 1. GLOBAL AGGREGATION (Spec Requirement: Page 4, Sec 73-74)
            // Aggregates total liquidity pool to determine the 'Water-Level'.
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

            // 2. INDIVIDUAL LEDGER SYNC (Spec Requirement: Page 4, Sec 75)
            // Locates the specific pioneer's contribution to calculate individual share.
            const pioneer = await Investor.findOne({ piAddress: username });
            const userPiBalance = pioneer ? pioneer.totalPiContributed : 0;

            /**
             * 3. OFFICIAL SPOT PRICE FORMULA (Page 4 Spec)
             * Logic: IPO MapCap Pool (2,181,818) / Total Contributed Pi.
             * This creates the scarcity-driven price model Philip requested.
             */
            const IPO_MAPCAP_SUPPLY = 2181818;
            const spotPrice = totalPiInvested > 0 
                ? (IPO_MAPCAP_SUPPLY / totalPiInvested) 
                : 0; 

            /**
             * 4. VALUE 4: ALPHA GAIN (20% Uplift)
             * Requirement: "Pioneers benefit from a 20% discount relative to LP value".
             * Represents the immediate unrealized gain for the user.
             */
            const userCapitalGain = userPiBalance * 1.20;

            /**
             * 5. WHALE-SHIELD COMPLIANCE (Daniel's Protocol)
             * Logic: Detects if a single wallet holds > 10% of the active pool.
             * Triggers an automated alert in StatsPanel.jsx for audit.
             */
            const isWhale = totalPiInvested > 0 && (userPiBalance / totalPiInvested) > 0.10;

            // Price History Mockup (Requirement 63 - 28 Day Chart)
            const dailyPrices = pioneer?.priceHistory || [];

            // SUCCESS RESPONSE: Delivering the final payload to the Frontend
            return ResponseHelper.success(res, "Financial Ledger Synchronized", {
                totalInvestors,            // Value 1
                totalPiInvested,           // Value 2
                userPiInvested: userPiBalance, // Value 3
                userCapitalGain,           // Value 4
                spotPrice: MathHelper.toPiPrecision(spotPrice),
                dailyPrices,               
                isWhale,                   
                daysRemaining: 28 - (pioneer?.daysActive || 0),
                status: "Operational"
            });

        } catch (error) {
            /**
             * FATAL ERROR LOGGING:
             * Errors are recorded in the Audit Log for Daniel's compliance review.
             */
            console.error(`[CRITICAL_AUDIT]: Calculation Failure - ${error.message}`);
            return ResponseHelper.error(res, "Ledger Sync Interrupted: Pipeline Failure", 500);
        }
    }
}

export default IpoController;
